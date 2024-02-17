import { invoke } from "@tauri-apps/api";
import { SendQueue } from "../context/context";
import { useEffect, useState } from "react";
import { Model } from "./Model";

export const SenderAtom = ({
  userName,
  port,
  ip,
  sendQueue,
}: {
  userName: String;
  port: String;
  ip: String;
  sendQueue: SendQueue[];
}) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    console.log("SenderAtom");
    console.log(sendQueue);
  }, [sendQueue]);

  const myQueue = sendQueue.filter((transaction) => {
    return transaction.receiver_ip === ip;
  });

  const sendTxt = (text: String) => {
    invoke("send_txt", { receiverIp: ip, receiverPort: port, text }).catch(
      () => {
        console.log;
      }
    );
  };
  return (
    <div className=" bg-white mx-5 my-4 rounded-sm text-black shadow-xl">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-3 items-center text-center py-3">
          <div className="mx-1 text-white bg-green-600 rounded-md py-1  flex-wrap text-sm">
            {userName.toUpperCase()}
          </div>
          <div className="mx-1 text-white bg-blue-900 rounded-md py-1 flex-wrap text-sm">
            {ip}
          </div>
          <div className="mx-1 text-white bg-yellow-600 rounded-md py-1 flex-wrap text-sm">
            {port}
          </div>
        </div>
        <div className="bg-white">
          {myQueue.map((transaction, idx) => {
            return (
              <>
                <div key={idx} className="text-black">
                  <div className="flex items-center">
                    <div className="p-4 w-[310px]">
                      {transaction.have_sent ? "Sent" : "Sending"}{" "}
                      {transaction.file_name} ...
                    </div>
                    <div className=" w-10 h-10">
                      {transaction.have_sent ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 mr-2 text-green-400"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      ) : (
                        <div className="border-2 h-6 w-6 border-blue-800 animate-spin"></div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="text-white flex items-center h-7 my-5">
          <button
            className=" bg-indigo-900   mx-3 rounded-md px-2 py-1 shadow-xl shadow-blue-800"
            onClick={() => {
              console.log("send");
              invoke("send", { receiverIp: ip, receiverPort: port }).catch(
                () => {
                  console.log;
                }
              );
            }}
          >
            Send File
          </button>
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className=" bg-indigo-900   mx-3 rounded-md px-2 py-1 shadow-xl shadow-blue-800"
          >
            send txt
          </button>
          <Model
            showModal={showModal}
            setShowModal={(is) => {
              setShowModal(is);
            }}
            sendTxt={sendTxt}
          ></Model>
        </div>
      </div>
    </div>
  );
};
