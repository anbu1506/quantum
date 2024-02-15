import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [ip, setIp] = useState<String>("");
  const [port, setPort] = useState<String>("");
  useEffect(() => {
    invoke("get_addr").then((res) => {
      setIp((res as String[])[0]);
      setPort((res as String[])[1]);
    });
  });
  return (
    <div className="h-screen bg-slate-950 grid grid-rows-3 text-white ">
      <div className="flex items-center justify-center">
        <Link
          to={"/send"}
          className=" bg-blue-900 px-8 py-3 rounded-md shadow-xl shadow-blue-800 font-semibold text-lg "
        >
          Send
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <Link
          // onClick={() => {}}
          to="/receive"
          className=" bg-green-500 px-6 py-3 rounded-md shadow-xl shadow-green-800 font-semibold text-lg "
        >
          Receive
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center text-white gap-3">
        <div className="flex gap-5 text-gray-600">
          <p>IP {ip}</p>
          <p>Port {port}</p>
        </div>
        <p className="flex font-normal">&copy; All rights reserved</p>
      </div>
    </div>
  );
};
