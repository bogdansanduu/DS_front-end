import React from "react";

const AccessDeniedPage = () => {
  return (
    <div
      id="access-denided-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <h1>Oops!</h1>
      <p>Sorry, you can't be here.</p>
      <p style={{ color: "red", fontWeight: 500, fontSize: "20px" }}>
        <i>Access DENIED</i>
      </p>
    </div>
  );
};

export default AccessDeniedPage;
