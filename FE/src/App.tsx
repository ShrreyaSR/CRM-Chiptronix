import React from "react";
import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

type UserType = "admin" | "technician" | "sales" | null;

export default function App() {
  // const [currentUser, setCurrentUser] = useState<UserType>(null);

  // const handleLogin = (userType: UserType) => {
  //   setCurrentUser(userType);
  // };

  // const handleLogout = () => {
  //   setCurrentUser(null);
  // };

  // // Show login page if not authenticated
  // if (!currentUser) {
  //   return <LoginPage onLogin={handleLogin} />;
  // }

  // // Show appropriate dashboard based on user type
  // if (currentUser === "admin") {
  //   return <AdminDashboard onLogout={handleLogout} />;
  // }

  // Placeholder for other dashboards
  return (
    <>
      {/* <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-blue-900">
                  {currentUser === "technician" && "Technician Dashboard"}
                  {currentUser === "sales" && "Sales Dashboard"}
                </h1>
                <p className="text-gray-600 mt-2">Welcome to Chiptronix CRM</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-800">
                {currentUser === "technician" &&
                  "Technician dashboard will be implemented next"}
                {currentUser === "sales" &&
                  "Sales dashboard will be implemented next"}
              </p>
            </div>
          </div>
        </div>
      </div> */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>

    </>
  );
}
