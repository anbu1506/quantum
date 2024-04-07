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
import { GetText } from "./components/GetText";
import { confirm } from "@tauri-apps/api/dialog";
function App() {
  const { addToReceiveQueue, markReceived, addText } = useQueueContext();
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
    const unlisten3 = listen<String>("onTextReceive", (event) => {
      console.log("onTextReceive");
      addText(event.payload);
    });
    type AcceptPayload = {
      event: String;
      file_name: String;
      sender_name: String;
    };
    const unlisten4 = listen<AcceptPayload>("auth", (event) => {
      const payload = event.payload;
      confirm(`receive ${payload.file_name} from ${payload.sender_name}`).then(
        (e) => {
          if (e) {
            console.log("confirm");
            appWindow.emit(payload.event as string, 1);
          } else {
            console.log("deny");
            appWindow.emit(payload.event as string, 0);
          }
        }
      );
    });
    return () => {
      unlisten1.then((f) => f());
      unlisten2.then((f) => f());
      unlisten3.then((f) => f());
      unlisten4.then((f) => f());
    };
  }, []);
  return (
    <>
      <div className=" h-screen">
        <Router>
          {/* <Nav></Nav> */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/send" element={<Send />}></Route>
            <Route path="/receive" element={<Receive />}></Route>
            <Route path="/clipboard" element={<GetText />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
