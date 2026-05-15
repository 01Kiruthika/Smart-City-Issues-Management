import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import ComplaintCard
  from "../components/ComplaintCard.jsx";

import {
  FaEdit,
  FaTrash
} from "react-icons/fa";

import "./user.css";

import authFetch
  from "../Utils/authFetch.js";

import API
  from "../Backendurl.jsx";

import {
  toast
} from "react-toastify";

const Mycomplaints = () => {

  const navigate =
    useNavigate();

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [language, setLanguage] =
    useState(
      localStorage.getItem("language") || "en"
    );
  useEffect(() => {

    const handleLanguageChange = () => {

      setLanguage(
        localStorage.getItem("language") || "en"
      );
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );
    };

  }, []);
  // TRANSLATIONS
  const translations = {

    en: {
      title: "My Complaints",
      loading: "Loading...",
      noComplaints: "No complaints found",
      deleteConfirm:
        "Do you want to delete this complaint?",
      deleted:
        "Deleted Successfully",
      noTitle: "No Title",
      pending: "Pending",
      noLocation: "No Location",
    },

    ta: {
      title: "என் புகார்கள்",
      loading: "ஏற்றப்படுகிறது...",
      noComplaints:
        "புகார்கள் எதுவும் இல்லை",
      deleteConfirm:
        "இந்த புகாரை நீக்க விரும்புகிறீர்களா?",
      deleted:
        "வெற்றிகரமாக நீக்கப்பட்டது",
      noTitle: "தலைப்பு இல்லை",
      pending: "நிலுவையில் உள்ளது",
      noLocation: "இடம் இல்லை",
    },
  };

  const t =
    translations[language];

  useEffect(() => {

    fetchMyComplaints();

  }, []);

  // FETCH ONLY USER COMPLAINTS
  const fetchMyComplaints = async () => {

    try {

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

    } catch (error) {

      console.error(
        "Fetch Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // DELETE COMPLAINT
  const handleDelete = async (id) => {

    if (
      !window.confirm(
        t.deleteConfirm
      )
    ) return;

    try {

      const res =
        await authFetch(

          `${API.BASE_URL}/complaint/${id}`,

          {
            method: "DELETE",
          }
        );

      if (res.ok) {

        toast.success(
          t.deleted
        );

        // REMOVE FROM UI
        setComplaints((prev) =>

          prev.filter(
            (c) => c._id !== id
          )
        );
      }

    } catch (err) {

      console.error(err);
    }
  };

  // EDIT
  const handleEdit = (complaint) => {

    navigate(
      "/app/report",
      {
        state: complaint
      }
    );
  };

  return (

    <div className="complaint-container">

      <div className="complaint-head">

        <h2>
          {t.title}
        </h2>

      </div>

      <div className="card-grid">

        {loading ? (

          <p>
            {t.loading}
          </p>

        ) : complaints.length === 0 ? (

          <p>
            {t.noComplaints}
          </p>

        ) : (

          complaints.map((c) => (

            <div
              key={c._id}
              className="card-wrapper"
            >

              <ComplaintCard

                image={
                  c.proof ||
                  `https://picsum.photos/300/200?random=${c._id}`
                }

                title={
                  c.title ||
                  t.noTitle
                }

                status={
                  c.status ||
                  t.pending
                }

                location={
                  c.location ||
                  t.noLocation
                }

                date={
                  c.createdAt ||
                  new Date()
                }

                completedProof={
                  c.completedProof
                }

                actions={
                  <>
                    <button
                      onClick={() =>
                        handleEdit(c)
                      }
                      className="edit-btn"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(c._id)
                      }
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