import React, { useContext, useReducer, useRef, useEffect } from "react";
import { UserName } from "../App";
import { useNavigate } from "react-router-dom";
import logo from "../Images/user.png";
import logout from "../Images/user-logout.png";
import "../App.css";
import API from "../Backendurl.jsx";

const initialState = {
  showProfile: false,
  editMode: false,
  name: "",
  phone: "",
  image: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_PROFILE":
      return { ...state, showProfile: !state.showProfile };

    case "EDIT_MODE":
      return { ...state, editMode: true };

    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_PHONE":
      return { ...state, phone: action.payload };

    case "SET_IMAGE":
      return { ...state, image: action.payload };

    case "CLOSE_ALL":
      return { ...state, editMode: false };

    case "CLOSE_PROFILE":
      return { ...state, showProfile: false };

    default:
      return state;
  }
}

const Header = () => {
  const { currentUserName } = useContext(UserName);
  const navigate = useNavigate();
  const profileRef = useRef();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    image: logo,
  });

  useEffect(() => {
    fetchUserDetails();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        dispatch({ type: "CLOSE_PROFILE" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserDetails = async () => {

    try {

      const res = await fetch(
        `${API.BASE_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("Profile Data:", data);

      const currentUser = data.response;

      if (currentUser) {

        dispatch({
          type: "SET_NAME",
          payload: currentUser.name,
        });

        dispatch({
          type: "SET_PHONE",
          payload: currentUser.phonenumber,
        });

        if (currentUser.profile_image) {

          dispatch({
            type: "SET_IMAGE",
            payload: currentUser.profile_image,
          });
        }

      }

    } catch (err) {

      console.error(
        "Error fetching user:",
        err
      );
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API.BASE_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: state.name,
          phonenumber: state.phone,
          profile_image: state.image,
        }),
      });

      const data = await res.json();

      if (data.status) {
        alert("Profile updated successfully");
        dispatch({ type: "CLOSE_ALL" });
        fetchUserDetails();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      dispatch({
        type: "SET_IMAGE",
        payload: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <header>
      <div className="company-name">
        <label htmlFor="click-bars">
          <i className="fa fa-bars"></i>
        </label>
      </div>

      <h2>Welcome, {state.name || currentUserName}</h2>

      <div className="profile-container" ref={profileRef}>
        <img
          src={state.image || logo}
          alt="user"
          className="profile-icon"
          onClick={() => dispatch({ type: "TOGGLE_PROFILE" })}
        />

        <div className={`profile-dropdown ${state.showProfile ? "active" : ""}`}>

          <div className="profile-header">
            <img src={state.image || logo} alt="user" className="avatar" />
            <div>
              <h4>{state.name}</h4>
              <p>{state.phone}</p>
            </div>
          </div>

          <hr />

          {!state.editMode && (
            <div className="profile-menu">
              <button onClick={() => dispatch({ type: "EDIT_MODE" })}>
                Edit Profile
              </button>

              <button className="logout" onClick={handleLogout}>
                <img src={logout} alt="" /> Logout
              </button>
            </div>
          )}

          {state.editMode && (
            <div className="form-section">
              <h4>Edit Profile</h4>

              <div className="avatar-upload">
                <img src={state.image || logo} alt="preview" />
                <input type="file" onChange={handleImageChange} />
              </div>

              <form onSubmit={handleUpdateProfile}>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) =>
                    dispatch({ type: "SET_NAME", payload: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  value={state.phone}
                  onChange={(e) =>
                    dispatch({ type: "SET_PHONE", payload: e.target.value })
                  }
                  required
                />

                <div className="btn-group">
                  <button type="submit">Save</button>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: "CLOSE_ALL" })}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;