import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintCard from "../components/ComplaintCard.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./user.css";
import authFetch from "../Utils/authFetch.js";
import API from "../Backendurl.jsx"
import { toast } from "react-toastify";

const Mycomplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const res = await authFetch(`${API.BASE_URL}/complaint`);
      const data = await res.json();

      console.log("Complaints API:", data);

      setComplaints(data.response || data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to delete this complaint?")) return;

    try {
      const res = await authFetch(
        `${API.BASE_URL}/complaint/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Deleted Successfully");

        // Remove from UI
        setComplaints((prev) =>
          prev.filter((c) => c._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (complaint) => {
    navigate("/app/report", { state: complaint });
  };

  //  safer filter
  const filteredComplaints = complaints.filter((c) => {
    const userId = localStorage.getItem("userId");
    return c.user_id && String(c.user_id) === String(userId);
  });

  console.log(" Filtered Complaints:", filteredComplaints);

  return (
    <div className="complaint-container">

      <div className="complaint-head">
        <h2>My Complaints</h2>
      </div>

      <div className="card-grid">

        {loading ? (
          <p>Loading...</p>
        ) : filteredComplaints.length === 0 ? (
          <p>No complaints found</p>
        ) : (
          filteredComplaints.map((c) => (
            <div key={c._id} className="card-wrapper">

              <ComplaintCard
                image={c.proof || "https://via.placeholder.com/150"}
                title={c.title || "No Title"}
                status={c.status || "Pending"}
                location={c.location || "No Location"}
                date={c.createdAt || new Date()}
                completedProof={c.completedProof}

                actions={
                  <>
                    <button
                      onClick={() => handleEdit(c)}
                      className="edit-btn"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="delete-btn"
                    >
                      <FaTrash />
                    </button>
                  </>
                }
              />

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Mycomplaints;