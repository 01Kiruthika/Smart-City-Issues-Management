import React, {
  useEffect,
  useState
} from "react";

import "./complaints.css";

import ComplaintCard
  from "../components/ComplaintCard.jsx";

import authFetch
  from "../Utils/authFetch.js";

import API
  from "../Backendurl.jsx";



const Assignwork = () => {

  const [complaints, setComplaints] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    fetchComplaints();

  }, []);




  // FETCH COMPLAINTS
  const fetchComplaints = async () => {

    try {

      setLoading(true);

      const res =
        await authFetch(
          `${API.BASE_URL}/complaint`
        );

      const data =
        await res.json();

      setComplaints(
        data.response || []
      );

    } catch (err) {

      console.error(
        "Error fetching complaints:",
        err
      );

    } finally {

      setLoading(false);
    }
  };




  // TIME AGO
  const getTimeAgo = (date) => {

    const now =
      new Date();

    const past =
      new Date(date);

    const diff =
      Math.floor(
        (now - past) / 1000
      );

    if (diff < 60)
      return "Just now";

    if (diff < 3600)
      return Math.floor(diff / 60)
        + " min ago";

    if (diff < 86400)
      return Math.floor(diff / 3600)
        + " hrs ago";

    if (diff < 604800)
      return Math.floor(diff / 86400)
        + " days ago";

    return past.toLocaleDateString();
  };




  // FILTER
  const filteredComplaints =

    filter === "all"

      ? complaints

      : complaints.filter(

        (c) =>

          (
            c.status ||
            "Pending"
          ).toLowerCase()

          ===

          filter.toLowerCase()
      );




  return (

    <div className="complaints-container">

      <h2>
        All Complaints
      </h2>




      {/* FILTER */}
      <select
        className="dropdown"
        value={filter}
        onChange={(e) =>
          setFilter(
            e.target.value
          )
        }
      >

        <option value="all">
          All
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="InProgress">
          InProgress
        </option>

        <option value="Solved">
          Solved
        </option>

      </select>




      {/* LOADING */}
      {loading ? (

        <p className="loading">
          Loading complaints...
        </p>

      ) : filteredComplaints.length === 0 ? (

        <p className="no-data">
          No complaints found
        </p>

      ) : (

        <div className="card-grid">

          {filteredComplaints.map(
            (comp) => (

              <div
                key={comp._id}
                className="card-wrapper"
              >

                <ComplaintCard

                  image={comp.proof}

                  title={comp.title}

                  status={
                    comp.status
                  }

                  location={
                    comp.location
                  }

                  date={
                    comp.createdAt
                  }




                  actions={

                    <>

                      {/* USER NAME */}
                      <p className="submitted-user">

                        Submitted By:

                        <strong>

                          {" "}
                          {comp.user_id?.name ||
                            "Unknown User"}

                        </strong>

                      </p>




                      {/* PHONE */}
                      <p className="submitted-phone">

                        Phone:

                        <strong>

                          {" "}
                          {comp.user_id?.phonenumber ||
                            "N/A"}

                        </strong>

                      </p>




                      {/* TIME AGO */}
                      <p className="timeago">

                        {getTimeAgo(
                          comp.createdAt
                        )}

                      </p>




                      {/* MANAGER */}
                      {comp.manager_name && (

                        <p className="assigned">

                          Assigned to:

                          <strong>

                            {" "}
                            {comp.manager_name}

                          </strong>

                        </p>
                      )}

                    </>
                  }

                />

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default Assignwork;