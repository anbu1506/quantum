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
        <Link
          to={"/clipboard"}
          className="px-10 py-3 bg-slate-900 rounded-md shadow-xl shadow-slate-800 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        </Link>
        <div className="flex gap-5 text-gray-600">
          <p>IP {ip}</p>
          <p>Port {port}</p>
        </div>
        <p className="flex font-normal">&copy; All rights reserved</p>
      </div>
    </div>
  );
};
