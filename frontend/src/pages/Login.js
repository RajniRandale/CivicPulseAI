import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaUserTie,
  FaSignInAlt,
} from "react-icons/fa";

function Login() {
  return (
    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow-lg">

            {/* HEADER */}

            <div className="card-header bg-primary text-white text-center py-3">

              <h3 className="mb-0">
                <FaSignInAlt className="me-2" />
                Login
              </h3>

              <small>
                Choose your login type
              </small>

            </div>

            <div className="card-body p-4">

              <h5 className="text-center mb-4">
                Select Login Type
              </h5>

              {/* LOGIN OPTIONS */}

              <div className="d-grid gap-3">

                {/* CITIZEN LOGIN */}

                <Link
                  to="/citizen-login"
                  className="btn btn-primary btn-lg"
                >
                  <FaUser className="me-2" />
                  Citizen Login
                </Link>

                {/* OFFICER LOGIN */}

                <Link
                  to="/officer-login"
                  className="btn btn-dark btn-lg"
                >
                  <FaUserTie className="me-2" />
                  Officer Login
                </Link>

              </div>

              {/* REGISTER */}

              <div className="text-center mt-4">

                <span>
                  Don't have an account?{" "}
                </span>

                <Link
                  to="/register"
                  className="text-decoration-none fw-bold"
                >
                  Register
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;