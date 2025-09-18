# TODO List for Fixing 401 Unauthorized Error

- [x] Edit crud-post-operation/backend/lib/utils/generateToken.js: Change sameSite to "none" and adjust secure setting
- [x] Edit crud-post-operation/backend/middleware/protectRoute.js: Simplify JWT verification and error handling
- [x] Edit crud-post-operation/backend/routes/auth.route.js: Update import to default
- [x] Edit crud-post-operation/backend/routes/post.route.js: Update import to default
- [ ] Restart backend server
- [ ] Test login flow and verify cookie is sent
