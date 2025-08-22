import axios from "axios";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

export interface QuestionSetForm {
  title: string;
  questions: {
    questionText: string;
    choices: { text: string; label: string; correctAnswer: boolean }[];
  }[];
}

function CreateQuestionSetForm() {
  const defaultValues: QuestionSetForm = {
    title: "",
    questions: [{ questionText: "", choices: [] }],
  };

  const methods = useForm({ defaultValues });
  const { watch, register, handleSubmit } = methods;
  console.log("form values => ", watch());

  const onSubmitHandler = (data: QuestionSetForm) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post("http://localhost:3000/api/admin/questionset/create", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => alert("Question Set Created Successfully"))
      .catch(() => alert("Error creating question set"));
  };

  const inputClass =
    "w-full px-3 py-2 border-2 border-black rounded-sm bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-primary";
  const buttonClass =
    "mt-2 px-4 py-2 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform";

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          <div>
            <label className="font-bold text-black mb-1 block">Title:</label>
            <input
              {...register("title")}
              placeholder="Enter Title"
              className={inputClass}
            />
          </div>
          <CreateQuestions inputClass={inputClass} buttonClass={buttonClass} />
          <button type="submit" className={buttonClass}>
            Create QuestionSet
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions({
  inputClass,
  buttonClass,
}: {
  inputClass: string;
  buttonClass: string;
}) {
  const { register, control } = useFormContext<QuestionSetForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold text-primary mb-2">Questions</h2>
      {fields.map((field, index) => (
        <div
          key={index}
          className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-md"
        >
          <input
            {...register(`questions.${index}.questionText`)}
            placeholder="Enter Question"
            className={inputClass}
          />
          <CreateChoices
            questionIndex={index}
            inputClass={inputClass}
            buttonClass={buttonClass}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className={`${buttonClass} bg-red-500`}
          >
            Remove Question
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ questionText: "", choices: [] })}
        className={buttonClass}
      >
        Add Question
      </button>
    </div>
  );
}

function CreateChoices({
  questionIndex,
  inputClass,
  buttonClass,
}: {
  questionIndex: number;
  inputClass: string;
  buttonClass: string;
}) {
  const { register, control } = useFormContext<QuestionSetForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <div className="mt-2 space-y-2">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 border-2 border-black p-2 rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]"
        >
          <input
            type="checkbox"
            {...register(
              `questions.${questionIndex}.choices.${index}.correctAnswer`
            )}
            className="w-5 h-5"
          />
          <input
            {...register(`questions.${questionIndex}.choices.${index}.text`)}
            placeholder="Enter Choice"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className={`${buttonClass} bg-red-500`}
          >
            Remove Choice
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            label: fields.length.toString(),
            text: "",
            correctAnswer: false,
          })
        }
        className={buttonClass}
      >
        Add Choice
      </button>
    </div>
  );
}

export default CreateQuestionSetForm;
