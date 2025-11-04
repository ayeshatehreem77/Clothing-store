import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useState } from "react";
import Alert from "./Alert";

const Footer = () => {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Replace these with your EmailJS service/template/user IDs
    const serviceID = "service_n8uzhqi";
    const templateID = "template_y1jj8je";
    const publicKey = "caMZiQQwaW5NSwTlQ";

    emailjs.send(
      serviceID,
      templateID,
      {
        name: formData.name,      // matches {{name}} in template
        title: formData.message,  // matches {{title}} in template
        email: formData.email      // matches {{email}} in template → recipient
      },
      publicKey
    )
      .then(
        (result) => {
          setAlert({ type: "success", message: "Thank you email sent successfully!" });
          setFormData({ name: "", email: "", message: "" });
          setSending(false);
        },
        (error) => {
          console.error(error.text);
          setAlert({ type: "danger", message: "Failed to send email. Please try again." });
          setSending(false);
        }
      );


  };
  return (
    <footer className="text-center py-5 border-top">
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
            <a href="#" className="text-dark text-decoration-none fw-medium">
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
              className="form-control border-0 shadow-none bg-transparent"
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
      <Alert
        type={alert.type}
        message={alert.message}
        duration={3000}
        onClose={() => setAlert({ type: "", message: "" })}
      />
    </footer>
  );
};

export default Footer;
