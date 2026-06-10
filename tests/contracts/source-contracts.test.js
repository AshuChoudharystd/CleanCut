const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");

function readWorkspaceFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("frontend signup page should submit to the user signup endpoint", () => {
  const source = readWorkspaceFile("frontend/src/pages/Signup.tsx");

  assert.match(source, /\/user\/signup/);
  assert.doesNotMatch(source, /\/user\/login/);
});

test("frontend order status filters should use the same casing as the backend order controller", () => {
  const frontendSource = readWorkspaceFile("frontend/src/pages/Orders.tsx");
  const backendSource = readWorkspaceFile("backend/src/routes/controllers/orderController.ts");

  const frontendUsesLowercase = /["']processing["']/.test(frontendSource);
  const backendUsesCapitalized = /["']Processing["']/.test(backendSource);

  assert.equal(frontendUsesLowercase && backendUsesCapitalized, false);
});

test("frontend api client should support automatic token refresh", () => {
  const source = readWorkspaceFile("frontend/src/lib/api.ts");

  assert.match(source, /\/user\/refresh/);
  assert.match(source, /interceptors\.response/);
});

test("admin api client should support automatic token refresh", () => {
  const source = readWorkspaceFile("admin/src/lib/api.ts");

  assert.match(source, /\/admin\/refresh/);
  assert.match(source, /interceptors\.response/);
});

test("backend auth responses should not serialize password fields back to clients", () => {
  const userRouterSource = readWorkspaceFile("backend/src/routes/userRoutes/userRouter.ts");
  const adminRouterSource = readWorkspaceFile("backend/src/routes/adminRoutes/adminRouter.ts");

  assert.doesNotMatch(userRouterSource, /user:\s*user/);
  assert.doesNotMatch(adminRouterSource, /admin:\s*admin/);
});
