import React from "react";

function NoMatch() {

  console.log("NoMatch.jsx", "window.location.href", window.location.href);

  return <div>That page doesn't exist for: {window.location.href}</div>;
}

export default NoMatch;
