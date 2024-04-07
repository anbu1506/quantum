import { invoke } from "@tauri-apps/api";
import { SendQueue } from "../context/context";
import { useEffect, useState } from "react";

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
  const [text, setText] = useState<string>("");
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
    <div className=" flex flex-col  h-full pb-5 bg-buttonColor rounded-2xl">
      <div className="grid grid-cols-5 text-white h-[80px] m-4">
        <div className="col-span-1 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-10 h-10"
          >
            <path
              fill="#74C0FC"
              d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
            />
          </svg>
        </div>
        <div className="col-span-4">
          <div className="grid grid-rows-2 h-full">
            <div className="font-extrabold flex items-center">
              <h1>{userName}</h1>
            </div>
            <h1 className="font-semibold text-gray-500">
              ip : {ip} port : {port}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div>
          {myQueue.map((transaction, idx) => {
            return (
              <>
                <div key={idx} className="text-gray-500">
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
      </div>
      <div className="mx-8 grid grid-cols-7">
        <textarea
        placeholder="Type your message here..."
          className="col-span-5 text-white rounded-3xl bg-appColor resize-none px-4 py-1"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        ></textarea>
        <div
          className="col-span-1 flex items-center justify-center"
          onClick={() => {
            if (text) {
              sendTxt(text);
              setText("");
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-6 w-6"
          >
            <path
              fill="#ffffff"
              d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
            />
          </svg>
        </div>
        <div
          className="col-span-1 flex items-center justify-center"
          onClick={() => {
            console.log("send");
            invoke("send", { receiverIp: ip, receiverPort: port }).catch(() => {
              console.log;
            });
          }}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="#ffffff"
              d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
