import React from "react";

function Options() {
  return (
    <div>
      <button
        title="Hover"
        onClick={() => {
          window.location.href = "foreground.html";
        }}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        Page change btn 1
      </button>
      <button
        title="Hover"
        style={{ position: "absolute", top: "30%", left: "50%" }}
      >
        Click btn 2
      </button>
    </div>
  );
}

export default Options;
