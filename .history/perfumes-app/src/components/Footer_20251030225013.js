import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center py-4"
    >
      <p style={{ margin: 0, fontSize: "14px" }}>
        &copy; {year} Zarmina. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
