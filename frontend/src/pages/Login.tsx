import {useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Renamed the function to be more descriptive and handle the form submission event.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevent the default form submission behavior (page reload).
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/user/login`, {
        email: email,
        password: password,
      });

      // 2. Check if a token exists in the response before proceeding.
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Saved token:", localStorage.getItem("token"));
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
          {/* 4. Use the onSubmit handler on the form. */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  // The `e.preventDefault()` is not needed in onChange.
                  onChange={(e) => setEmail(e.target.value)}
                  value={email} // It's good practice to add the value prop for controlled components.
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password} // It's good practice to add the value prop.
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                // 5. The onClick handler is removed from the button.
              >
                Sign in
              </button>
            </div>
          </form>
          <div
            className="hover:cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            <p className="text-center text-sm/6 text-gray-500 mt-6">
              Don't have an account?{" "}
              <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;