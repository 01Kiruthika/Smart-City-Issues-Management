import {
  useState,
  useContext,
  useRef,
  useEffect
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { UserName } from "../App.jsx";

import "./user.css";

import Cameracapture from "./Cameracapture.jsx";

import VoiceInput from "./VoiceInput.jsx";

import { UserContext } from "../UserContext.jsx";

import authFetch from "../Utils/authFetch.js";

import API from "../Backendurl.jsx";

import { toast } from "react-toastify";



const Reportissue = () => {

  const { currentUserName } =
    useContext(UserName);

  const { userId } =
    useContext(UserContext);

  const locationData =
    useLocation();

  const navigate =
    useNavigate();

  const [editId, setEditId] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [image, setImage] =
    useState("");

  // LOADING STATE
  const [submitting, setSubmitting] =
    useState(false);

  const fileInputRef =
    useRef(null);



  // LOAD EDIT DATA
  useEffect(() => {

    if (locationData.state) {

      const c =
        locationData.state;

      setTitle(c.title || "");

      setLocation(c.location || "");

      setImage(c.proof || "");

      setEditId(c._id);

    } else {

      setTitle("");

      setLocation("");

      setImage("");

      setEditId(null);
    }

  }, [locationData.state]);



  // SUBMIT FUNCTION
  const handleSubmit = async (e) => {

    e.preventDefault();

    // PREVENT MULTIPLE CLICKS
    if (submitting) return;

    setSubmitting(true);

    const token =
      localStorage.getItem("token");

    if (!userId || !token) {

      toast.error(
        "Session expired. Please login again."
      );

      navigate("/");

      setSubmitting(false);

      return;
    }

    const complaintData = {

      user_id: userId,

      title,

      location,

      proof: image,

      status: "Pending",
    };

    try {

      let url =
        `${API.BASE_URL}/complaint`;

      let method = "POST";

      // EDIT MODE
      if (editId) {

        url =
          `${API.BASE_URL}/complaint/${editId}`;

        method = "PUT";
      }

      const response =
        await authFetch(url, {

          method,

          body: JSON.stringify(
            complaintData
          ),
        });

      const data =
        await response.json();

      if (response.ok) {

        toast.success(

          editId
            ? "Complaint Updated Successfully"
            : "Complaint Submitted Successfully"
        );

        // RESET FORM
        setTitle("");

        setLocation("");

        setImage("");

        setEditId(null);

        if (fileInputRef.current) {

          fileInputRef.current.value = "";
        }

      } else {

        toast.error(
          data.message ||
          "Something went wrong"
        );
      }

    } catch (error) {

      console.error(
        "Submit Error:",
        error
      );

      toast.error("Server Error");

    } finally {

      setSubmitting(false);
    }
  };



  return (

    <>

      <div className="report-head">

        <h2>
          {editId
            ? "Edit Issue"
            : "Report Issue"}
        </h2>

      </div>



      <div className="report-wrapper">

        <div className="report-card">

          <form onSubmit={handleSubmit}>

            <h3 className="report-subtitle">
              Describe the Problem
            </h3>



            {/* VOICE INPUT */}
            <div className="voice-row">

              <VoiceInput
                onTextDetected={(text) =>
                  setTitle(text)
                }
              />

            </div>



            {/* ISSUE TITLE */}
            <input
              type="text"
              placeholder="Issue"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="input-field"
              required
            />



            {/* LOCATION */}
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="input-field"
              required
            />



            {/* CAMERA SECTION */}
            <div className="camera-section">

              <p className="camera-text">
                Upload proof of the issue
              </p>



              <Cameracapture
                setImage={setImage}
              />



              {/* IMAGE PREVIEW */}
              {image && (

                <img
                  src={image}
                  alt="preview"
                  className="preview-img"
                  style={{
                    width: "150px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
              )}

            </div>



            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >

              {submitting
                ? "Submitting..."
                : editId
                  ? "Update Issue"
                  : "Submit Issue"}

            </button>

          </form>

        </div>

      </div>

    </>
  );
};

export default Reportissue;