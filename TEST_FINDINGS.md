# CleanCut Test Plan and Findings

Date: 2026-06-09

## What I Added

I added a lightweight repo-level automated test harness and two concrete test suites:

- `package.json`
  - root test runner using Node's built-in test framework
- `tests/backend/api-behavior.test.js`
  - backend middleware and API behavior tests
- `tests/contracts/source-contracts.test.js`
  - source-contract regression tests for frontend/backend alignment

## Test Types Required For This Project

These are the test categories this project needs to be production ready:

1. Unit tests
   - middleware behavior
   - route/controller behavior
   - pure data transformation logic
2. API contract tests
   - request validation
   - response shape validation
   - auth and authorization guarantees
3. Integration tests
   - auth -> cart -> order flow
   - admin product management flow
   - database model/controller compatibility
4. Source-contract regression tests
   - frontend endpoint wiring
   - frontend/backend enum and payload alignment
5. Static quality gates
   - TypeScript compile/build
   - ESLint
6. Security checks
   - dependency audit
   - auth exposure checks
   - privilege-boundary checks
7. Recommended next tests not automated yet
   - browser E2E checkout flow
   - accessibility tests
   - performance/load tests
   - database-backed integration tests against an isolated test DB

## Tests I Ran

### 1. Repo behavior tests

Command:

- `npm test`

Result:

- 11 tests executed
- 2 passed
- 9 failed

Passing tests:

- `user middleware rejects requests without an authorization header`
- `admin middleware rejects invalid tokens`

Failing tests:

- `POST /signup should not expose a password hash in the user response`
- `POST /login should not expose a password hash in the user response`
- `PUT /update should use the authenticated user id instead of trusting the request body`
- `DELETE /:orderId should cancel the order referenced by the route parameter`
- `POST /signup on the admin router should not be publicly available in a production-safe app`
- `backend order model should contain the fields used by the order controller and UI`
- `frontend signup page should submit to the user signup endpoint`
- `frontend order status filters should use the same casing as the backend order controller`
- `backend auth responses should not serialize password fields back to clients`

What these failures prove:

- auth responses leak sensitive data
- authorization boundaries are broken
- order cancellation is broken
- public admin registration is still enabled
- the order model does not match controller/UI expectations
- the frontend signup flow is wired to the wrong endpoint
- frontend and backend order status values are inconsistent

### 2. Backend compile gate

Command:

- `tsc -b` in `backend`

Result:

- Passed

Meaning:

- the backend TypeScript currently compiles successfully

### 3. Frontend production build gate

Command:

- `npm run build` in `frontend`

Result:

- Passed

Meaning:

- the customer frontend can currently produce a production bundle

### 4. Admin production build gate

Command:

- `npm run build` in `admin`

Result:

- Passed

Meaning:

- the admin frontend can currently produce a production bundle

### 5. Frontend lint gate

Command:

- `npm run lint` in `frontend`

Result:

- Failed with 10 errors and 6 warnings

Main problems found:

- `no-explicit-any` violations in:
  - `frontend/src/components/BestSeller.tsx`
  - `frontend/src/components/LatestCollections.tsx`
  - `frontend/src/components/RelatedProduct.tsx`
  - `frontend/src/context/ShopContext.tsx`
  - `frontend/src/pages/Collection.tsx`
  - `frontend/src/pages/Product.tsx`
- hook dependency warnings in:
  - `frontend/src/components/RelatedProduct.tsx`
  - `frontend/src/context/ShopContext.tsx`
  - `frontend/src/pages/Collection.tsx`
  - `frontend/src/pages/PlaceOrder.tsx`
  - `frontend/src/pages/Product.tsx`
- invalid empty object destructuring in:
  - `frontend/src/pages/Signup.tsx`

Meaning:

- the frontend is buildable, but not lint-clean enough for a disciplined production pipeline

### 6. Admin lint gate

Command:

- `npm run lint` in `admin`

Result:

- Failed with 7 errors

Main problems found:

- `no-explicit-any` violations in:
  - `admin/src/context/AdminContext.tsx`
  - `admin/src/pages/AddProducts.tsx`
  - `admin/src/pages/UpdateProducts.tsx`
- React refresh export rule violation in:
  - `admin/src/context/AdminContext.tsx`

Meaning:

- the admin app is buildable, but not lint-clean enough for a disciplined production pipeline

### 7. Production dependency audit

Commands:

- `npm audit --omit=dev` in `backend`
- `npm audit --omit=dev` in `frontend`
- `npm audit --omit=dev` in `admin`

Result:

- all three reported `found 0 vulnerabilities`

Important note:

- during `npm install`, npm reported additional vulnerabilities in frontend/admin dependency trees, which strongly suggests the remaining issues are in dev dependencies rather than production dependencies

## Findings By Severity

### Critical

- Public admin signup is still enabled and test-covered as unsafe.
- Auth endpoints still serialize password hashes back to clients.

### High

- The user update route trusts a request-body user ID instead of the authenticated identity.
- Order deletion is broken because the controller does not use the route parameter.
- The order schema still does not match what the controller and frontend use.
- The frontend signup page still posts to `/user/login` instead of `/user/signup`.

### Medium

- Frontend and backend order status values are inconsistent.
- Frontend and admin apps both fail lint quality gates.

## Production Readiness Assessment After Testing

Current state:

- buildable: yes
- lint clean: no
- behaviorally correct: no
- privilege safe: no
- contract aligned across tiers: no
- production dependency audit clean: yes

Conclusion:

- the project is **not production ready**

## Recommended Next Fix Order

1. Remove public admin signup.
2. Stop returning raw user/admin documents and password hashes.
3. Fix `PUT /user/update` to use the authenticated user ID only.
4. Fix order cancellation to use `req.params.orderId`.
5. Redesign the order schema so backend and frontend share one consistent contract.
6. Fix frontend signup to call `/user/signup`.
7. Normalize order status values across backend and frontend.
8. Clean up frontend/admin lint failures and add these tests to CI.

## Notes About Coverage

The new tests are intentionally aimed at the highest-risk areas first:

- auth safety
- privilege boundaries
- order correctness
- frontend/backend contract drift

What still should be added after the app logic is repaired:

- database-backed integration tests
- browser E2E tests for customer purchase flow
- browser E2E tests for admin product management
- accessibility checks
- performance and load tests
