import React from "react";

function NoMatch() {
  return <div>That page doesn't exist for: {window.location.href}</div>;
}

export default NoMatch;
