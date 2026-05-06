import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { UserName } from '../App.jsx';
// import smartcitiylogo from '../Images/Smart-City-logo.png'
import smartcitiylogo from '../Images/Smart-logo.png'

const Aside = () => {
   const { role } = useContext(UserName);
   return (
      <>
         <input type="checkbox" id="click-bars"></input>

         <aside>
            <div className="smart-logo">
               <img src={smartcitiylogo} alt="" />
            </div>

            <ul>


               {/* app MENU */}
               {role === "admin" && (
                  <>
                     <li><Link to="/app/"><i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard</Link></li>
                     <li><Link to="/app/CreateManager"><i className="fa fa-tasks" aria-hidden="true"></i>Manager</Link></li>
                     <li><Link to="/app/users"><i className="fa fa-users" aria-hidden="true"></i>User and Manger</Link></li>
                     <li><Link to="/app/viewcomplaints"><i className="fa fa-clipboard" aria-hidden="true"></i>Assign Complaints</Link></li>
                     <li><Link to="/app/assign"><i className="fa fa-tasks" aria-hidden="true"></i>All Complaint</Link></li>
                     <li><Link to="/app/reports"><i className="fa fa-bar-chart" aria-hidden="true"></i>Reports</Link></li>

                  </>
               )}

               {/* USER MENU */}
               {role === "citizen" && (
                  <>
                     <li><Link to="/app/"><i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard</Link></li>
                     <li><Link to="/app/report"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Report Issue</Link></li>
                     <li><Link to="/app/mycomplaints"><i class="fa fa-list" aria-hidden="true"></i>My Complaints</Link></li>
                     <li><Link to="/app/trackstatus"><i class="fa fa-location-arrow" aria-hidden="true"></i>Track Status</Link></li>
                     {/* <li><Link to="/app/profile"><i class="fa fa-user" aria-hidden="true"></i>Profile</Link></li> */}
                     {/* <li><Link to="/app/logout"><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</Link></li> */}
                  </>
               )}

               {/* MANAGER MENU */}
               {role === "manager" && (
                  <>
                     <li><Link to="/app/"><i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard</Link></li>
                     <li><Link to="/app/updatestatus"><i class="fa fa-refresh" aria-hidden="true"></i>My Complaints</Link></li>
                     <li><Link to="/app/completedtask"><i class="fa fa-check-circle" aria-hidden="true"></i>Completed Task</Link></li>
                     {/* <li><Link to="/app/logout"><i class="fa fa-check-circle" aria-hidden="true"></i>Logout</Link></li> */}
                  </>
               )}
            </ul>

         </aside>


      </>
   )

}

export default Aside
