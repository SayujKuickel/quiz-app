import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import { useContext } from "react";

function Navbar() {
  const { isAuth, role } = useContext<IAuthContext>(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-primary border-b-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center space-x-4">
        <NavLink
          to="/"
          className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
        >
          About Us
        </NavLink>
        {isAuth && (
          <>
            <NavLink
              to="/profile"
              className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              Profile
            </NavLink>
            <NavLink
              to="/questionset/list"
              className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              Questions
            </NavLink>

            {role === "admin" && (
              <NavLink
                to="/admin/questionset/create"
                className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
              >
                Create
              </NavLink>
            )}
          </>
        )}
      </div>

      <div>
        {isAuth ? (
          <button
            onClick={logoutHandler}
            className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/register"
              className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className="text-black font-bold px-3 py-2 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
