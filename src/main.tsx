import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { QueueContextProvider } from "./context/context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueueContextProvider>
    <App />
  </QueueContextProvider>
);
