const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

const ROOT = path.resolve(__dirname, "..", "..");
const BACKEND_ROOT = path.join(ROOT, "backend");

process.env.USER_JWT_SECRET = process.env.USER_JWT_SECRET || "user-secret";
process.env.ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-secret";

const express = require(path.join(BACKEND_ROOT, "node_modules", "express"));
const cookieParser = require(path.join(BACKEND_ROOT, "node_modules", "cookie-parser"));
const bcrypt = require(path.join(BACKEND_ROOT, "node_modules", "bcrypt"));
const jwt = require(path.join(BACKEND_ROOT, "node_modules", "jsonwebtoken"));

const userRouter = require(path.join(
  BACKEND_ROOT,
  "dist",
  "routes",
  "userRoutes",
  "userRouter.js"
)).default;
const adminRouter = require(path.join(
  BACKEND_ROOT,
  "dist",
  "routes",
  "adminRoutes",
  "adminRouter.js"
)).default;
const orderRouter = require(path.join(
  BACKEND_ROOT,
  "dist",
  "routes",
  "orderRoutes",
  "orderRouter.js"
)).default;
const userMiddleware = require(path.join(
  BACKEND_ROOT,
  "dist",
  "middleware",
  "userMiddleware.js"
)).default;
const adminMiddleware = require(path.join(
  BACKEND_ROOT,
  "dist",
  "middleware",
  "adminMiddleware.js"
)).default;
const userModel = require(path.join(
  BACKEND_ROOT,
  "dist",
  "models",
  "userModel.js"
)).default;
const adminModel = require(path.join(
  BACKEND_ROOT,
  "dist",
  "models",
  "adminModel.js"
)).default;
const orderModel = require(path.join(
  BACKEND_ROOT,
  "dist",
  "models",
  "orderModel.js"
)).default;

function stubMethod(object, key, implementation) {
  const original = object[key];
  object[key] = implementation;
  return () => {
    object[key] = original;
  };
}

function createResponseRecorder() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

async function withServer(router, run) {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use(router);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

async function requestJson(baseUrl, route, options = {}) {
  const headers = { ...(options.headers || {}) };
  let body;

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body,
  });

  const raw = await response.text();
  let parsed = raw;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
  } else {
    parsed = null;
  }

  return { status: response.status, body: parsed };
}

test("user middleware rejects requests without an authorization header", () => {
  const response = createResponseRecorder();
  let nextCalled = false;

  userMiddleware({ headers: {} }, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.payload, { error: "Unauthorized access" });
});

test("admin middleware rejects invalid tokens", () => {
  const restoreVerify = stubMethod(jwt, "verify", () => {
    throw new Error("invalid token");
  });
  const response = createResponseRecorder();
  let nextCalled = false;

  try {
    adminMiddleware({ headers: { authorization: "bad-token" } }, response, () => {
      nextCalled = true;
    });
  } finally {
    restoreVerify();
  }

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.payload, { error: "Invalid or expired token" });
});

test("POST /signup should not expose a password hash in the user response", async () => {
  const restoreHash = stubMethod(bcrypt, "hash", async () => "hashed-password");
  const restoreCreate = stubMethod(userModel, "create", async ({ name, email, password }) => ({
    _id: "user-1",
    name,
    email,
    password,
  }));
  const restoreSign = stubMethod(jwt, "sign", () => "signed-user-token");
  const restoreLog = stubMethod(console, "log", () => {});

  try {
    await withServer(userRouter, async (baseUrl) => {
      const response = await requestJson(baseUrl, "/signup", {
        method: "POST",
        body: {
          name: "Test User",
          email: "user@example.com",
          password: "password123",
        },
      });

      assert.equal(response.status, 201);
      assert.equal(response.body.user.password, undefined);
    });
  } finally {
    restoreHash();
    restoreCreate();
    restoreSign();
    restoreLog();
  }
});

test("POST /login should not expose a password hash in the user response", async () => {
  const restoreFindOne = stubMethod(userModel, "findOne", async () => ({
    _id: "user-1",
    name: "Test User",
    email: "user@example.com",
    password: "stored-password-hash",
  }));
  const restoreCompare = stubMethod(bcrypt, "compare", async () => true);
  const restoreSign = stubMethod(jwt, "sign", () => "signed-user-token");
  const restoreLog = stubMethod(console, "log", () => {});

  try {
    await withServer(userRouter, async (baseUrl) => {
      const response = await requestJson(baseUrl, "/login", {
        method: "POST",
        body: {
          email: "user@example.com",
          password: "password123",
        },
      });

      assert.equal(response.status, 200);
      assert.equal(response.body.user.password, undefined);
    });
  } finally {
    restoreFindOne();
    restoreCompare();
    restoreSign();
    restoreLog();
  }
});

