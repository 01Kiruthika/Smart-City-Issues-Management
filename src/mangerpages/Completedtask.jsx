import React, { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard.jsx";
import "./manager.css";
import authFetch from "../Utils/authFetch.js"
import API from "../Backendurl.jsx"

const Completedtask = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const managerId = localStorage.getItem("userId");

  useEffect(() => {
    if (managerId) {
      fetchCompletedTasks();
    }
  }, [managerId]);

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);

      const res = await authFetch(
        `${API.BASE_URL}/getcomplaint/${managerId}`
      );

      const data = await res.json();

      if (data.status) {

        //  FILTER ONLY SOLVED
        const solvedTasks = data.response
          .filter((c) => c.status === "Solved")
          .map((c) => ({
            ...c,
            proof: c.proof && c.proof.startsWith("data:image")
              ? c.proof
              : "https://dummyimage.com/300x200/ccc/000&text=No+Image",
            createdAt: c.createdAt || new Date(),
            title: c.title || "No Title",
            location: c.location || "No Location"
          }));

        setComplaints(solvedTasks);

      } else {
        setComplaints([]);
      }

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-container">
      <h2>Completed Tasks</h2>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No completed tasks</p>
      ) : (
        <div className="card-grid">
          {complaints.map((c) => (
            <div key={c._id} className="card-wrapper">

              <ComplaintCard
                image={c.proof}
                title={c.title}
                status={c.status}
                location={c.location}
                date={new Date(c.createdAt)}

                actions={
                  <>
                    {/* PROOF */}
                    {c.completedProof && (
                      <div style={{ textAlign: "center", marginTop: "-25px" }}>
                        <p style={{ fontSize: "12px", marginBottom: "3px" }}>
                          <b>Proof</b>
                        </p>

                        <img
                          src={c.completedProof}
                          alt="proof"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                          }}
                        />
                      </div>
                    )}
                  </>
                }
              />



            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Completedtask;