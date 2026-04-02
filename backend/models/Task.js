const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "Incomplete" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task; 