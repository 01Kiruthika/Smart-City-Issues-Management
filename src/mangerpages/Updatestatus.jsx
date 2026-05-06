import React, { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard.jsx";
import Cameracapture from "../userpages/Cameracapture.jsx";
import "./manager.css";
import authFetch from "../Utils/authFetch.js"
import API from "../Backendurl.jsx"
import { toast } from "react-toastify";


const Updatestatus = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const managerId = localStorage.getItem("userId");

    useEffect(() => {
        if (managerId) {
            fetchComplaints();
        }
    }, [managerId]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);

            const res = await authFetch(
                `${API.BASE_URL}/getcomplaint/${managerId}`
            );

            const data = await res.json();

            if (data.status) {
                const cleanedData = data.response.map((c) => ({
                    ...c,
                    proof: c.proof && c.proof.startsWith("data:image")
                        ? c.proof
                        : "https://dummyimage.com/300x200/ccc/000&text=No+Image",
                    createdAt: c.createdAt || new Date(),
                    status: c.status || "Pending",
                    location: c.location || "No Location",
                    title: c.title || "No Title"
                }));

                setComplaints(cleanedData);
            } else {
                setComplaints([]);
            }

        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        if (newStatus === "Solved") {
            setSelectedId(id);
        } else {
            updateStatus(id, newStatus, null);
        }
    };

    const updateStatus = async (id, status, image) => {
        try {
            const res = await authFetch(
                `${API.BASE_URL}/managerupdate/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status, completedProof: image })
                }
            );

            const data = await res.json();

            if (res.ok) {
                setComplaints((prev) =>
                    prev.map((c) =>
                        c._id === id
                            ? { ...c, status, completedProof: image }
                            : c
                    )
                );

                // FIXED CONDITION
                if (status?.toLowerCase() === "solved") {
                    toast.success("Proof submitted successfully ");
                } else {
                    toast.success("Status updated successfully ");
                }
            }

            setSelectedId(null);
            setCapturedImage(null);

        } catch (err) {
            console.error("Update Error:", err);
            toast.error("Something went wrong ");
        }
    };

    return (
        <div className="manager-container">

            <div className="manager-head">
                <h2>Assigned Complaints</h2>
            </div>

            {loading ? (
                <p className="manager-state-msg">Loading...</p>
            ) : complaints.length === 0 ? (
                <p className="manager-state-msg">No complaints assigned</p>
            ) : (
                <div className="card-grid">
                    {complaints.map((c) => (
                        <ComplaintCard
                            key={c._id}
                            image={c.proof}
                            title={c.title}
                            status={c.status}
                            location={c.location}
                            date={new Date(c.createdAt)}

                            actions={
                                <>
                                    {/* STATUS DROPDOWN */}
                                    <select
                                        className="status-select"
                                        value={c.status}
                                        disabled={c.status === "Solved"}
                                        onChange={(e) =>
                                            handleStatusChange(c._id, e.target.value)
                                        }
                                    >
                                        <option value="">Update Status</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Solved">Solved</option>
                                    </select>

                                    {/* COMPLETED PROOF IMAGE */}
                                    {c.completedProof && (
                                        <div className="proof-wrapper">
                                            <p className="proof-label">Proof</p>
                                            <img
                                                src={c.completedProof}
                                                alt="proof"
                                                className="proof-img"
                                            />
                                        </div>
                                    )}

                                    {/* CAMERA FOR SOLVED PROOF */}
                                    {selectedId === c._id && (
                                        <div className="camera-proof-section">
                                            <Cameracapture setImage={setCapturedImage} />

                                            {capturedImage && (
                                                <>
                                                    <img
                                                        src={capturedImage}
                                                        alt="preview"
                                                        className="captured-preview"
                                                    />
                                                    <button
                                                        className="submit-proof-btn"
                                                        onClick={() =>
                                                            updateStatus(c._id, "Solved", capturedImage)
                                                        }
                                                    >
                                                        Submit Proof
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Updatestatus;
