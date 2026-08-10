import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow-lg p-4">

            <h2 className="text-center mb-4">
              Choose Login Type
            </h2>

            <div className="d-grid gap-3">

              <Link
                to="/citizen-login"
                className="btn btn-primary btn-lg"
              >
                👤 Citizen Login
              </Link>

              <Link
                to="/admin-login"
                className="btn btn-dark btn-lg"
              >
                🛡️ Admin Login
              </Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;