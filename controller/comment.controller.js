const Blog = require("../model/blog.model");
const Comment = require("../model/comment.model");

const postComment = async (req, res) => {
  try {
    const { name, email, comment, blogId } = req.body;
    if (!name || !comment || !blogId) {
      return res.status(400).json({ message: "All fields are required except email which is optional" });
    }

    // ========== FIINDING BLOG ========== //
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // ========== SAVING COMMENT ========== //
    const newComment = new Comment({
      name,
      email,
      comment,
      blogId,
    });
    await newComment.save();

    // ========== ADDING COMMENT TO BLOG ========== //
    blog.comment.push(newComment);
    await blog.save();
    
    res.status(201).json({
      message: "Comment posted successfully",
      success: true,
    });
  } catch (err) {
      res.status(400).json(err);
  }
}

module.exports = {
    postComment
}