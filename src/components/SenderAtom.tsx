import { invoke } from "@tauri-apps/api";
import { SendQueue } from "../context/context";
import { useEffect } from "react";

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
  useEffect(() => {
    console.log("SenderAtom");
    console.log(sendQueue);
  }, [sendQueue]);

  const myQueue = sendQueue.filter((transaction) => {
    return transaction.receiver_ip === ip;
  });
  return (
    <div className=" bg-white mx-5 my-4 rounded-sm text-black">
      <div className="grid grid-rows-2 h-full">
        <div className="grid grid-cols-3 items-center text-center">
          <div className="text-black">{userName}</div>
          <div className="text-black">{ip}</div>
          <div className="text-black">{port}</div>
        </div>
        <div className="bg-white">
          {myQueue.map((transaction, idx) => {
            return (
              <>
                <div key={idx} className="text-black">
                  <div className="flex items-center">
                    <div className="p-4 w-[310px]">
                      sending {transaction.file_name} ...
                    </div>
                    <div className=" w-10 h-10">
                      {transaction.have_sent ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-8 h-8 mr-2 text-black"
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
                  {transaction.have_sent ? (
                    <div className="px-4">
                      sent {transaction.bytes_sent.toString()}{" "}
                      {transaction.file_name}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            );
          })}
        </div>
        <div className="text-white flex justify-center items-center h-7 my-2">
          <button
            className=" bg-indigo-900 w-full mx-3 rounded-full"
            onClick={() => {
              console.log("send");
              invoke("send", { receiverIp: ip, receiverPort: port }).catch(
                () => {
                  console.log;
                }
              );
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
