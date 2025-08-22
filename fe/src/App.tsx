import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import CreateQuestionSetPage from "./pages/QuestionSet/CreateQuestionSetPage";
import { jwtDecode } from "jwt-decode";
import ListQuestionSetPage from "./pages/QuestionSet/ListQuestionSetPage";
import AttemptQuizPage from "./pages/QuestionSet/AttemptQuizPage";
import ProfilePage from "./pages/profile/ProfilePage";

export interface IAuthState {
  isAuth: boolean;
  role: "admin" | "professional" | "guest";
}

export interface IAuthContext extends IAuthState {
  setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

export interface JwtDecode {
  id: string;
  role: "admin" | "professional";
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  role: "guest",
  setAuthState: () => {},
});

function App() {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuth: false,
    role: "guest",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        await axios.get("http://localhost:3000/api/verify/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { role }: JwtDecode = jwtDecode(accessToken ?? "");

        setAuthState({
          isAuth: true,
          role,
        });
      } catch {
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider
      value={{
        isAuth: authState.isAuth,
        role: authState.role,
        setAuthState,
      }}
    >
      <Navbar />
      <Routes>
        {/* unauth */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />

        {!authState.isAuth && (
          <>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </>
        )}

        {authState.isAuth && (
          <>
            <Route path="/questionset/list" element={<ListQuestionSetPage />} />
            <Route
              path="/questionset/:id/attempt"
              element={<AttemptQuizPage />}
            />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </>
        )}

        {authState.role === "admin" && (
          <Route
            path="/admin/questionset/create"
            element={<CreateQuestionSetPage />}
          />
        )}

        <Route path="*" element={<p>No Page Found</p>} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
