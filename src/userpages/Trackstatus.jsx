import React, {
  useEffect,
  useState
} from "react";

import "./user.css";

import ComplaintCard
  from "../components/ComplaintCard.jsx";

import authFetch
  from "../Utils/authFetch.js";

import API
  from "../Backendurl.jsx";



const TrackStatus = () => {

  const [complaints, setComplaints] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    fetchComplaints();

  }, []);




  // FETCH ONLY USER COMPLAINTS
  const fetchComplaints = async () => {

    try {

      setLoading(true);

      const res =
        await authFetch(

          `${API.BASE_URL}/mycomplaints`
        );

      const data =
        await res.json();

      console.log(
        "My Complaints:",
        data
      );

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




  // STATUS FILTER
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

    <div className="trackstatus">

      <h2>
        Track Complaint Status
      </h2>



      {/* FILTER DROPDOWN */}
      <select
        className="track-dropdown"
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
          In Progress
        </option>

        <option value="Solved">
          Solved
        </option>

      </select>




      {/* LOADING */}
      {loading ? (

        <p className="loading">
          Loading your complaints...
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

                  image={
                    comp.proof
                  }

                  title={
                    comp.title
                  }

                  status={
                    comp.status ||
                    "Pending"
                  }

                  location={
                    comp.location
                  }

                  date={
                    comp.createdAt
                  }

                  completedProof={
                    comp.completedProof
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

export default TrackStatus;