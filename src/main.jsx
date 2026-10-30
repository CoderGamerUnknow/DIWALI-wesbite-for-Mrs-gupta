import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.scss";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(<App />);
