# CleanCut Security and Production Readiness Audit

Date: 2026-06-07
Scope reviewed: `backend`, `frontend`, `admin`

## Executive Summary

The project is **not production ready** in its current state.

The most serious problems are:

1. Anyone can create an admin account and gain privileged access.
2. Any authenticated user can attempt to update another user's account by supplying a different `userId`.
3. Order creation trusts client-provided totals and uses a schema that does not match the data being stored.
4. Authentication responses expose full user/admin records, including password hashes.
5. The upload path does expensive file processing before authorization and has no file size/type limits.
6. The current workspace could not complete a clean build/lint verification, which means release safety is not yet reliable.

If these issues are fixed, the application will move much closer to production readiness because it will have:

- enforceable privilege boundaries
- server-authoritative pricing and order storage
- safer session handling
- more resilient upload handling
- a reproducible release process

## Confirmed Security Vulnerabilities

### 1. Critical: Public admin signup allows full admin takeover

Evidence:

- `backend/src/routes/adminRoutes/adminRouter.ts:21-60`
- `admin/src/pages/Signup.tsx:12-21`

What is wrong:

- The backend exposes `POST /admin/signup` to anyone.
- The admin frontend also exposes a public signup page that calls that route directly.

Impact:

- Any attacker can create an admin account and obtain a valid admin JWT.
- That token can then be used to add, update, or delete products.

Fix:

- Remove public admin self-registration entirely.
- Seed the first admin out of band or through a protected setup flow.
- Add role-based checks on all admin routes.
- Log and alert on admin account creation events.

Why this helps production readiness:

- Production systems need a trustworthy admin boundary. Without that, every other protection is effectively bypassed.

### 2. High: User update route trusts a user ID from the request body

Evidence:

- `backend/src/routes/userRoutes/userRouter.ts:123-142`

What is wrong:

- The route is protected by `userMiddleware`, but it ignores the authenticated identity and instead reads `req.body.userId.userId`.
- An authenticated user can try to submit another user's ID.

Impact:

- Horizontal privilege escalation is possible.
- A user may be able to overwrite another user's profile or password.

Fix:

- Use `req.userId` from the verified JWT instead of any client-provided user ID.
- Validate allowed update fields with Zod.
- Require the current password before password changes.

Why this helps production readiness:

- Correct authorization is a core production requirement. A system cannot be safely deployed if authenticated users can act on other accounts.

### 3. High: Order totals are trusted from the client

Evidence:

- `backend/src/routes/controllers/orderController.ts:12`
- `backend/src/routes/controllers/orderController.ts:28-36`
- `frontend/src/context/ShopContext.tsx:195-214`

What is wrong:

- The frontend sends `totalCost`, `payment_mode`, and address data to the backend.
- The backend stores the client-provided total instead of recalculating the order amount from server-side product data and the cart snapshot.

Impact:

- A malicious client can lower the order total or tamper with order content before submission.
- This creates a direct financial integrity problem.

Fix:

- Rebuild the order from the authenticated user's cart on the server.
- Fetch product prices on the server and calculate the total there.
- Treat client totals as display-only hints, never as a source of truth.

Why this helps production readiness:

- Production commerce flows must have server-authoritative pricing or they cannot be trusted for payment, fulfillment, or reconciliation.

### 4. High: Authentication responses leak full user/admin records, including password hashes

Evidence:

- `backend/src/routes/userRoutes/userRouter.ts:60-64`
- `backend/src/routes/userRoutes/userRouter.ts:111-115`
- `backend/src/routes/adminRoutes/adminRouter.ts:56-60`
- `backend/src/routes/adminRoutes/adminRouter.ts:104-107`

What is wrong:

- The API returns raw `user` and `admin` documents after signup/login.
- Those documents include the hashed password field.

Impact:

- Password hashes are unnecessarily exposed to the client.
- This increases breach impact and leaks sensitive internals that should never leave the server.

Fix:

- Never return password hashes.
- Use a serializer or schema transform to explicitly whitelist safe response fields.
- Consider `select: false` on password fields in Mongoose.

Why this helps production readiness:

- Production APIs should minimize sensitive data exposure by default. This reduces breach scope and improves compliance posture.

### 5. Medium: JWTs do not expire and are stored in `localStorage`

Evidence:

- `backend/src/routes/userRoutes/userRouter.ts:55-58`
- `backend/src/routes/userRoutes/userRouter.ts:106-109`
- `backend/src/routes/adminRoutes/adminRouter.ts:51-54`
- `backend/src/routes/adminRoutes/adminRouter.ts:99-102`
- `frontend/src/context/ShopContext.tsx:91-98`
- `frontend/src/pages/Login.tsx:24-26`
- `frontend/src/pages/Signup.tsx:27-29`
- `admin/src/pages/Login.tsx:20-21`
- `admin/src/pages/Signup.tsx:18-20`

What is wrong:

- Tokens are created without `expiresIn`.
- Tokens are persisted in `localStorage`, which is exposed to any successful XSS payload.

