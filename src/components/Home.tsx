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
    <div className="grid grid-rows-5 h-screen bg-appColor">
      <div className="row-span-3">
        <div className="grid grid-rows-4 h-full">
          <div className="row-span-1">
            <div className="flex items-center justify-center h-full">
              <h1 className="text-white font-bold text-center">Quantum</h1>
            </div>
          </div>
          <div className="row-span-1">
            <div className="flex items-center justify-center h-full">
              <Link
                to={"/send"}
                className="w-[60%] h-12 rounded-3xl bg-buttonColor text-white flex items-center justify-center"
              >
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 m-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="row-span-1">
            <div className="flex items-center justify-center h-full">
              <Link
                to={"/receive"}
                className="w-[60%] h-12 rounded-3xl bg-buttonColor text-white flex items-center justify-center"
              >
                view Received Files
                <svg
                  className="w-6 h-6 m-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="#ffffff"
                    d="M320 464c8.8 0 16-7.2 16-16V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64z"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="row-span-1">
            <div className="flex items-center justify-center h-full">
              <Link
                to={"/clipboard"}
                className="w-[60%] h-12 rounded-3xl bg-buttonColor text-white flex items-center justify-center"
              >
                view Received Text
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 m-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row-span-2">
        <div className="h-[70%] m-[5%] rounded-2xl bg-buttonColor text-white">
          <div className="grid grid-rows-3 h-full">
            <div className=" row-span-1 flex">
              <div className="w-1/2 flex items-center justify-center">
                IP : {ip}
              </div>
              <div className="w-1/2 flex items-center justify-center">
                PORT : {port}
              </div>
            </div>
            <div className=" row-span-2">
              <article className="text-wrap p-4">
                <p>
                  use this ip address and port number to connect with other
                  device by using the manual connect option
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
