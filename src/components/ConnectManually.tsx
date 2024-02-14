import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { useQueueContext } from "../context/context";

export const ConnectManually = () => {
  const { pushReceiver } = useQueueContext();
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  function handleConnect() {
    invoke("handle_manual_connect", { ip, port }).then((res) => {
      if (res === 404) {
        setIsError(true);
      } else if (res === 200) {
        setIsError(false);
        pushReceiver([ip, port, userName]);
      }
    });
  }
  return (
    <div className="text-black flex  flex-col bg-white  font-bold gap-5 p-4 my-2 mx-4">
      <div className="text-green-800 text-2xl text-center">
        Connect manually <span>🌐</span>
      </div>
      <div className="flex justify-between">
        <label htmlFor="ip" className=" ">
          ip addr
        </label>
        <input
          className="rounded-sm border border-green-400"
          type="text"
          name="ip"
          onChange={(e) => {
            setIp(e.target.value);
            setIsError(false);
          }}
          value={ip}
        />
      </div>

      <div className="flex justify-between">
        <label htmlFor="port">port</label>
        <input
          className="rounded-sm border border-green-400"
          type="text"
          name="port"
          onChange={(e) => {
            setPort(e.target.value);
            setIsError(false);
          }}
          value={port}
        />
      </div>

      <div className="flex justify-between">
        <label htmlFor="userName">username</label>
        <input
          className=" rounded-sm border border-green-400"
          type="text"
          name="userName"
          onChange={(e) => {
            setUserName(e.target.value);
            setIsError(false);
          }}
          value={userName}
        />
      </div>
      <button className="w-full bg-red-600 text-white" onClick={handleConnect}>
        Connect
      </button>
      {isError && (
        <p className="text-red-600 text-center ">Receiver not Found !</p>
      )}
    </div>
  );
};
