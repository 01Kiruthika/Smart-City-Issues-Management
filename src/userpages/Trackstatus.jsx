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

  //  TRANSLATIONS
  const translations = {

    en: {
      title:
        "Track Complaint Status",

      all: "All",

      pending: "Pending",

      inprogress:
        "In Progress",

      solved: "Solved",

      loading:
        "Loading your complaints...",

      nodata:
        "No complaints found",

      noTitle:
        "No Title",

      noLocation:
        "No Location",
    },

    ta: {
      title:
        "புகார் நிலையை கண்காணிக்கவும்",

      all: "அனைத்தும்",

      pending:
        "நிலுவையில் உள்ளது",

      inprogress:
        "செயல்பாட்டில் உள்ளது",

      solved:
        "தீர்க்கப்பட்டது",

      loading:
        "உங்கள் புகார்கள் ஏற்றப்படுகிறது...",

      nodata:
        "புகார்கள் எதுவும் இல்லை",

      noTitle:
        "தலைப்பு இல்லை",

      noLocation:
        "இடம் இல்லை",
    },
  };

  const t =
    translations[language];

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
        {t.title}
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
          {t.all}
        </option>

        <option value="Pending">
          {t.pending}
        </option>

        <option value="InProgress">
          {t.inprogress}
        </option>

        <option value="Solved">
          {t.solved}
        </option>

      </select>

      {/* LOADING */}
      {loading ? (

        <p className="loading">
          {t.loading}
        </p>

      ) : filteredComplaints.length === 0 ? (

        <p className="no-data">
          {t.nodata}
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
                    comp.proof ||

                    `https://picsum.photos/300/200?random=${comp._id}`
                  }

                  title={
                    comp.title ||
                    t.noTitle
                  }

                  status={
                    comp.status ||
                    t.pending
                  }

                  location={
                    comp.location ||
                    t.noLocation
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