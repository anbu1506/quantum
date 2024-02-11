import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { SelectFiles } from "./SelectFiles";
import { SenderAtom } from "./SenderAtom";
type Receivers = String[];
export const Send = () => {
  const [receivers, setReceivers] = useState<Receivers[]>([]);
  const [isloading, setIsloading] = useState(false);
  function rowExists(array: Receivers[], row: String[]) {
    for (let existingRow of array) {
      if (
        existingRow[0] === row[0] &&
        existingRow[1] === row[1] &&
        existingRow[2] === row[2]
      ) {
        return true; // Row already exists
      }
    }
    return false; // Row does not exist
  }
  const search = () => {
    setIsloading(true);
    console.log("useEffect");
    invoke("mdns_scanner")
      .then((res) => {
        let hosts: Receivers[] = [];
        for (let i = 0; i < (res as Receivers[]).length; i++) {
          if (!rowExists(hosts, (res as Receivers[])[i])) {
            hosts.push((res as Receivers[])[i]);
          }
        }

        console.log(res);
        console.log(hosts);
        setReceivers(hosts);
        setIsloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const send = (userName: String, ip: String, port: String) => {};
  return (
    <div className="h-screen pt-12 text-white">
      <button className="flex justify-center w-full">
        refresh
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
          onClick={() => search()}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
      {isloading ? (
        <div className="flex items-center justify-center text-white">
          <div className="h-4 w-4 border-2 border-x-blue-400 animate-spin rounded-full"></div>
        </div>
      ) : (
        <>
          {receivers.map((receiver, idx) => {
            return (
              <div key={idx}>
                {SenderAtom({
                  ip: receiver[0],
                  port: receiver[1],
                  userName: receiver[2],
                })}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
