import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaEye,
    FaTimes
} from "react-icons/fa";
import "./complaintCard.css";

const ComplaintCard = ({
    image,
    title,
    status,
    location,
    date,
    actions,
    completedProof 
}) => {

    const [open, setOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "red";
            case "InProgress": return "orange";
            case "Solved": return "green";
            default: return "gray";
        }
    };

    return (
        <>
            {/* CARD */}
            <div className="complcard">

                <button className="view-btn" onClick={() => setOpen(true)}>
                    <FaEye />
                </button>

                <div className="cards-image">
                    <img
                        src={image || "https://via.placeholder.com/150"}
                        alt={title}
                    />
                </div>

                <div className="compl-body">
                    <h4 className="title">{title}</h4>

                    <p className="locations">
                        <FaMapMarkerAlt className="icon" />
                        {location}
                    </p>

                    <p className="dates">
                        <FaCalendarAlt className="icon" />
                        {new Date(date).toLocaleDateString()}
                    </p>

                    <span
                        className="status"
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {/* MODAL */}
            {open &&
                ReactDOM.createPortal(
                    <div className="modal-overlay" onClick={() => setOpen(false)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="close-icons"
                                onClick={() => setOpen(false)}
                            >
                                <FaTimes />
                            </button>

                            {/* MAIN IMAGE */}
                            <img
                                src={image || "https://via.placeholder.com/300"}
                                alt="full"
                                className="modal-img"
                            />

                            <h2 className="modal-title">{title}</h2>

                            <p className="modal-info">
                                <FaMapMarkerAlt /> {location}
                            </p>

                            <p className="modal-info">
                                <FaCalendarAlt /> {new Date(date).toLocaleDateString()}
                            </p>

                            <p className="modal-status">
                                Status:
                                <span style={{ color: getStatusColor(status) }}>
                                    {" "}{status}
                                </span>
                            </p>

                            {/*  COMPLETED PROOF SECTION */}
                            {status === "Solved" && completedProof && (
                                <div className="completed-proof-section">
                                    <h6>Completed Proof</h6>

                                    <img
                                        src={completedProof}
                                        alt="proof"
                                        className="proof-img"
                                    />
                                </div>
                            )}

                            {/* ACTIONS */}
                            {actions && (
                                <div className="modal-actions">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ComplaintCard;