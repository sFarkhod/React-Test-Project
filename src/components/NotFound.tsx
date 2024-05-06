import React from "react";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        height: '90vh',
      }}
    >
      <h2 style={{ fontSize: "30px" }}>Not Found</h2>
      <h1 style={{ fontWeight: "bolder", fontSize: "150px" }}>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
