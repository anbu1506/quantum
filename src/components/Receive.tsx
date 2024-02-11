import { useEffect, useState } from "react";

import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import {
  ReceivePayload,
  ReceivedPayload,
  useQueueContext,
} from "../context/context";
import { invoke } from "@tauri-apps/api";

export const Receive = () => {
  const { receiveQueue, addToReceiveQueue, markReceived } = useQueueContext();

  const [isLisening, setIsListening] = useState(receiveQueue.length === 0);

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
      setIsListening(false);
      addToReceiveQueue(event.payload);
    });

    // const unlisten2 = listen<ReceivedPayload>("onReceived", (event) => {
    //   console.log("hello");
    //   console.log(event.payload);

    //   setTimeout(() => {
    //     markReceived(event.payload);
    //   }, 3000);
    // });

    return () => {
      unlisten1.then((e) => console.log("unlisten1", e));
      // unlisten2.then((e) => console.log("unlisten1", e));
    };
  }, []);

  useEffect(() => {
    console.log("receivequeue changed");
    console.log(receiveQueue);
  }, [receiveQueue]);

  return (
    <>
      <div className="h-screen bg-slate-950 pt-12 items-center">
        {isLisening ? (
          <div className=" text-white  flex items-center justify-center">
            ready to receive ...
            <div className="ml-2 border-2 h-6 w-6 border-white animate-spin"></div>
          </div>
        ) : (
          <div className=" text-white justify-center items-center">
            {receiveQueue.map((transaction, idx) => {
              return (
                <div key={idx} className="text-white">
                  <div className=" flex p-4">
                    receiving {transaction.file_name} from{" "}
                    {transaction.sender_name} ...
                    {transaction.have_received ? (
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
                      <div className="mr-4 border-2 h-6 w-6 border-white animate-spin"></div>
                    )}
                  </div>
                  {transaction.have_received ? (
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
        )}
      </div>
    </>
  );
};
