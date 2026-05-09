import { useRef, useState, useEffect } from "react";
import "./user.css";

const Cameracapture = ({ setImage }) => {

  const videoRef = useRef(null);

  const canvasRef = useRef(null);

  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);

  const [capturedImage, setCapturedImage] =
    useState(null);

  // FRONT / BACK CAMERA
  const [facingMode, setFacingMode] =
    useState("environment");



  // START CAMERA
  const startCamera = async (mode = facingMode) => {

    try {

      // STOP OLD STREAM
      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {
            facingMode: mode,
          },

          audio: false,
        });

      streamRef.current = stream;

      setFacingMode(mode);

      setCameraOn(true);

      setCapturedImage(null);

    } catch (err) {

      console.log(err);

    }
  };



  // SHOW VIDEO
  useEffect(() => {

    if (
      cameraOn &&
      videoRef.current &&
      streamRef.current
    ) {

      videoRef.current.srcObject =
        streamRef.current;
    }

  }, [cameraOn]);



  // CAPTURE PHOTO
  const capturePhoto = () => {

    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.5
      );

    // SAVE IMAGE
    setCapturedImage(imageData);

    setImage(imageData);

    // STOP CAMERA
    streamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    setCameraOn(false);
  };



  // SWITCH CAMERA
  const switchCamera = () => {

    const newMode =
      facingMode === "user"
        ? "environment"
        : "user";

    startCamera(newMode);
  };



  // RETAKE PHOTO
  const retakePhoto = () => {

    setCapturedImage(null);

    setImage(null);

    startCamera(facingMode);
  };



  return (

    <div className="camera-wrapper">

      {/* OPEN CAMERA BUTTON */}
      {!cameraOn && !capturedImage && (

        <button
          type="button"
          className="camera-btn"
          onClick={() => startCamera()}
        >
          Open Camera
        </button>
      )}



      {/* CAMERA SECTION */}
      {cameraOn && (

        <>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />



          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >

            <button
              type="button"
              className="capture-btn"
              onClick={capturePhoto}
            >
              Capture
            </button>



            <button
              type="button"
              className="camera-btn"
              onClick={switchCamera}
            >
              Switch Camera
            </button>

          </div>

        </>
      )}



      {/* PREVIEW IMAGE */}
      {capturedImage && (

        <div className="preview-section">

          <img
            src={capturedImage}
            alt="Captured"
            className="captured-image"
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          />



          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >

            <button
              type="button"
              className="camera-btn"
              onClick={retakePhoto}
            >
              Retake
            </button>

          </div>

        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

    </div>
  );
};

export default Cameracapture;