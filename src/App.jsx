import { Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";

import Authupage from "./Authupage.jsx";
import Dashboardlayout from "./Dashboardlayout.jsx";
// import Profile from "./userpages/Profile.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserName = createContext();

function App() {
  const [currentUserName, setCurrentUserName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedRole = localStorage.getItem("role");

    if (savedName) setCurrentUserName(savedName);
    if (savedRole) setRole(savedRole);

    setLoading(false);
  }, []);

  if (loading) return <h2>Loading App...</h2>;

  return (
    <UserName.Provider
      value={{ currentUserName, setCurrentUserName, role, setRole }}
    >

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Authupage />} />
        <Route path="/app/*" element={<Dashboardlayout />} />
      </Routes>

      {/*TOAST CONTAINER (IMPORTANT) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </UserName.Provider>
  );
}

export default App;