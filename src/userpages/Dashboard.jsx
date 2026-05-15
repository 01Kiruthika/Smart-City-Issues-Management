import React, {
  useEffect,
  useState
} from "react";

import { ResponsivePie } from "@nivo/pie";

import { ResponsiveBar } from "@nivo/bar";

import "./user.css";

import authFetch from "../Utils/authFetch.js";

import API from "../Backendurl.jsx";

const Dashboard = () => {

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LANGUAGE
  const [language, setLanguage] =
    useState(
      localStorage.getItem("language") || "ta"
    );

  // LANGUAGE CHANGE
  useEffect(() => {

    const handleLanguageChange = () => {

      setLanguage(
        localStorage.getItem("language") || "ta"
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
  const text = {

    en: {

      totalComplaints: "Total Complaints",

      resolvedIssues: "Resolved Issues",

      pendingComplaints: "Pending Complaints",

      inProgressIssues: "In Progress Issues",

      noComplaints: "No Complaints Found",

      noIssues:
        "You haven't reported any issues yet.",

      overview:
        "Complaint Status Overview",

      comparison:
        "Complaint Comparison",

      total: "Total",

      pending: "Pending",

      inProgress: "In Progress",

      resolved: "Resolved",

      loading: "Loading...",
    },

    ta: {

      totalComplaints:
        "மொத்த புகார்கள்",

      resolvedIssues:
        "தீர்க்கப்பட்ட பிரச்சனைகள்",

      pendingComplaints:
        "நிலுவையில் உள்ள புகார்கள்",

      inProgressIssues:
        "செயல்பாட்டில் உள்ளவை",

      noComplaints:
        "புகார்கள் இல்லை",

      noIssues:
        "நீங்கள் இன்னும் எந்த பிரச்சனையும் பதிவு செய்யவில்லை.",

      overview:
        "புகார் நிலை விவரம்",

      comparison:
        "புகார் ஒப்பீடு",

      total: "மொத்தம்",

      pending: "நிலுவை",

      inProgress:
        "செயல்பாட்டில்",

      resolved:
        "தீர்வு",

      loading:
        "ஏற்றப்படுகிறது...",
    }
  };

  // FETCH COMPLAINTS
  const fetchComplaints = async () => {

    try {

      const res =
        await authFetch(
          `${API.BASE_URL}/mycomplaints`
        );

      const data =
        await res.json();

      setComplaints(
        data.response || []
      );

    } catch (error) {

      console.log(
        "Error fetching complaints:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchComplaints();

  }, []);

  // COUNTS
  const total =
    complaints.length;

  const pending =
    complaints.filter(
      (c) =>
        c.status?.toLowerCase() ===
        "pending"
    ).length;

  const inProgress =
    complaints.filter(
      (c) =>
        c.status?.toLowerCase() ===
        "inprogress"
    ).length;

  const resolved =
    complaints.filter(
      (c) =>
        c.status?.toLowerCase() ===
        "solved"
    ).length;

  // EMPTY CHECK
  const isEmpty =
    total === 0 &&
    pending === 0 &&
    inProgress === 0 &&
    resolved === 0;

  // PIE DATA
  const chartData = [

    {
      id: text[language].total,
      value: total
    },

    {
      id: text[language].pending,
      value: pending
    },

    {
      id: text[language].inProgress,
      value: inProgress
    },

    {
      id: text[language].resolved,
      value: resolved
    },
  ];

  // BAR DATA
  const barData = [

    {
      status:
        text[language].total,

      value: total
    },

    {
      status:
        text[language].pending,

      value: pending
    },

    {
      status:
        text[language].inProgress,

      value: inProgress
    },

    {
      status:
        text[language].resolved,

      value: resolved
    },
  ];

  if (loading) {

    return (

      <h3
        style={{
          textAlign: "center"
        }}
      >

        {
          text[language]
            .loading
        }

      </h3>
    );
  }

  return (

    <div className="dashboard-container ps-2">

      {/* SUMMARY CARDS */}
      <div className="row d-flex gap-2">

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6 mx-3">

          <h4>
            {
              text[language]
                .totalComplaints
            }
          </h4>

          <p>{total}</p>

        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">

          <h4>
            {
              text[language]
                .resolvedIssues
            }
          </h4>

          <p>{resolved}</p>

        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">

          <h4>
            {
              text[language]
                .pendingComplaints
            }
          </h4>

          <p>{pending}</p>

        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">

          <h4>
            {
              text[language]
                .inProgressIssues
            }
          </h4>

          <p>{inProgress}</p>

        </div>

      </div>

      {/* CHARTS */}
      <div className="row mt-4 gy-4">

        {isEmpty ? (

          <div
            style={{
              textAlign: "center",
              width: "100%",
              padding: "50px",
              background: "#f5f7f6",
              borderRadius: "10px",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >

            <h3>
              {
                text[language]
                  .noComplaints
              }
            </h3>

            <p
              style={{
                color: "#777"
              }}
            >

              {
                text[language]
                  .noIssues
              }

            </p>

          </div>

        ) : (

          <>

            {/* PIE CHART */}
            <div className="full-chart">

              <div className="col-md-6 chart-box">

                <div
                  style={{
                    height: "280px"
                  }}
                >

                  <h3
                    style={{
                      textAlign: "center"
                    }}
                  >

                    {
                      text[language]
                        .overview
                    }

                  </h3>

                  <ResponsivePie
                    data={chartData}
                    margin={{
                      top: 30,
                      right: 80,
                      bottom: 50,
                      left: 80
                    }}
                    innerRadius={0.4}
                    padAngle={2}
                    cornerRadius={5}
                    activeOuterRadiusOffset={10}
                    colors={{
                      scheme: "set1"
                    }}
                    borderWidth={2}
                    borderColor={{
                      from: "color",
                      modifiers: [
                        ["darker", 0.2]
                      ]
                    }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor="#fff"
                  />

                </div>

              </div>

              {/* BAR CHART */}
              <div className="col-md-6 chart-box">

                <h3
                  style={{
                    textAlign: "center"
                  }}
                >

                  {
                    text[language]
                      .comparison
                  }

                </h3>

                <div
                  style={{
                    height: "300px"
                  }}
                >

                  <ResponsiveBar
                    data={barData}
                    keys={["value"]}
                    indexBy="status"
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 50,
                      left: 50
                    }}
                    padding={0.3}

                    colors={({ data }) => {

                      if (
                        data.status ===
                        text[language].total
                      )
                        return "#4CAF50";

                      if (
                        data.status ===
                        text[language].pending
                      )
                        return "#FF9800";

                      if (
                        data.status ===
                        text[language].inProgress
                      )
                        return "#2196F3";

                      if (
                        data.status ===
                        text[language].resolved
                      )
                        return "#9C27B0";

                      return "#ccc";
                    }}

                    axisBottom={{
                      tickRotation: -20
                    }}

                    enableLabel={false}
                  />

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
};

export default Dashboard;