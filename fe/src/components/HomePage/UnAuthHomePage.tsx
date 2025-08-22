import { NavLink } from "react-router-dom";

function UnAuthHomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl text-center p-8 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-md">
        <h1 className="text-5xl font-extrabold text-primary mb-6">
          Welcome to Quiz App
        </h1>
        <p className="text-lg font-bold mb-6">
          Test your knowledge and challenge yourself! Login or register to start
          taking quizzes and tracking your progress.
        </p>
        <div className="flex justify-center gap-4">
          <NavLink
            to="/login"
            className="px-6 py-3 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="px-6 py-3 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default UnAuthHomePage;
