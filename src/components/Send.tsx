import { useEffect } from "react";
import { SenderAtom } from "./SenderAtom";
import { listen } from "@tauri-apps/api/event";
import { SendPayload, SentPayload, useQueueContext } from "../context/context";

export const Send = () => {
  const {
    receivers,
    sendQueue,
    isSearching,
    searchReceivers,
    addToSendQueue,
    markSent,
  } = useQueueContext();

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
    <div className=" pt-12 text-white bg-slate-950">
      <button className="flex justify-center w-full">
        refresh
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
          onClick={() => {
            searchReceivers();
            // setIsloading(false);
          }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
      {isSearching ? (
        <div className="flex items-center justify-center text-white">
          <div className="h-4 w-4 border-2 border-x-blue-400 animate-spin rounded-full"></div>
        </div>
      ) : (
        <></>
      )}
      <div>
        {receivers.map((receiver, idx) => {
          return (
            <div key={idx}>
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
    </div>
  );
};
