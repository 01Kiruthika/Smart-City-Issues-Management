import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { UserName } from "../App";

// ADMIN PAGES
import Dashboard from "../adminpages/Dashboard.jsx";
import Manageusers from "../adminpages/Manageusers.jsx";
import Assignwork from "../adminpages/Assignwork.jsx";
import Reports from "../adminpages/Reports.jsx";
import Viewcomplaints from "../adminpages/Viewcomplaints.jsx";
import CreateManager from "../adminpages/CreateManager.jsx";

// USER PAGES
import Userdashboard from "../userpages/Dashboard.jsx";
import Reportissue from "../userpages/Reportissue.jsx";
import Mycomplaints from "../userpages/Mycomplaints.jsx";
import Trackstatus from "../userpages/Trackstatus.jsx";


//MANAGER PAGES
import Managerdashboard from "../mangerpages/Dashboard.jsx";
import Completedtask from "../mangerpages/Completedtask.jsx"
import Updatestatus from "../mangerpages/Updatestatus.jsx"
// import Managerlogout from "../mangerpages/Logout.jsx"


const Main = () => {
  const { role } = useContext(UserName);

  return (
    <main>
      <Routes>

        {/* ADMIN ROUTES */}
        {role === "admin" && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Manageusers />} />
            <Route path="assign" element={<Assignwork />} />
            <Route path="reports" element={<Reports />} />
            <Route path="viewcomplaints" element={<Viewcomplaints />} />
            <Route path="createmanager" element={<CreateManager />} />

          </>
        )}

        {/* USER ROUTES */}
        {role === "citizen" && (
          <>
            <Route index element={<Userdashboard />} />
            <Route path="report" element={<Reportissue />} />
            <Route path="mycomplaints" element={<Mycomplaints />} />
            <Route path="trackstatus" element={<Trackstatus />} />
            {/* <Route path="profile" element={<Profile />} /> */}
            {/* <Route path="logout" element={<Logout />} /> */}
          </>
        )}


        {/* MANAGER ROUTES */}
        {role === "manager" && (
          <>
            <Route index element={<Managerdashboard />} />
            <Route path="completedtask" element={<Completedtask />} />
            <Route path="updatestatus" element={<Updatestatus />} />
            {/* <Route path="logout" element={<Managerlogout />} /> */}
          </>
        )}

      </Routes>
    </main>
  );
};

export default Main;