import "./App.css";
import { Home } from "./components/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Send } from "./components/Send";
import { Receive } from "./components/Receive";
import { Nav } from "./components/Nav";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import {
  ReceivePayload,
  ReceivedPayload,
  useQueueContext,
} from "./context/context";
function App() {
  const { addToReceiveQueue, markReceived } = useQueueContext();
  useEffect(() => {
    invoke("receive").catch((err) => {
      console.log(err);
    });

    return () => {
      appWindow.emit("stop_receiver").then(() => console.log("server stopped"));
    };
  }, []);
  useEffect(() => {
    const unlisten1 = listen<ReceivePayload>("onReceive", (event) => {
      console.log("hi");
      addToReceiveQueue(event.payload);
    });

    const unlisten2 = listen<ReceivedPayload>("onReceived", (event) => {
      console.log("hello");
      console.log(event.payload);
      markReceived(event.payload);
    });

    return () => {
      unlisten1.then((f) => f());
      unlisten2.then((f) => f());
    };
  }, []);
  return (
    <>
      <div className="bg-slate-950 h-screen">
        <Router>
          <Nav></Nav>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/send" element={<Send />}></Route>
            <Route path="/receive" element={<Receive />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
