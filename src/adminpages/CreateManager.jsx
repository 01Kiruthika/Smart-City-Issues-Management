import React, { useState, useEffect } from "react";
import "./admin.css";
import { useLocation, useNavigate } from "react-router-dom";
import authFetch from "../Utils/authFetch.js";
import API from "../Backendurl.jsx";
import { toast } from "react-toastify";

const CreateManager = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const editData = location.state?.manager;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phonenumber: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // FILL EDIT DATA
  // =========================

  useEffect(() => {

    if (editData) {

      setFormData({
        name: editData.name || "",
        address: editData.address || "",
        phonenumber: editData.phonenumber || "",
        email: editData.email || "",
        password: ""
      });

    }

  }, [editData]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // PHONE VALIDATION
    if (formData.phonenumber.length !== 10) {

      toast.error("Phone number must be 10 digits");

      return;
    }

    // PASSWORD VALIDATION
    if (!editData && formData.password.length < 8) {

      toast.error(
        "Password must be at least 8 characters"
      );

      return;
    }

    try {

      setLoading(true);

      let res;

      // =========================
      // UPDATE MANAGER
      // =========================

      if (editData) {

        res = await authFetch(
          `${API.BASE_URL}/manager/${editData._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(formData)
          }
        );

      }

      // =========================
      // CREATE MANAGER
      // =========================

      else {

        res = await authFetch(
          `${API.BASE_URL}/manager`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(formData)
          }
        );

      }

      let data = {};

      try {

        data = await res.json();

      } catch (err) {
        console.log(err);
      }

      // =========================
      // SUCCESS
      // =========================

      if (res.ok) {

        toast.success(
          editData
            ? "Manager updated successfully"
            : "Manager created successfully & Email sent"
        );

        navigate("/app/users");

      }

      // =========================
      // FAILED
      // =========================

      else {

        toast.error(
          data.message || "Something went wrong"
        );

      }

    } catch (err) {

      console.error(err);

      toast.error("Server Error");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="cm-container">

      <div className="cm-card">

        <h2 className="cm-title">

          {editData
            ? "Edit Manager"
            : "Create Manager"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="cm-form"
        >

          {/* NAME */}

          <div className="cm-field">

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* ADDRESS */}

          <div className="cm-field">

            <label>Address</label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

          </div>

          {/* EMAIL */}

          <div className="cm-field">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PHONE */}

          <div className="cm-field">

            <label>Phone Number</label>

            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="cm-field">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder={
                editData
                  ? "Leave blank to keep same password"
                  : "Enter Password"
              }
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : editData
                ? "Update Manager"
                : "Create Manager"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateManager;