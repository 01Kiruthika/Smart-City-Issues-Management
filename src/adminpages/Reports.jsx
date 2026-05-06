import { useEffect, useState } from "react";
import "./adminReport.css";
import authFetch from "../Utils/authFetch.js"
import API from "../Backendurl.jsx"


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    authFetch(`${API.BASE_URL}/complaint`)
      .then((res) => res.json())
      .then((data) => {
        const complaintArray = data.response || [];
        setComplaints(complaintArray);
        setFilteredData(complaintArray);
      })
      .catch((err) => console.log(err));
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    let data = complaints;

    if (locationFilter) {
      data = data.filter((c) =>
        c.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      data = data.filter((c) => {
        if (!c.createdAt) return false;
        return (
          new Date(c.createdAt).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
        );
      });
    }

    setFilteredData(data);
  }, [locationFilter, dateFilter, complaints]);

  // ================= STATS =================
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const solved = complaints.filter((c) => c.status === "Solved").length;
  const inProgress = complaints.filter(
    (c) => c.status === "InProgress"
  ).length;

  // ================= TREND =================
  const now = new Date();

  const thisMonth = complaints.filter((c) => {
    const d = new Date(c.createdAt);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const lastMonth = complaints.filter((c) => {
    const d = new Date(c.createdAt);
    const prev = new Date();
    prev.setMonth(now.getMonth() - 1);

    return (
      d.getMonth() === prev.getMonth() &&
      d.getFullYear() === prev.getFullYear()
    );
  }).length;

  let trend = 0;

  if (lastMonth === 0) {
    trend = thisMonth > 0 ? 100 : 0;
  } else {
    trend = ((thisMonth - lastMonth) / lastMonth) * 100;
  }

  trend = trend.toFixed(1);

  // ================= CHART DATA =================

  // Monthly chart
  const monthlyMap = {};

  complaints.forEach((c) => {
    if (!c.createdAt) return;

    const month = new Date(c.createdAt).toLocaleString("default", {
      month: "short",
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(monthlyMap),
    datasets: [
      {
        label: "Complaints per Month",
        data: Object.values(monthlyMap),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Status chart
  const pieData = {
    labels: ["Pending", "Solved", "In Progress"],
    datasets: [
      {
        data: [pending, solved, inProgress],
        backgroundColor: ["orange", "green", "blue"],
      },
    ],
  };

  // ================= UI =================
  return (
    <div className="report-container">
      <h2 className="report-title">Admin Reports</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-cards">
        <div className="card total">
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div className="card pending">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="card solved">
          <h3>Solved</h3>
          <p>{solved}</p>
        </div>

     

        <div className="card trend">
          <h3>Trend</h3>
          <p>
            {trend > 0 ? "📈 +" : trend < 0 ? "📉 " : ""}
            {trend}%
          </p>
          <small>This vs Last Month</small>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="charts">
        <div className="chart-boxes">
          <h3>Monthly Complaints</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-boxes">
          <h3>Complaint Status</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* ===== TABLE ===== */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((c) => (
              <tr key={c._id}>
                <td>{c.title || "N/A"}</td>
                <td>{c.location || "N/A"}</td>
                <td className={c.status?.toLowerCase()}>
                  {c.status}
                </td>
                <td>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;