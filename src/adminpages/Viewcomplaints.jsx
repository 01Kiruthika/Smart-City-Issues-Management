import React, { useEffect, useState } from "react";
import "./admin.css";
import ComplaintCard from "../components/ComplaintCard.jsx";
import authFetch from "../Utils/authFetch.js";
import emailjs from "@emailjs/browser";
import API from "../Backendurl.jsx"
import { toast } from "react-toastify";

const Viewcomplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    if (diff < 604800) return Math.floor(diff / 86400) + " days ago";
    return past.toLocaleDateString();
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const [complaintRes, managerRes] = await Promise.all([
        authFetch(`${API.BASE_URL}/complaint`),
        authFetch(`${API.BASE_URL}/manager`),
      ]);

      const complaintData = await complaintRes.json();
      const managerData = await managerRes.json();

      setComplaints(complaintData.response || []);
      setManagers(managerData.response || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Assign Manager + Send Email
  const handleAssign = async (complaintId, managerId) => {
    try {
      if (!managerId) return;

      const selectedManager = managers.find(m => m._id === managerId);
      const selectedComplaint = complaints.find(c => c._id === complaintId);

      console.log("Selected Manager:", selectedManager);
      console.log("Manager Email:", selectedManager?.email);

      //  SAFETY CHECK 
      if (!selectedManager || !selectedManager.email) {
        toast.error("Manager email missing (Fix backend API)");
        return;
      }

      const res = await authFetch(
        `${API.BASE_URL}/complaint/${complaintId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manager_id: managerId,
            manager_name: selectedManager.name,
            status: "InProgress",
          }),
        }
      );

      if (res.ok) {

        try {
          // MAILJS CALL
          await emailjs.send(
            "service_909i4zn",
            "template_1y0a2fi",
            {
              name: selectedManager.name,
              email: selectedManager.email, // MUST exist
              title: selectedComplaint.title,
              message: `${selectedComplaint.title} - ${selectedComplaint.location}`,
              complaint_id: selectedComplaint._id,
            },
            "zqUfWoQbJx9clo0Qp"      // replace
          );

          toast.success("Manager assigned Successfully!!!");

        } catch (emailError) {
          console.error("Email failed:", emailError);
          toast.error("Assigned but Email failed ");
        }

        fetchData();

      } else {
        toast.error("Assignment failed ");
      }

    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="complaints-container">
      <h2>Assign Complaints</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-grid">
          {complaints.map((c) => (
            <div key={c._id} className="card-wrapper">

              <ComplaintCard
                image={c.proof}
                title={c.title}
                status={c.status}
                location={c.location}
                date={c.createdAt}
                completedProof={c.completedProof}

                actions={
                  <>
                    {/* Time Ago */}
                    <p className="timeago">
                      {getTimeAgo(c.createdAt)}
                    </p>

                    {/* Assign Dropdown */}
                    {c.status === "Pending" && (
                      <select
                        className="assign-dropdown"
                        defaultValue=""
                        onChange={(e) =>
                          handleAssign(c._id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Assign Manager
                        </option>
                        {managers.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Assigned Manager */}
                    {c.manager_name && (
                      <p className="assigned">
                        Assigned to: <strong>{c.manager_name}</strong>
                      </p>
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

export default Viewcomplaints;



























