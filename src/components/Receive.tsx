import { useEffect, useState } from "react";

import { listen } from "@tauri-apps/api/event";
import {
  ReceivePayload,
  ReceivedPayload,
  useQueueContext,
} from "../context/context";

export const Receive = () => {
  const [isLisening, setIsListening] = useState(true);
  const { receiveQueue, addToReceiveQueue, markReceived } = useQueueContext();

  // useEffect(() => {
  listen<ReceivePayload>("onReceive", (event) => {
    console.log("hi");
    setIsListening(false);
    addToReceiveQueue(event.payload);
    console.log(event.payload);
    console.log(receiveQueue);
  });

  // listen<ReceivedPayload>("onReceived", (event) => {
  //   console.log("hello");
  //   markReceived(event.payload);
  // });
  // }, []);
  console.log(receiveQueue);

  return isLisening ? (
    <div className="h-screen pt-12 text-white bg-slate-950 flex items-center justify-center">
      ready to receive ...
      <div className="ml-2 border-2 h-6 w-6 border-white animate-spin"></div>
    </div>
  ) : (
    <div className=" h-screen pt-12 text-white justify-center items-center">
      <div>Hello</div>
      {JSON.stringify(receiveQueue)}
      {receiveQueue.map((transaction, idx) => {
        console.log(idx);
        return (
          <div key={idx} className=" items-center justify-center text-white">
            receiving {transaction.file_name} from {transaction.sender_name} ...
            {transaction.haveReceived ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <div className="ml-2 border-2 h-6 w-6 border-white animate-spin"></div>
            )}
            {transaction.haveReceived ? (
              <div>
                received {transaction.bytes_received.toString()} from{" "}
                {transaction.file_name}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
};
