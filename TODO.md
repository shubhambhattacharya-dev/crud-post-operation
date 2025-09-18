# TODO: Fix Image Upload Issues in CRUD Post Operation

## Completed Tasks
- [x] Analyze backend and frontend code for image upload issues
- [x] Identify mismatch: Frontend sends Base64 JSON, backend expects multipart/form-data
- [x] Update backend/server.js to increase express.json and express.urlencoded limits to 10mb
- [x] Update frontend/CreatePost.jsx to use FormData for multipart/form-data upload
- [x] Ensure FormData appends "image" field to match multer.single("image")

## Pending Tasks
- [ ] Test the create post functionality with image upload
- [ ] Verify no 413 Payload Too Large errors
- [ ] Verify image URL is saved in database and displayed in posts
- [ ] If issues persist, debug req.file and req.body in backend controller
- [ ] Optionally, add client-side image compression for large files

## Notes
- Backend createPost controller and multer setup are correct
- Frontend now sends file as multipart/form-data with "image" field
- Restart backend server after changes to apply new limits
