import {
  useState,
  useContext,
  useRef,
  useEffect
} from "react";

import {
  useLocation
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

  const [language, setLanguage] =
    useState(
      localStorage.getItem("language") || "en"
    );

  useEffect(() => {

    const handleLanguageChange = () => {

      setLanguage(
        localStorage.getItem("language") || "en"
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

  const text = {

    en: {
      heading: "Report Issue",
      edit: "Edit Issue",
      describe: "Describe the Problem",
      issuePlaceholder:
        "Your Issue",
      locationPlaceholder:
        "Location",
      upload:
        "Upload proof of the issue",
      submit: "Submit Issue",
      update: "Update Issue",
      submitting: "Submitting...",
      titleRequired:
        "Issue title is required",
      locationRequired:
        "Location is required",
      success:
        "Complaint Submitted Successfully",
      updateSuccess:
        "Complaint Updated Successfully",
    },

    ta: {
      heading: "புகார் பதிவு",
      edit: "புகாரை திருத்து",
      describe:
        "பிரச்சனையை விவரிக்கவும்",
      issuePlaceholder:
        "உங்கள் பிரச்சனை",
      locationPlaceholder:
        "இடம்",
      upload:
        "பிரச்சனையின் புகைப்படத்தை பதிவேற்றவும்",
      submit:
        "புகாரை சமர்ப்பிக்கவும்",
      update:
        "புகாரை புதுப்பிக்கவும்",
      submitting:
        "சமர்ப்பிக்கப்படுகிறது...",
      titleRequired:
        "பிரச்சனை தலைப்பு தேவை",
      locationRequired:
        "இடம் தேவை",
      success:
        "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது",
      updateSuccess:
        "புகார் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    },
  };

  const t = text[language];

  const [editId, setEditId] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [image, setImage] =
    useState(null);

  // IMAGE PREVIEW
  const [previewImage, setPreviewImage] =
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

      setPreviewImage(c.proof || "");

      setEditId(c._id);

    } else {

      setTitle("");

      setLocation("");

      setImage(null);

      setPreviewImage("");

      setEditId(null);
    }

  }, [locationData.state]);

  // SUBMIT FUNCTION
  const handleSubmit = async (e) => {

    e.preventDefault();

    // PREVENT MULTIPLE CLICKS
    if (submitting) return;

    // VALIDATION
    if (!title.trim()) {

      toast.warning(
        t.titleRequired
      );

      return;
    }

    if (!location.trim()) {

      toast.warning(
        t.locationRequired
      );

      return;
    }

    setSubmitting(true);

    const storedUserName =
      localStorage.getItem("name");

    // FORM DATA
    const formData =
      new FormData();

    formData.append(
      "user_id",
      userId
    );

    formData.append(
      "user_name",
      storedUserName ||
      currentUserName
    );

    formData.append(
      "title",
      title
    );

    formData.append(
      "location",
      location
    );

    formData.append(
      "status",
      "Pending"
    );

    // IMAGE FILE
    if (image) {

      formData.append(
        "proof",
        image
      );
    }

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

          // DON'T ADD CONTENT-TYPE
          body: formData,
        });

      const data =
        await response.json();

      if (response.ok) {

        toast.success(

          editId
            ? t.updateSuccess
            : t.success
        );

        // RESET FORM
        setTitle("");

        setLocation("");

        setImage(null);

        setPreviewImage("");

        setEditId(null);

        if (fileInputRef.current) {

          fileInputRef.current.value =
            "";
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

      toast.error(
        "Server Error"
      );

    } finally {

      setSubmitting(false);
    }
  };

  return (

    <>

      <div className="report-head">

        <h2>

          {editId
            ? t.edit
            : t.heading}

        </h2>

      </div>

      <div className="report-wrapper">

        <div className="report-card">

          <form
            onSubmit={
              handleSubmit
            }
          >

            <h3 className="report-subtitle">

              {t.describe}

            </h3>

            {/* ISSUE TITLE WITH MIC */}
            <div className="input-mic-wrapper">

              <input
                type="text"
                placeholder={
                  t.issuePlaceholder
                }
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                className="input-field mic-input"
                required
              />

              <div className="mic-inside">

                <VoiceInput
                  onTextDetected={(text) =>
                    setTitle(text)
                  }
                />

              </div>

            </div>

            {/* LOCATION */}
            <input
              type="text"
              placeholder={
                t.locationPlaceholder
              }
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              className="input-field"
              required
            />

            {/* CAMERA SECTION */}
            <div className="camera-section">

              <p className="camera-text">

                {t.upload}

              </p>

              <Cameracapture

                setImage={(file) => {

                  setImage(file);

                  setPreviewImage(
                    URL.createObjectURL(file)
                  );
                }}

              />

              {/* IMAGE PREVIEW */}
              {previewImage && (

                <img
                  src={previewImage}
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
                ? t.submitting
                : editId
                  ? t.update
                  : t.submit}

            </button>

          </form>

        </div>

      </div>

    </>
  );
};

export default Reportissue;