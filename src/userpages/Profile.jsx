import React from 'react'
import './user.css'

const Profile = () => {
  return (
    <div className="profile-wrapper">
      <div className="profile-box">


        <div className="profile-container">

          {/* TOP SECTION */}
          <div className="profile-card">
            <div className="profile-image">
              <img src="https://via.placeholder.com/120" alt="profile" />
            </div>

            <h2 className="username">Kiruthika</h2>
            <p className="phone">+91 9876543210</p>
          </div>


          {/* ACTION SECTION */}
          <div className="actions-container">

            <button className="action-btn edit">✏️ Edit Profile</button>
            <button className="action-btn photo">📸 Upload Photo</button>
            <button className="action-btn password">🔐 Change Password</button>
            <button className="action-btn voice">🎤 Voice Action</button>

          </div>


          {/* LOGOUT */}
          <div className="logout-container">
            <button className="logout-btn">🚪 Logout</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile