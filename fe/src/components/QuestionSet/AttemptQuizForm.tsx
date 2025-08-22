import React, { useState } from "react";
import type { IAttempQuestionForm } from "../../pages/QuestionSet/AttemptQuizPage";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import axios from "axios";

export interface IAttemptQuizFinalData {
  questionSet: string;
  responses: {
    questionId: string;
    selectedChoicesIds: string[];
  }[];
}

function AttemptQuizForm({
  questionSet,
}: {
  questionSet: IAttempQuestionForm;
}) {
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null
  );

  const methods = useForm({ defaultValues: questionSet });
  const { handleSubmit } = methods;

  const onSubmitHandler = (data: IAttempQuestionForm) => {
    const accessToken = localStorage.getItem("accessToken");

    const finalData: IAttemptQuizFinalData = {
      questionSet: data._id,
      responses: data.questions.map((q) => ({
        questionId: q._id,
        selectedChoicesIds: q.choices
          .filter((c) => c.selected)
          .map((c) => c._id),
      })),
    };

    axios
      .post("http://localhost:3000/api/questions/answer/attempt", finalData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setResult(res.data.data))
      .catch(() => alert("Error submitting answers"));
  };

  const cardClass =
    "p-4 mb-4 border-2 border-black rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white";
  const buttonClass =
    "mt-4 px-4 py-2 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform";

  if (result) {
    return (
      <div className="text-center font-bold text-black mt-6 text-xl">
        Your Score is {result.score || 0} out of {result.total || 0} questions
        attempted.
      </div>
    );
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2 className="text-2xl font-extrabold text-primary mb-4">
            {questionSet.title}
          </h2>
          <CreateQuestions cardClass={cardClass} />
          <button type="submit" className={buttonClass}>
            Submit Answers
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions({ cardClass }: { cardClass: string }) {
  const { control } = useFormContext<IAttempQuestionForm>();
  const { fields } = useFieldArray({ control, name: "questions" });

  return (
    <div>
      {fields.map((q, index) => (
        <div key={index} className={cardClass}>
          <p className="font-bold mb-2">{q.questionText}</p>
          <CreateChoices questionIndex={index} />
        </div>
      ))}
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { control, register } = useFormContext<IAttempQuestionForm>();
  const { fields } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <div className="pl-4 space-y-2">
      {fields.map((choice, index) => (
        <label
          key={index}
          className="flex items-center gap-2 p-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]"
        >
          <input
            type="checkbox"
            {...register(
              `questions.${questionIndex}.choices.${index}.selected`
            )}
            className="w-5 h-5"
          />
          <span>{choice.text}</span>
        </label>
      ))}
    </div>
  );
}

export default AttemptQuizForm;
