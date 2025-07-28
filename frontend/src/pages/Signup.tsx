import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const { toggleLogin } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Renamed the function to be more descriptive and handle the form submission event.
  const handleLogin = async (e) => {
    // 1. Prevent the default form submission behavior (page reload).
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/user/login`, {
        name:name,
        email: email,
        password: password,
      });

      // 2. Check if a token exists in the response before proceeding.
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Saved token:", localStorage.getItem("token"));
        toggleLogin(); // Update the login state in context
        // 3. Navigate ONLY after the token is successfully saved.
        navigate("/");
      } else {
        // Handle cases where the request is successful but no token is returned.
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Provide user feedback on failure.
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <div className="mt-20 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                for="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="name"
                  name="name"
                  id="name"
                  autocomplete="name"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                for="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="current-password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  handleLogin(e);
                }}
              >
                Sign up
              </button>
            </div>
          </form>
          <div
            className="hover:cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <p className="text-center text-sm/6 text-gray-500 mt-6">
              <h1>
                Do have an account?{" "}
                <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </h1>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
