import {
  useState,
  useContext,
  useReducer,
} from "react";

import { useNavigate } from "react-router-dom";

import "./Login.css";

import { UserName } from "./App.jsx";

import API from "./Backendurl.jsx";

import { toast } from "react-toastify";



// ================= INITIAL STATE =================
const initialState = {

  // REGISTER
  name: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",

  // LOGIN
  loginPhone: "",
  loginPassword: "",
  loginRole: "",

  // ERRORS
  errors: {},
};



// ================= REDUCER =================
const reducer = (state, action) => {

  switch (action.type) {

    case "SET_FIELD":

      return {

        ...state,

        [action.field]: action.value,
      };

    case "SET_ERRORS":

      return {

        ...state,

        errors: action.payload,
      };

    case "CLEAR_REGISTER":

      return {

        ...state,

        name: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",

        errors: {},
      };

    case "CLEAR_LOGIN":

      return {

        ...state,

        loginPhone: "",
        loginPassword: "",
        loginRole: "",

        errors: {},
      };

    default:

      return state;
  }
};



const Authupage = () => {

  const [active, setActive] = useState(false);

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { setCurrentUserName, setRole } =
    useContext(UserName);

  const navigate = useNavigate();



  // ================= REGISTER =================
  const handleRegister = async (e) => {

    e.preventDefault();

    let errors = {};

    // NAME VALIDATION
    if (state.name.trim().length < 3) {

      errors.name =
        "Name must contain minimum 3 letters";
    }

    // PHONE VALIDATION

    if (!/^\d{10}$/.test(state.phone)) {

      errors.phone =
        "Phone number must contain 10 digits";

    } else if (
      !/^[986]/.test(state.phone)
    ) {

      errors.phone =
        "Phone number must start with 9, 8, or 6";
    }
    // ADDRESS VALIDATION
    if (state.address.trim().length < 5) {

      errors.address =
        "Please enter valid address";
    }

    // PASSWORD VALIDATION
    if (state.password.length < 6) {

      errors.password =
        "Password must be at least 6 characters";
    }

    // CONFIRM PASSWORD
    if (
      state.password !==
      state.confirmPassword
    ) {

      errors.confirmPassword =
        "Passwords do not match";
    }

    // SET ERRORS
    dispatch({
      type: "SET_ERRORS",
      payload: errors,
    });

    // STOP API IF ERROR EXISTS
    if (
      Object.keys(errors).length > 0
    ) {

      return;
    }

    const userData = {

      name: state.name,

      phonenumber: state.phone,

      address: state.address,

      password: state.password,
    };

    try {

      const response = await fetch(
        `${API.BASE_URL}/user`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (data.status === true) {

        toast.success(
          data.message ||
          "Registration Successful"
        );

        setActive(false);

        dispatch({
          type: "CLEAR_REGISTER",
        });

      } else {

        toast.error(
          data.message ||
          "Registration Failed"
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

    let errors = {};

    if (
      !/^\d{10}$/.test(
        state.loginPhone
      )
    ) {

      errors.loginPhone =
        "Phone number must contain 10 digits";

    } else if (
      !/^[986]/.test(
        state.loginPhone
      )
    ) {

      errors.loginPhone =
        "Phone number must start with 9, 8, or 6";
    }

    // PASSWORD VALIDATION
    if (
      state.loginPassword.length < 6
    ) {

      errors.loginPassword =
        "Password must be at least 6 characters";
    }

    // ROLE VALIDATION
    if (state.loginRole === "") {

      errors.loginRole =
        "Please select role";
    }

    // SET ERRORS
    dispatch({
      type: "SET_ERRORS",
      payload: errors,
    });

    // STOP API IF ERROR EXISTS
    if (
      Object.keys(errors).length > 0
    ) {

      return;
    }

    const loginData = {

      phonenumber: state.loginPhone,

      password: state.loginPassword,

      role:
        state.loginRole.toLowerCase(),
    };

    try {

      const response = await fetch(
        `${API.BASE_URL}/userlogin`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (data.status === true) {

        toast.success(
          data.message ||
          "Login Successful"
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

        dispatch({
          type: "CLEAR_LOGIN",
        });

      } else {

        toast.error(
          data.message ||
          "Invalid Credentials"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error("Server Error");
    }
  };



  return (

    <div className="main-container">

      <div
        className={`container ${active ? "active" : ""
          }`}
      >

        {/* ================= LOGIN ================= */}
        <div className="form-container sign-in">

          <form onSubmit={handleLogin}>

            <h1>Login</h1>

            {/* PHONE */}
            <div className="input-group">

              <input
                type="number"
                maxLength={10}
                value={state.loginPhone}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field: "loginPhone",

                    value: e.target.value,
                  })
                }
                required
              />

              <label>
                Phone Number
              </label>

              <span className="error">

                {
                  state.errors
                    .loginPhone
                }

              </span>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <input
                type="password"
                value={
                  state.loginPassword
                }
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field:
                      "loginPassword",

                    value:
                      e.target.value,
                  })
                }
                required
              />

              <label>
                Password
              </label>

              <span className="error">

                {
                  state.errors
                    .loginPassword
                }

              </span>

            </div>

            {/* ROLE */}
            <div className="input-group">

              <select
                value={state.loginRole}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field: "loginRole",

                    value:
                      e.target.value,
                  })
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

              <span className="error">

                {
                  state.errors
                    .loginRole
                }

              </span>

            </div>

            <button type="submit">

              Login

            </button>

            <p className="switch-text">

              Don't have an account?{" "}

              <span
                onClick={() =>
                  setActive(true)
                }
              >

                Sign Up

              </span>

            </p>

          </form>

        </div>



        {/* ================= REGISTER ================= */}
        <div className="form-container sign-up">

          <form
            onSubmit={handleRegister}
          >

            <h1>Register</h1>

            {/* NAME */}
            <div className="input-group">

              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field: "name",

                    value:
                      e.target.value,
                  })
                }
                required
              />

              <label>
                Your Name
              </label>

              <span className="error">

                {
                  state.errors.name
                }

              </span>

            </div>

            {/* PHONE */}
            <div className="input-group">

              <input
                type="number"
                maxLength={10}
                value={state.phone}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field: "phone",

                    value: e.target.value,
                  })
                }
                required
              />
              <label>
                Phone Number
              </label>

              <span className="error">

                {
                  state.errors.phone
                }

              </span>

            </div>

            {/* ADDRESS */}
            <div className="input-group">

              <input
                type="text"
                value={state.address}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field: "address",

                    value:
                      e.target.value,
                  })
                }
                required
              />

              <label>
                Address
              </label>

              <span className="error">

                {
                  state.errors
                    .address
                }

              </span>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <input
                type="password"
                value={
                  state.password
                }
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field:
                      "password",

                    value:
                      e.target.value,
                  })
                }
                required
              />

              <label>
                Password
              </label>

              <span className="error">

                {
                  state.errors
                    .password
                }

              </span>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <input
                type="password"
                value={
                  state.confirmPassword
                }
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",

                    field:
                      "confirmPassword",

                    value:
                      e.target.value,
                  })
                }
                required
              />

              <label>
                Confirm Password
              </label>

              <span className="error">

                {
                  state.errors
                    .confirmPassword
                }

              </span>

            </div>

            <button type="submit">

              Register

            </button>

            <p className="switch-text">

              Already have an account?{" "}

              <span
                onClick={() =>
                  setActive(false)
                }
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

              <h1>
                WELCOME BACK!
              </h1>

              <p>
                We are happy to have
                you with us again.
              </p>

            </div>

            {/* REGISTER SIDE */}
            <div className="toggle-panel toggle-left">

              <h1>
                WELCOME!
              </h1>

              <p>
                We're delighted to
                have you here.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Authupage;