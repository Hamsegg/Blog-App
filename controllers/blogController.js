const mongoose = require('mongoose');
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

//GET all blogs
exports.getAllBlogController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate('user');
    if (!blogs) {
      return res.send(200).send({
        success: true,
        message: 'No blog found',
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: 'All blog list',
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while Getting Blogs',
      error,
    });
  }
};

//create blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    //validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: 'Please Provide All fields',
      });
    }
    const existingUser = await userModel.findById(user);
    //user validation
    if (!existingUser) {
      return res.send(404).send({
        success: false,
        message: 'unable to fing user',
      });
    }

    const newBlog = new blogModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();
    return res.status(201).send({
      success: true,
      message: 'Blog created',
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error while creating Blogs',
      error,
    });
  }
};

//update blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: 'Blog Updated',
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error while updating Blogs',
      error,
    });
  }
};

//single blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: 'Error while getting single blog',
        error,
      });
    }
    return res.status(200).send({
      success: true,
      message: 'fetch single blog',
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error while updating Blogs',
      error,
    });
  }
};

//delete blog
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate('user');
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: 'Blog Deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error while deleting Blogs',
      error,
    });
  }
};

exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate('blogs');
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: 'blog not found with this id',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'user blogs',
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error while getting Blogs',
      error,
    });
  }
};
