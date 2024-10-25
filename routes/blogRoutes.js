const express = require('express');
const {
  getAllBlogController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogController,
} = require('../controllers/blogController');

//router object
const router = express.Router();

//routes
//GET || all blogs
router.get('/all-blog', getAllBlogController);

//POST || create blogs
router.post('/create-blog', createBlogController);

//POST || Update blogs
router.put('/update-blog/:id', updateBlogController);

//GET || Single blog details
router.get('/get-blog/:id', getBlogByIdController);

//Delete || detele blog
router.delete('/delete-blog/:id', deleteBlogController);

//GET || user blog
router.get('/user-blog/:id', userBlogController);

module.exports = router;
