import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AttemptQuizForm from "../../components/QuestionSet/AttemptQuizForm";

export interface IAttempQuestionForm {
  _id: string;
  title: string;
  questions: IQuestion[];
  createdBy: string;
  __v: number;
}

export interface IQuestion {
  questionText: string;
  choices: IChoice[];
  _id: string;
}

export interface IChoice {
  label: string;
  text: string;
  _id: string;
  selected?: boolean;
}

function AttemptQuizPage() {
  const { id } = useParams();
  const [questionSet, setQuestionSet] = useState<IAttempQuestionForm | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !id) {
      setIsLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3000/api/questions/set/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setQuestionSet(response?.data || null);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <p className="text-center font-bold mt-10 text-black text-xl">
        Loading...
      </p>
    );
  }

  if (!questionSet) {
    return (
      <p className="text-center font-bold mt-10 text-black text-xl">
        Question set not found.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-md">
      <h1 className="text-3xl font-extrabold text-primary mb-6 text-center">
        {questionSet.title}
      </h1>
      <AttemptQuizForm questionSet={questionSet} />
    </div>
  );
}

export default AttemptQuizPage;
