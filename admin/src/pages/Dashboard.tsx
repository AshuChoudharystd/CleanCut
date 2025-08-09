import { useState } from "react";
import { Plus, Edit2, List, Trash2, LogOut, Package, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogoutAndRedirect = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setToken(null);
      alert("Logged out successfully!");
      navigate("/");
    }
  };

  // ✅ Pass view directly here
  const handleRedirect = (view: string) => {
    if (view === "add") {
      navigate("/add-products");
    } else if (view === "update") {
      navigate("/update-products");
    } else if (view === "list") {
      navigate("/list-products");
    } else if (view === "delete") {
      navigate("/remove-products");
    }
  };

  const menuOptions = [
    { id: "add", icon: Plus, title: "Add Products", description: "Add new products to inventory" },
    { id: "update", icon: Edit2, title: "Update Products", description: "Edit existing product details" },
    { id: "list", icon: List, title: "List Products", description: "View all products in inventory" },
    { id: "delete", icon: Trash2, title: "Delete Products", description: "Remove products from inventory" },
  ];

  const LoggedOutScreen = () => (
    <div className="flex justify-center items-center h-screen">
      <div>
        <p className="text-3xl font-extrabold mb-10">
          You are Logged Out. Please Log In again
        </p>
        <button
          onClick={() => navigate("/")}
          className="border-2 border-white bg-blue-600 text-white rounded-xl text-4xl p-3"
        >
          <p className="flex justify-center items-center gap-2">
            Login <LogIn size={30} />
          </p>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {token ? (
        <div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-black mb-4">
                  Product Management
                </h1>
                <p className="text-xl text-gray-600">
                  Choose an option to manage your products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRedirect(option.id)}
                    className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black transition-colors duration-300">
                        <option.icon className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-8 text-center">
            <button
              onClick={handleLogoutAndRedirect}
              className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      ) : (
        <LoggedOutScreen />
      )}
    </div>
  );
};

export default Dashboard;
