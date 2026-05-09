import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import "./user.css";
import authFetch from "../Utils/authFetch.js";
import API from "../Backendurl.jsx";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await authFetch(`${API.BASE_URL}/complaint`);
      const data = await res.json();

      const userComplaints = (data.response || []).filter(
        (c) => c.user_id == userId
      );

      setComplaints(userComplaints);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
       fetchComplaints();
    }, 1000);
   
    // const interval = setInterval(fetchComplaints, 3000);
    // return () => clearInterval(interval);
  }, []);

  // Counts
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status?.toLowerCase() === "inprogress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status?.toLowerCase() === "solved"
  ).length;

  // Check if all values are 0
  const isEmpty = total === 0 && pending === 0 && inProgress === 0 && resolved === 0;

  // Chart Data
  const chartData = [
    { id: "Total", value: total },
    { id: "Pending", value: pending },
    { id: "In Progress", value: inProgress },
    { id: "Resolved", value: resolved },
  ];

  const barData = [
    { status: "Total", value: total },
    { status: "Pending", value: pending },
    { status: "In Progress", value: inProgress },
    { status: "Resolved", value: resolved },
  ];

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="dashboard-container ps-2">

      {/* Summary Cards */}
      <div className="row d-flex gap-2">

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6 mx-3">
          <h4>Total Complaints</h4>
          <p>{total}</p>
        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">
          <h4>Resolved Issues</h4>
          <p>{resolved}</p>
        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">
          <h4>Pending Complaints</h4>
          <p>{pending}</p>
        </div>

        <div className="totalcomplaints col-lg-2 col-md-4 col-sm-6">
          <h4>In Progress Issues</h4>
          <p>{inProgress}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mt-4">

        {isEmpty ? (
          <div style={{
            textAlign: "center",
            width: "100%",
            padding: "50px",
            background: "#f5f7f6",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h3>No Complaints Found</h3>
            <p style={{ color: "#777" }}>
              You haven't reported any issues yet.
            </p>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="col-md-6 chart-box">
              <div style={{ height: "300px" }}>
                <h3 style={{ textAlign: "center" }}>
                  Complaint Status Overview
                </h3>

                <ResponsivePie
                  data={chartData}
                  margin={{ top: 10, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.4}
                  padAngle={2}
                  cornerRadius={5}
                  activeOuterRadiusOffset={10}
                  colors={{ scheme: "set1" }}
                  borderWidth={2}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#fff"
                />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="col-md-6 chart-box">
              <h3 style={{ textAlign: "center" }}>
                Complaint Comparison
              </h3>

              <div style={{ height: "300px" }}>
                <ResponsiveBar
                  data={barData}
                  keys={["value"]}
                  indexBy="status"
                  margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                  padding={0.3}

                  colors={({ data }) => {
                    if (data.status === "Total") return "#4CAF50";
                    if (data.status === "Pending") return "#FF9800";
                    if (data.status === "In Progress") return "#2196F3";
                    if (data.status === "Resolved") return "#9C27B0";
                    return "#ccc";
                  }}

                  axisBottom={{ tickRotation: -20 }}
                  enableLabel={false}
                />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;