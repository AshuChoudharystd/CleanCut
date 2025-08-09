import{useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login,setLogin] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${backendUrl}/admin/signup`, {
        email: email,
        password: password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setLogin(true);
      toast.success("Signed up Successfully");
    } catch (error) {
      alert("Invalid Credentials!!");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mt-20 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">

            <div>
              <label
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
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
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  if(login){
                    navigate("/dashboard");
                  }
                }}
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="hover:cursor-pointer" onClick={() => navigate("/")}>
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
