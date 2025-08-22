const AnswerModel = require("../model/AnswerModel");
const QuestionSet = require("../model/QuestionSetModel");

async function listQuestionSetController(req, res) {
  try {
    const questionSet = await QuestionSet.aggregate([
      {
        $project: {
          title: 1,
          questionCount: { $size: { $ifNull: ["$questions", []] } },
        },
      },
    ]);

    return res.json({ questionSet });
  } catch (error) {
    console.error("Error listing question sets:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getQuestionSetController(req, res) {
  try {
    const { id } = req.params;

    const questionSet = await QuestionSet.findById(id).select(
      "-questions.choices.correctAnswer"
    );

    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    return res.json(questionSet);
  } catch (error) {
    console.error("Error fetching question set:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function saveAttemptedQuestionController(req, res) {
  try {
    const { questionSet: questionSetId, responses } = req.body;
    const { id: userId } = req.user;

    const questionSet = await QuestionSet.findById(questionSetId).select(
      "questions._id questions.choices._id questions.choices.correctAnswer"
    );

    if (!questionSet) {
      return res.status(404).json({ message: "QuestionSet not found" });
    }

    const result = (responses || []).reduce(
      (acc, current) => {
        const questions = Array.isArray(questionSet?.questions)
          ? questionSet.questions
          : [];

        // find question
        const q = questions.find(
          (qn) => String(qn._id) === String(current.questionId)
        );
        if (!q) return acc;

        // collect correct choice ids
        const correctIds = (q.choices || []).reduce((ids, c) => {
          if (c?.correctAnswer) ids.push(String(c._id));
          return ids;
        }, []);

        // selected ids
        const selected = current.selectedChoiceIds || [];

        // check exact match
        const allSelectedAreCorrect = selected.every((selId) =>
          correctIds.includes(String(selId))
        );
        const allCorrectWereSelected = correctIds.every((cid) =>
          selected.includes(String(cid))
        );
        const isCorrect =
          allSelectedAreCorrect &&
          allCorrectWereSelected &&
          selected.length === correctIds.length;

        acc.total += 1;
        if (isCorrect) acc.score += 1;

        acc.details.push({
          questionId: String(q._id),
          selectedChoiceIds: selected.map(String),
          isCorrect,
        });

        return acc;
      },
      { score: 0, total: 0, details: [] }
    );

    const saveAnswer = new AnswerModel({
      questionSet: questionSetId,
      user: userId,
      responses,
      score: result.score,
      total: result.total,
    });

    await saveAnswer.save();

    return res.status(201).json({
      message: "Graded",
      data: {
        score: result.score,
        total: result.total,
        details: result.details,
        attemptId: saveAnswer._id,
      },
    });
  } catch (error) {
    console.error("Error saving attempted question:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
};
