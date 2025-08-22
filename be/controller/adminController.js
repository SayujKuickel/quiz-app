const QuestionSet = require("../model/QuestionSetModel");

async function createQuestionSetController(req, res) {
  try {
    const data = req.body;
    const { id, role } = req.user || {};

    if (!id) {
      return res.status(401).json({ message: "Unauthorized: no user found" });
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    const finalData = {
      ...data,
      createdBy: id,
    };

    const createSet = new QuestionSet(finalData);
    await createSet.save();

    return res.status(201).json({
      message: "Question Set Created Successfully",
      questionSetId: createSet._id,
    });
  } catch (error) {
    console.error("Error creating question set:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid data",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createQuestionSetController,
};
