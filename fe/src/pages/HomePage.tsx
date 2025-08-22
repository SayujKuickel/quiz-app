import { useContext } from "react";
import { AuthContext, type IAuthContext } from "../App";
import AuthHomePage from "../components/HomePage/AuthHomePage";
import UnAuthHomePage from "../components/HomePage/UnAuthHomePage";

function HomePage() {
  const { isAuth } = useContext<IAuthContext>(AuthContext);

  return <>{isAuth ? <AuthHomePage /> : <UnAuthHomePage />}</>;
}

export default HomePage;
