import { useState } from "react";
import { useQueueContext } from "../context/context";
import { invoke } from "@tauri-apps/api";

export const Model = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (is: boolean) => void;
}) => {
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
        setShowModal(false)
        pushReceiver([ip, port, userName]);
      }
    });
  }
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-appColor">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"></div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="h-[250px] grid grid-rows-3">
                    <div className="row-span-1 flex items-center justify-center">
                      <input
                        placeholder="Enter receiver name"
                        type="text"
                        className="w-[80%] bg-buttonColor px-4 py-2 rounded-2xl"
                        onChange={(e) => {
                          setUserName(e.target.value);

                          setIsError(false);
                        }}
                        value={userName}
                      />
                    </div>
                    <div className="row-span-1 flex items-center justify-center">
                      <input
                        placeholder="Enter receiver ip"
                        type="text"
                        className="w-[80%] bg-buttonColor px-4 py-2 rounded-2xl"
                        onChange={(e) => {
                          setIp(e.target.value);

                          setIsError(false);
                        }}
                        value={ip}
                      />
                    </div>
                    <div className="row-span-1 flex items-center justify-center">
                      <input
                        placeholder="Enter receiver port"
                        type="text"
                        className="w-[80%] bg-buttonColor px-4 py-2 rounded-2xl"
                        onChange={(e) => {
                          setPort(e.target.value);

                          setIsError(false);
                        }}
                        value={port}
                      />
                    </div>
                  </div>
                  {isError && (
                    <p className="text-red-600 text-center ">
                      Receiver not Found !
                    </p>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-buttonColor text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      handleConnect();
                    }}
                  >
                    connect
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};
