import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Widget from "./app/widget";

const root = getRoot();

if (root) {
  ReactDOM.render(
    <React.StrictMode>
      <Widget />
    </React.StrictMode>,
    root
  );
}

/**
 * Gets shadow root if it exists, otherwise use the host element
 */
function getRoot() {
  const host = document.getElementById("gomu-widget-embed-host");

  if (!host || !host.shadowRoot) {
    return host;
  }

  const shadowRoot = host.shadowRoot;

  const root = document.createElement("div");
  root.setAttribute("style", "display: contents");
  shadowRoot.appendChild(root);

  return root;
}
