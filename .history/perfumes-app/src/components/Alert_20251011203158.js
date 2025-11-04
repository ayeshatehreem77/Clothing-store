import React, { useEffect, useState } from "react";

function Alert({ type = "success", message = "", duration = 4000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 4000);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
      style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1055 }}
    >
      {message}
      
    </div>
  );
}

export default Alert;
