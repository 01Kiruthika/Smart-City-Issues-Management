import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { UserName } from "./App.jsx";
import API from "./Backendurl.jsx";
import { toast } from "react-toastify";

const Authupage = () => {

  const [active, setActive] = useState(false);

  const { setCurrentUserName, setRole } =
    useContext(UserName);

  const navigate = useNavigate();

  // ================= LOGIN STATES =================
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("");

  // ================= REGISTER STATES =================
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");



  // ================= REGISTER =================
  const handleRegister = async (e) => {

    e.preventDefault();

    // ONLY FRONTEND VALIDATION
    if (password !== confirmPassword) {

      toast.warning("Passwords do not match");

      return;
    }

    const userData = {
      name,
      phonenumber: phone,
      address,
      password,
    };

    try {

      const response = await fetch(
        `${API.BASE_URL}/user`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (data.status === true) {

        toast.success(
          data.message || "Registration Successful"
        );

        setActive(false);

        // CLEAR FIELDS
        setName("");
        setPhone("");
        setAddress("");
        setPassword("");
        setConfirmPassword("");

      } else {

        // BACKEND ERROR MESSAGE
        toast.error(
          data.message || "Registration Failed"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error("Server Error");
    }
  };



  // ================= LOGIN =================
  const handleLogin = async (e) => {

    e.preventDefault();

    const loginData = {
      phonenumber: loginPhone,
      password: loginPassword,
      role: loginRole.toLowerCase(),
    };

    try {

      const response = await fetch(
        `${API.BASE_URL}/userlogin`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (data.status === true) {

        toast.success(
          data.message || "Login Successful"
        );

        localStorage.clear();

        localStorage.setItem(
          "userId",
          data.userId
        );

        localStorage.setItem(
          "name",
          data.name
        );

        localStorage.setItem(
          "role",
          data.role
        );

        localStorage.setItem(
          "token",
          data.token
        );

        setCurrentUserName(data.name);

        setRole(data.role);

        setTimeout(() => {

          navigate("/app/");

        }, 1000);

      } else {

        // BACKEND ERROR MESSAGE
        toast.error(
          data.message || "Invalid Credentials"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error("Server Error");
    }

    // CLEAR LOGIN FIELDS
    setLoginPhone("");
    setLoginPassword("");
    setLoginRole("");
  };



  return (
    <div className="main-container">

      <div className={`container ${active ? "active" : ""}`}>

        {/* ================= LOGIN ================= */}
        <div className="form-container sign-in">

          <form onSubmit={handleLogin}>

            <h1>Login</h1>

            <div className="input-group">

              <input
                type="tel"
                value={loginPhone}
                onChange={(e) =>
                  setLoginPhone(e.target.value)
                }
                required
              />

              <label>Phone Number</label>

            </div>

            <div className="input-group">

              <input
                type="password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                required
              />

              <label>Password</label>

            </div>

            <div className="input-group">

              <select
                value={loginRole}
                onChange={(e) =>
                  setLoginRole(e.target.value)
                }
                required
              >

                <option value="">
                  Select Role
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="citizen">
                  Citizen
                </option>

                <option value="manager">
                  Manager
                </option>

              </select>

            </div>

            <button type="submit">
              Login
            </button>

            <p className="switch-text">

              Don't have an account?{" "}

              <span
                onClick={() => setActive(true)}
              >
                Sign Up
              </span>

            </p>

          </form>

        </div>



        {/* ================= REGISTER ================= */}
        <div className="form-container sign-up">

          <form onSubmit={handleRegister}>

            <h1>Register</h1>

            <div className="input-group">

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <label>Your Name</label>

            </div>

            <div className="input-group">

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />

              <label>Phone Number</label>

            </div>

            <div className="input-group">

              <input
                type="text"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                required
              />

              <label>Address</label>

            </div>

            <div className="input-group">

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <label>Password</label>

            </div>

            <div className="input-group">

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <label>Confirm Password</label>

            </div>

            <button type="submit">
              Register
            </button>

            <p className="switch-text">

              Already have an account?{" "}

              <span
                onClick={() => setActive(false)}
              >
                Sign In
              </span>

            </p>

          </form>

        </div>



        {/* ================= TOGGLE PANEL ================= */}
        <div className="toggle-container">

          <div className="toggle">

            {/* LOGIN SIDE */}
            <div className="toggle-panel toggle-right">

              <h1>WELCOME BACK!</h1>

              <p>
                We are happy to have you with us
                again. If you need anything,
                we are here to help.
              </p>

            </div>

            {/* REGISTER SIDE */}
            <div className="toggle-panel toggle-left">

              <h1>WELCOME!</h1>

              <p>
                We're delighted to have you here.
                If you need any assistance,
                feel free to reach out.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Authupage;