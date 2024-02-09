import "./App.css";
import { Home } from "./components/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Send } from "./components/Send";
import { Receive } from "./components/Receive";
import { Nav } from "./components/Nav";
function App() {
  return (
    <>
      <div className="bg-slate-950">
        <Nav></Nav>
        <Router>
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
