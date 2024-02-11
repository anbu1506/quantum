import { invoke } from "@tauri-apps/api";

export const SenderAtom = ({
  userName,
  port,
  ip,
}: {
  userName: String;
  port: String;
  ip: String;
}) => {
  return (
    <div className=" bg-white mx-5 my-4 rounded-sm text-black">
      <div className="grid grid-rows-2 h-full">
        <div className="grid grid-cols-3 items-center text-center">
          <div className="text-black">{userName}</div>
          <div className="text-black">{ip}</div>
          <div className="text-black">{port}</div>
        </div>
        <div className="bg-white"></div>
        <div className="text-white flex justify-center items-center h-7 my-2">
          <button
            className=" bg-indigo-900 w-full mx-3 rounded-full"
            onClick={() => {
              console.log("send");
              invoke("send", { receiverIp: ip, receiverPort: port }).catch(
                (err) => {
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
