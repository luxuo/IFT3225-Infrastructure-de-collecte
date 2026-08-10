const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    locationId: {
      type: Number,
      required: true,
      index: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    strict: "throw"
  }
);

commentSchema.index({ locationId: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;