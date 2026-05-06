import React, { useState, useEffect } from "react";
import "./admin.css";
import { useLocation, useNavigate } from "react-router-dom";
import authFetch from "../Utils/authFetch.js";
import emailjs from "@emailjs/browser";
import API from "../Backendurl.jsx"
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

  // Fill form when editing
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phonenumber.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    if (!editData && !formData.password) {
      toast.error("Password is required for new manager");
      return;
    }

    try {
      setLoading(true);

      let res;

      // UPDATE
      if (editData) {
        res = await authFetch(`${API.BASE_URL}/manager/${editData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      }
      // CREATE
      else {
        res = await authFetch(`${API.BASE_URL}/manager`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      // safer JSON handling
      let data = {};
      try {
        data = await res.json();
      } catch { }

      if (res.ok) {

        // Send email only when creating
        if (!editData) {
          try {
            await emailjs.send(
              "service_909i4zn",
              "template_t64qt6k",
              {
                name: formData.name,
                email: formData.email,
                password: formData.password
              },
              "zqUfWoQbJx9clo0Qp"
            );

            toast.success("Manager created & Welcome email sent");

          } catch (emailError) {
            console.error("Email failed:", emailError);
            toast.error("Manager created but email failed");
          }
        } else {
          toast.success("Manager updated successfully");
        }

        navigate("/app/users");

      } else {
        toast.error(data.message || "Error");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-container">
      <div className="cm-card">
        <h2 className="cm-title">
          {editData ? "Edit Manager" : "Create Manager"}
        </h2>

        <form onSubmit={handleSubmit} className="cm-form">

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

          <div className="cm-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder={editData ? "Leave blank to keep same password" : ""}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
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