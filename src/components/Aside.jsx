import React, {
   useContext,
   useState,
   useEffect
} from 'react'

import '../App.css'

import { Link } from 'react-router-dom'

import { UserName } from '../App.jsx'

import smartcitiylogo from '../Images/Smart-logo.png'

const Aside = () => {

   const { role } = useContext(UserName);

   // LANGUAGE STATE
   const [language, setLanguage] =
      useState(
         localStorage.getItem("language") || "ta"
      );

   // UPDATE LANGUAGE IMMEDIATELY
   useEffect(() => {

      const handleLanguageChange = () => {

         setLanguage(
            localStorage.getItem("language") || "ta"
         );
      };

      // STORAGE EVENT
      window.addEventListener(
         "storage",
         handleLanguageChange
      );

      // CUSTOM EVENT
      window.addEventListener(
         "languageChanged",
         handleLanguageChange
      );

      return () => {

         window.removeEventListener(
            "storage",
            handleLanguageChange
         );

         window.removeEventListener(
            "languageChanged",
            handleLanguageChange
         );
      };

   }, []);

   // CITIZEN TEXT
   const citizenText = {

      en: {

         dashboard: "Dashboard",

         report: "Report Issue",

         complaints: "My Complaints",

         track: "Track Status",
      },

      ta: {

         dashboard: "டாஷ்போர்டு",

         report: "பிரச்சனை பதிவு",

         complaints: "என் புகார்கள்",

         track: "நிலை கண்காணிப்பு",
      }
   };

   return (

      <>

         <input
            type="checkbox"
            id="click-bars"
         />

         <aside>

            <div className="smart-logo">

               <img
                  src={smartcitiylogo}
                  alt=""
               />

            </div>

            <ul>

               {/* ADMIN MENU */}
               {role === "admin" && (

                  <>

                     <li>

                        <Link to="/app/">

                           <i
                              className="fa fa-tachometer"
                              aria-hidden="true"
                           ></i>

                           Dashboard

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/CreateManager">

                           <i
                              className="fa fa-tasks"
                              aria-hidden="true"
                           ></i>

                           Manager

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/users">

                           <i
                              className="fa fa-users"
                              aria-hidden="true"
                           ></i>

                           User and Manager

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/viewcomplaints">

                           <i
                              className="fa fa-clipboard"
                              aria-hidden="true"
                           ></i>

                           Assign Complaints

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/assign">

                           <i
                              className="fa fa-tasks"
                              aria-hidden="true"
                           ></i>

                           All Complaint

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/reports">

                           <i
                              className="fa fa-bar-chart"
                              aria-hidden="true"
                           ></i>

                           Reports

                        </Link>

                     </li>

                  </>
               )}

               {/* CITIZEN MENU */}
               {role === "citizen" && (

                  <>

                     <li>

                        <Link to="/app/">

                           <i
                              className="fa fa-tachometer"
                              aria-hidden="true"
                           ></i>

                           {
                              citizenText[language]
                                 .dashboard
                           }

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/report">

                           <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                           ></i>

                           {
                              citizenText[language]
                                 .report
                           }

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/mycomplaints">

                           <i
                              className="fa fa-list"
                              aria-hidden="true"
                           ></i>

                           {
                              citizenText[language]
                                 .complaints
                           }

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/trackstatus">

                           <i
                              className="fa fa-location-arrow"
                              aria-hidden="true"
                           ></i>

                           {
                              citizenText[language]
                                 .track
                           }

                        </Link>

                     </li>

                  </>
               )}

               {/* MANAGER MENU */}
               {role === "manager" && (

                  <>

                     <li>

                        <Link to="/app/">

                           <i
                              className="fa fa-tachometer"
                              aria-hidden="true"
                           ></i>

                           Dashboard

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/updatestatus">

                           <i
                              className="fa fa-refresh"
                              aria-hidden="true"
                           ></i>

                           My Complaints

                        </Link>

                     </li>

                     <li>

                        <Link to="/app/completedtask">

                           <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                           ></i>

                           Completed Task

                        </Link>

                     </li>

                  </>
               )}

            </ul>

         </aside>

      </>
   )
}

export default Aside