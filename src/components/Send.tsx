import { useEffect, useState } from "react";
import { SenderAtom } from "./SenderAtom";
import { listen } from "@tauri-apps/api/event";
import { SendPayload, SentPayload, useQueueContext } from "../context/context";
import { Nav } from "./Nav";
import clsx from "clsx";
import { Model } from "./Model";

export const Send = () => {
  const {
    receivers,
    sendQueue,
    isSearching,
    searchReceivers,
    addToSendQueue,
    markSent,
  } = useQueueContext();

  const [showModal,setShowModal] = useState<boolean>(false);

  useEffect(() => {
    let unlisten1 = listen<SendPayload>("onSend", (event) => {
      console.log(event.payload);
      console.log("onSend");
      addToSendQueue(event.payload);
    });

    let unlisten2 = listen<SentPayload>("onSent", (event) => {
      console.log(event.payload);
      console.log("onSent");
      markSent(event.payload);
    });

    return () => {
      unlisten1.then((f) => f());
      unlisten2.then((f) => f());
    };
  }, []);
  useEffect(() => {
    console.log("useEffect");
    console.log(sendQueue);
  }, [sendQueue]);
  return (
    <div className="bg-appColor">
      <Nav></Nav>
      <div className=" pt-12 text-white pb-12">
        <div className="grid grid-cols-2">
          <div className="col-span-1 font-semibold">
            <button
              className="flex justify-center w-full"
              onClick={() => {
                searchReceivers();
              }}
            >
              refresh
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className={clsx("w-6 h-6", { "animate-spin": isSearching })}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          <button className="col-span-1 flex font-semibold" onClick={()=>{
            setShowModal(!showModal);
          }}>
            <svg
              className="w-6 h-6 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path
                fill="#edeff2"
                d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
              />
            </svg>
            Connect Manually
          </button>
        </div>
        {receivers.map((receiver, idx) => {
          return (
            <div key={idx} className="p-4">
              <SenderAtom
                ip={receiver[0]}
                port={receiver[1]}
                userName={receiver[2]}
                sendQueue={sendQueue}
              ></SenderAtom>
            </div>
          );
        })}
      </div>
      <Model showModal={showModal} setShowModal={setShowModal}></Model>
    </div>
  );
};