test("PUT /update should use the authenticated user id instead of trusting the request body", async () => {
  let updatedUserId;

  const restoreVerify = stubMethod(jwt, "verify", () => ({ userId: "token-user-id" }));
  const restoreHash = stubMethod(bcrypt, "hash", async () => "new-password-hash");
  const restoreCompare = stubMethod(bcrypt, "compare", async () => true);
  const restoreFindById = stubMethod(userModel, "findById", async (userId) => ({
    _id: userId,
    name: "Test User",
    email: "user@example.com",
    password: "stored-hash",
  }));
  const restoreUpdate = stubMethod(
    userModel,
    "findByIdAndUpdate",
    async (userId, update) => {
      updatedUserId = userId;
      return { _id: userId, ...update };
    }
  );
  const restoreLog = stubMethod(console, "log", () => {});
  const restoreError = stubMethod(console, "error", () => {});

  try {
    await withServer(userRouter, async (baseUrl) => {
      const response = await requestJson(baseUrl, "/update", {
        method: "PUT",
        headers: {
          Authorization: "good-token",
        },
        body: {
          userId: { userId: "body-user-id" },
          name: "Updated User",
          password: "password123",
          currentPassword: "oldpassword",
        },
      });

      assert.equal(response.status, 200);
      assert.equal(updatedUserId, "token-user-id");
    });
  } finally {
    restoreVerify();
    restoreHash();
    restoreCompare();
    restoreFindById();
    restoreUpdate();
    restoreLog();
    restoreError();
  }
});

test("DELETE /:orderId should cancel the order referenced by the route parameter", async () => {
  let lookedUpOrderId;
  let deletedOrderId;

  const restoreVerify = stubMethod(jwt, "verify", () => ({ userId: "token-user-id" }));
  const restoreFindOne = stubMethod(orderModel, "findOne", async (query) => {
    lookedUpOrderId = query._id;
    return { _id: query._id, status: "Processing", items: {} };
  });
  const restoreDeleteOne = stubMethod(orderModel, "deleteOne", async (query) => {
    deletedOrderId = query._id;
  });
  const restoreError = stubMethod(console, "error", () => {});

  try {
    await withServer(orderRouter, async (baseUrl) => {
      const response = await requestJson(baseUrl, "/order-123", {
        method: "DELETE",
        headers: {
          Authorization: "good-token",
        },
      });

      assert.equal(response.status, 200);
      assert.equal(lookedUpOrderId, "order-123");
      assert.equal(deletedOrderId, "order-123");
    });
  } finally {
    restoreVerify();
    restoreFindOne();
    restoreDeleteOne();
    restoreError();
  }
});

test("POST /signup on the admin router should not be publicly available in a production-safe app", async () => {
  const restoreHash = stubMethod(bcrypt, "hash", async () => "hashed-password");
  const restoreCreate = stubMethod(adminModel, "create", async ({ email, password }) => ({
    _id: "admin-1",
    email,
    password,
  }));
  const restoreSign = stubMethod(jwt, "sign", () => "signed-admin-token");

  try {
    await withServer(adminRouter, async (baseUrl) => {
      const response = await requestJson(baseUrl, "/signup", {
        method: "POST",
        body: {
          email: "admin@example.com",
          password: "password123",
        },
      });

      assert.ok(response.status >= 400);
    });
  } finally {
    restoreHash();
    restoreCreate();
    restoreSign();
  }
});

test("POST /user/refresh should issue a new access token when refresh token is valid", async () => {
  const restoreVerify = stubMethod(jwt, "verify", (token) => {
    if (token === "valid-refresh") {
      return { userId: "user-1", type: "refresh" };
    }
    throw new Error("invalid");
  });
  const restoreFindById = stubMethod(userModel, "findById", async () => ({
    _id: "user-1",
    name: "Test User",
    email: "user@example.com",
  }));
  const restoreSign = stubMethod(jwt, "sign", () => "new-access-token");

  try {
    await withServer(userRouter, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/refresh`, {
        method: "POST",
        headers: {
          Cookie: "userRefreshToken=valid-refresh",
        },
      });

      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.message, "Token refreshed");
      assert.equal(body.token, "new-access-token");
    });
  } finally {
    restoreVerify();
    restoreFindById();
    restoreSign();
  }
});

test("POST /user/refresh should reject requests without a refresh token", async () => {
  await withServer(userRouter, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/refresh`, { method: "POST" });
    assert.equal(response.status, 401);
  });
});

test("POST /admin/refresh should issue a new access token when refresh token is valid", async () => {
  const restoreVerify = stubMethod(jwt, "verify", (token) => {
    if (token === "valid-admin-refresh") {
      return { adminId: "admin-1", type: "refresh" };
    }
    throw new Error("invalid");
  });
  const restoreFindById = stubMethod(adminModel, "findById", async () => ({
    _id: "admin-1",
    email: "admin@example.com",
  }));
  const restoreSign = stubMethod(jwt, "sign", () => "new-admin-access-token");

  try {
    await withServer(adminRouter, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/refresh`, {
        method: "POST",
        headers: {
          Cookie: "adminRefreshToken=valid-admin-refresh",
        },
      });

      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.message, "Token refreshed");
      assert.equal(body.token, "new-admin-access-token");
    });
  } finally {
    restoreVerify();
    restoreFindById();
    restoreSign();
  }
});

test("backend order model should contain the fields used by the order controller and UI", () => {
  const orderModelSource = fs.readFileSync(
    path.join(ROOT, "backend", "src", "models", "orderModel.ts"),
    "utf8"
  );

  assert.match(orderModelSource, /\baddress\s*:/);
  assert.match(orderModelSource, /\bstatus\s*:/);
  assert.match(orderModelSource, /\bpayment_mode\s*:/);
  assert.match(orderModelSource, /\bdate\s*:/);
});