Impact:

- Stolen tokens can remain valid indefinitely.
- Session theft becomes much harder to contain.

Fix:

- Add short-lived access tokens and a refresh strategy.
- Prefer secure, `httpOnly`, `sameSite` cookies for session storage.
- Add logout invalidation or token versioning if you keep JWTs stateless.

Why this helps production readiness:

- Production authentication needs bounded session lifetime and safer token storage to limit blast radius.

### 6. Medium: CORS is fully open

Evidence:

- `backend/src/index.ts:14-20`

What is wrong:

- The API accepts requests from `origin: "*"` and allows `Authorization`.

Impact:

- Any website can call the API from a browser.
- This widens the attack surface and makes it harder to reason about trusted clients.

Fix:

- Replace `*` with a strict allowlist for the real frontend and admin origins.
- Use environment-based origin configuration.

Why this helps production readiness:

- Production services should only serve approved origins so the public attack surface stays intentional.

### 7. Medium: File upload handling is not safely constrained

Evidence:

- `backend/src/routes/adminRoutes/adminRouter.ts:115`
- `backend/src/middleware/multer.ts:3-10`
- `backend/src/routes/controllers/productController.ts:25-29`

What is wrong:

- Multipart parsing runs before `adminMiddleware`, so unauthenticated requests can still consume upload resources.
- `multer` has no file size limits and no MIME/type validation.
- Files are written to disk before upload to Cloudinary.

Impact:

- Attackers can attempt disk or memory exhaustion.
- Non-image content can be uploaded unless Cloudinary rejects it later.

Fix:

- Authenticate before expensive processing where possible.
- Add `limits.fileSize`, accepted MIME checks, and safe filename handling.
- Remove local temp files after successful Cloudinary upload.
- Consider direct-to-object-storage uploads with signed URLs for scale.

Why this helps production readiness:

- Upload flows need abuse controls or they become easy reliability targets under real traffic.

### 8. Low/Medium: Sensitive values are logged and raw error objects are returned

Evidence:

- `backend/src/routes/userRoutes/userRouter.ts:93`
- `backend/src/routes/userRoutes/userRouter.ts:101`
- `backend/src/routes/userRoutes/userRouter.ts:125`
- `backend/src/routes/userRoutes/userRouter.ts:135`
- `backend/src/routes/userRoutes/userRouter.ts:143`
- `backend/src/routes/controllers/productController.ts:61-64`
- `backend/src/routes/index.ts:18-22`

What is wrong:

- User objects, password comparison results, IDs, and password hashes are logged.
- Some endpoints send raw error objects back to clients.

Impact:

- Logs may contain sensitive information.
- Internal details can leak to clients and help attackers map the system.

Fix:

- Remove sensitive `console.log` usage.
- Use centralized structured logging with redaction.
- Return sanitized error messages to clients.

Why this helps production readiness:

- Production observability should help operators without leaking secrets or implementation details.

## Confirmed Functional and Reliability Errors

### 1. Critical: Order schema does not match the order controller or frontend contract

Evidence:

- `backend/src/models/orderModel.ts:3-13`
- `backend/src/routes/controllers/orderController.ts:28-36`
- `frontend/src/context/ShopContext.tsx:202-210`
- `frontend/src/pages/Orders.tsx:183-209`

What is wrong:

- The schema defines `orders`.
- The controller writes `items`, `amount`, `address`, `status`, `date`, and `payment_mode`.
- The frontend expects `cartData`, `item_id`, `totalCost`, and lowercase `status`.

Likely result:

- Orders are stored incorrectly or partially.
- Retrieved orders will not match what the UI expects.
- The orders page can render blank or inconsistent data.

Fix:

- Define one canonical order contract.
- Update the Mongoose schema, controller, and frontend types together.
- Add integration tests for create, fetch, and cancel order flows.

### 2. High: `DELETE /orders/:orderId` ignores the route parameter

Evidence:

- `backend/src/routes/orderRoutes/orderRouter.ts:11`
- `backend/src/routes/controllers/orderController.ts:62-76`

What is wrong:

- The route declares `/:orderId`.
- The controller reads `req.body.orderId` instead of `req.params.orderId`.

Impact:

- Cancel order calls are unreliable and can fail unexpectedly.

Fix:

- Read `req.params.orderId`.
- Validate it before querying.

### 3. High: Frontend signup page calls the login endpoint

Evidence:

- `frontend/src/pages/Signup.tsx:19-24`

What is wrong:

- The signup form posts to `/user/login` instead of `/user/signup`.

Impact:

- New users cannot reliably register.
- The page behavior is misleading and broken.

Fix:

- Point the request to `/user/signup`.
- Update the headings and failure messages to match signup behavior.

### 4. Medium: Admin signup success does not reliably redirect

Evidence:

- `admin/src/pages/Signup.tsx:18-21`
- `admin/src/pages/Signup.tsx:96-101`

What is wrong:

- `setLogin(true)` is asynchronous.
- Navigation is checked immediately afterward, so the redirect may not happen after successful signup.

