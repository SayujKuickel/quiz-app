import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IListQuestionSet {
  _id: string;
  title: string;
  questionCount: number;
}

function ListQuestionSet() {
  const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/questions/set/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setQuestionSet(response?.data?.questionSet || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p className="text-center font-bold text-black mt-10">Loading...</p>;
  }

  if (questionSets.length === 0) {
    return (
      <p className="text-center font-bold text-black mt-10">
        No question sets found.
      </p>
    );
  }

  const cardClass =
    "flex justify-between items-center p-4 border-2 border-black rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white mb-4";

  const buttonClass =
    "px-3 py-1 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform";

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">
        My Question Sets
      </h2>
      <ul>
        {questionSets.map((question) => {
          const TakeQuizHandler = () => {
            navigate(`/questionset/${question._id}/attempt`);
          };
          return (
            <li key={question._id} className={cardClass}>
              <p className="font-bold text-black">
                <strong>{question.title}</strong> — {question.questionCount}{" "}
                questions
              </p>
              <button onClick={TakeQuizHandler} className={buttonClass}>
                Take Quiz
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListQuestionSet;
