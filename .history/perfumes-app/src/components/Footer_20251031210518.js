import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-center py-5 border-top">
      <div className="container">
        {/* Quick Links */}
        <h5 className="fw-bold mb-3">Quick links</h5>
        <ul className="list-inline mb-4">
          <li className="list-inline-item mx-3">
            <a href="#" className="text-dark text-decoration-none fw-medium">
              Contact
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="#" className="text-dark text-decoration-none fw-medium">
              Privacy Policy
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="#" className="text-dark text-decoration-none fw-medium">
              Refund Policy
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="#" className="text-dark text-decoration-none fw-bold text-decoration-underline">
              Terms of Service
            </a>
          </li>
        </ul>

        {/* Subscribe Section */}
        <div className="d-flex flex-column align-items-center mb-4">
          <h5 className="fw-bold mb-3">Subscribe to our emails</h5>
          <div className="d-flex border border-dark p-2" style={{ width: "300px" }}>
            <input
              type="email"
              className="form-control border-0 shadow-none"
              placeholder="Email"
              style={{ fontSize: "14px" }}
            />
            <button className="btn border-0 text-dark">
              <span style={{ fontSize: "18px" }}>→</span>
            </button>
          </div>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <a href="#" className="text-dark fs-4">
            <FaInstagram />
          </a>
          <a href="#" className="text-dark fs-4">
            <FaTiktok />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-muted small mb-0">
          © {new Date().getFullYear()}, <span className="text-uppercase">Zarmina</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