Fix:

- Navigate directly after a successful API response instead of depending on the pending state update.

### 5. Medium: Product upload controller can throw before validation if `req.files` is missing

Evidence:

- `backend/src/routes/controllers/productController.ts:9-18`

What is wrong:

- `files.image1` is accessed before confirming `req.files` exists.

Impact:

- A malformed request can trigger a server error path before proper validation.

Fix:

- Guard `req.files` before property access.
- Validate the payload shape before using it.

### 6. Medium: Order status casing is inconsistent across backend and frontend

Evidence:

- `backend/src/routes/controllers/orderController.ts:33`
- `frontend/src/context/ShopContext.tsx:209`
- `frontend/src/pages/Orders.tsx:139-141`

What is wrong:

- Backend writes `"Processing"`.
- Frontend creates and filters for `"processing"`.

Impact:

- Filters and status badges can behave incorrectly.

Fix:

- Standardize status values as a strict enum shared across tiers.

## Release Engineering and Production Readiness Gaps

### 1. The backend has no usable automated test suite

Evidence:

- `backend/package.json:5-8`

What is wrong:

- The `test` script intentionally exits with an error.
- There are no backend tests protecting auth, orders, cart, or admin flows.

Why this matters:

- Production readiness requires regression protection for the most sensitive paths.

### 2. The backend `build` script starts the server instead of only compiling

Evidence:

- `backend/package.json:5-8`

What is wrong:

- `build` runs `tsc -b && node dist/index.js`.

Impact:

- CI/CD builds are harder to reason about.
- A build step should not also become a long-running runtime step.

Fix:

- Split into `build`, `start`, and `dev` scripts.

### 3. Frontend/admin build verification is not currently reproducible in this workspace

Evidence:

- `frontend/tsconfig.app.json:22`
- `admin/tsconfig.app.json:22`
- `frontend/package.json:6-10`
- `admin/package.json:6-10`

Observed during review:

- `npm run build` failed in both `frontend` and `admin`.
- `npm run lint` failed because `eslint` was not available in the current environment.
- The active TypeScript compiler also rejected `erasableSyntaxOnly`.

Why this matters:

- A production-ready app needs repeatable build, lint, and test steps in local development and CI.

Recommended action:

- Standardize the Node/TypeScript toolchain version.
- Ensure installs are documented and reproducible.
- Add CI that fails on build, lint, and tests before deployment.

## How Fixing These Issues Makes the App Production Ready

### Access control becomes trustworthy

Fixing public admin creation, user update authorization, token lifetime, and response data leakage means:

- only approved users can administer the platform
- users can only modify their own accounts
- stolen sessions are less durable
- sensitive authentication data no longer leaks to clients

This is the baseline required for operating a public internet-facing app.

### Orders become financially and operationally correct

Fixing server-side price calculation, order schema mismatches, and status normalization means:

- customers cannot tamper with totals
- saved orders match what the UI and fulfillment logic expect
- support and analytics can rely on the stored order data

This is what turns the checkout flow from a demo into a real transaction pipeline.

### The app becomes more resilient under real traffic

Fixing upload validation, auth-before-expensive-work, strict request validation, and sanitized error handling means:

- the server is harder to abuse
- malformed requests fail cleanly
- logs are safer to retain
- production incidents are easier to diagnose

This reduces both security risk and operational instability.

### Deployments become safer and repeatable

Fixing the build/test pipeline, separating build from runtime, and adding automated verification means:

- releases are predictable
- regressions are caught before production
- new contributors can reproduce the environment

This is what makes the system maintainable as the team or feature set grows.

## Recommended Remediation Order

1. Remove public admin signup and fix the user update authorization flaw.
2. Stop returning password hashes and add token expiration.
3. Redesign the order schema and make totals server-authoritative.
4. Secure the upload pipeline with auth ordering, size/type limits, and temp-file cleanup.
5. Standardize API response shapes and status enums across backend and frontend.
6. Restore a clean build/lint/test pipeline and add automated tests for auth, cart, products, and orders.

## Minimum Definition of Production Ready After Remediation

The app will be close to production ready when all of the following are true:

- admin creation is private and audited
- all protected routes enforce authorization from server-trusted identity
- auth responses exclude password hashes and other sensitive internals
- JWT/session handling has expiration and secure storage
- orders are validated and priced on the server
- order schema, backend responses, and frontend types all match
- uploads are size-limited, type-checked, and cleaned up safely
- CORS is restricted to known frontend/admin origins
- build, lint, and automated tests pass in CI
- production logging, env validation, and error handling are in place

## Verification Notes

Commands attempted during this review:

- `frontend`: `npm run build`, `npm run lint`
- `admin`: `npm run build`, `npm run lint`
- `backend`: TypeScript compile check

Observed result:

- Frontend/admin build steps failed in the current workspace before a full runtime verification could be completed.
- Backend has no working automated test script today.

That means the findings above are based on direct code inspection plus the partial command verification that was possible in the current checkout.
