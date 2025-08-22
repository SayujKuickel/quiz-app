import axios from "axios";
import { useState } from "react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalData = { name, email, password };

    axios
      .post("http://localhost:3000/users/create", finalData)
      .then(() => alert("User registered successfully!"))
      .catch((error) => {
        console.log("error => ", error);
        const errors = error?.response?.data?.message || "An error occurred";
        alert(errors);
      });
  };

  const inputClass =
    "w-full px-3 py-2 border-2 border-black rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[4px_4px_0px_rgba(0,0,0,1)]";

  const labelClass = "font-bold text-black mb-1 block";

  const buttonClass =
    "mt-4 px-4 py-2 bg-primary text-black font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      <h1 className="text-3xl font-extrabold mb-2 text-center text-primary">
        Register
      </h1>
      <p className="text-center mb-6 font-bold text-black">
        Create your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name:
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button type="submit" className={buttonClass}>
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
