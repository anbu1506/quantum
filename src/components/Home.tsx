import { invoke } from "@tauri-apps/api";
import { Link } from "react-router-dom";

export const Home = () => {
  invoke("receive").catch((err) => {
    console.log(err);
  });
  return (
    <div className="h-screen bg-slate-950 grid grid-rows-2 text-white">
      <div className="flex items-center justify-center">
        <Link
          to={"/send"}
          className=" bg-blue-900 px-8 py-3 rounded-md shadow-xl shadow-blue-800 font-semibold text-lg "
        >
          Send
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <Link
          // onClick={() => {}}
          to="/receive"
          className=" bg-green-500 px-6 py-3 rounded-md shadow-xl shadow-green-800 font-semibold text-lg "
        >
          Receive
        </Link>
      </div>
    </div>
  );
};
