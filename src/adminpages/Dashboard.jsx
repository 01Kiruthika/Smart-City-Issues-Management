import React, { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards.jsx";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import authFetch from "../Utils/authFetch.js";
import API from "../Backendurl.jsx";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, userRes, managerRes] = await Promise.all([
        authFetch(`${API.BASE_URL}/complaint`),
        authFetch(`${API.BASE_URL}/users`),
        authFetch(`${API.BASE_URL}/manager`),
      ]);

      const compData = await compRes.json();
      const userData = await userRes.json();
      const managerData = await managerRes.json();

      setComplaints(compData.response || []);
      setUsers(userData.response || []);
      setManagers(managerData.response || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // TOTAL COUNTS
  const totalComplaints = complaints.length;
  const totalUsers = users.length;
  const totalManagers = managers.length;

  // EMPTY CHECK
  const isEmpty =
    totalComplaints === 0 &&
    totalUsers === 0 &&
    totalManagers === 0;

  // PIE DATA
  const chartData = [
    { id: "Complaints", value: totalComplaints },
    { id: "Users", value: totalUsers },
    { id: "Managers", value: totalManagers },
  ];

  // BAR DATA
  const barData = [
    { category: "Complaints", value: totalComplaints },
    { category: "Users", value: totalUsers },
    { category: "Managers", value: totalManagers },
  ];

  // CARDS
  const cards = [
    { label: "Total Complaints", value: totalComplaints, color: "blue" },
    { label: "Total Users", value: totalUsers, color: "purple" },
    { label: "Total Managers", value: totalManagers, color: "orange" },
  ];

  return (
    <div>
      <DashboardCards
        cards={cards}
        loading={loading}
        title="Admin Dashboard"
      />

      <div className="row mt-4">

        {isEmpty ? (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              padding: "50px",
              background: "#f5f7f6",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>No Data Available</h3>
            <p style={{ color: "#777" }}>
              No complaints, users, or managers found in the system.
            </p>
          </div>
        ) : (
          <>
            {/* PIE CHART */}
            <div className="col-md-6">
              <div style={{ height: "300px" }}>
                <h3 style={{ textAlign: "center" }}>
                  Overview
                </h3>

                <ResponsivePie
                  data={chartData}
                  margin={{ top: 22, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.4}
                  padAngle={2}
                  cornerRadius={5}
                  activeOuterRadiusOffset={10}
                  colors={{ scheme: "set2" }}
                  borderWidth={2}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#fff"
                />
              </div>
            </div>

            {/* BAR CHART */}
            <div className="col-md-6">
              <h3 style={{ textAlign: "center" }}>
                Status
              </h3>

              <div style={{ height: "300px" }}>
                <ResponsiveBar
                  data={barData}
                  keys={["value"]}
                  indexBy="category"
                  margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                  padding={0.3}
                  colors={({ data }) => {
                    if (data.category === "Complaints") return "#4CAF50";
                    if (data.category === "Users") return "#2196F3";
                    if (data.category === "Managers") return "#FF9800";
                    return "#ccc";
                  }}
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