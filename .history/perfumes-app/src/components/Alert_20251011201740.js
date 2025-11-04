import React, { useEffect, useState } from "react";

function Alert({ type = "success", message = "", duration = 4000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);

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
      <button
        type="button"
        className="btn-close"
        onClick={() => {
          setShow(false);
          if (onClose) onClose();
        }}
      ></button>
    </div>
  );
}

export default Alert;
