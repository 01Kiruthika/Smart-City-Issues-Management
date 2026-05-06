import React from "react";
import "./dashboard.css";

const DashboardCards = ({ cards, loading, title }) => {
  return (
    <div className="admin-dashboard">

      <h1>{title}</h1>

      {loading ? (
        <p className="loading">Loading data...</p>
      ) : (
        <div className="dashboard-cards">

          {cards.map((card, index) => (
            <div key={index} className={`dash-card ${card.color}`}>
              <h3>{card.label}</h3>
              <p>{card.value}</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default DashboardCards;