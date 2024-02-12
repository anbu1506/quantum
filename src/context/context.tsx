import { invoke } from "@tauri-apps/api";
import React, { createContext, useContext, useState } from "react";

export type ReceivePayload = {
  file_name: string;
  sender_name: string;
};

export type ReceivedPayload = {
  file_name: String;
  bytes_received: Number;
  sender_name: String;
};

type ReceiveQueue = ReceivePayload & {
  have_received: boolean;
  bytes_received: Number;
};

type Receivers = [String, String, String];

type SendPayload = {
  file_name: String;
  receiver_ip: String;
};
type SentPayload = {
  bytes_sent: Number;
  receiver_ip: String;
  file_name: String;
};

type SendQueue = SendPayload &
  SentPayload & {
    have_sent: boolean;
  };
type MyContextType = {
  receiveQueue: ReceiveQueue[];
  sendQueue: SendQueue[];
  receivers: Receivers[];
  addToReceiveQueue: (payload: ReceivePayload) => void;
  markReceived: (payload: ReceivedPayload) => void;
  searchReceivers: () => Promise<void>;
  // getSendQueue: (receiver_ip: String) => ReceiveQueue[];
  addToSendQueue: (payload: SendPayload) => void;
  markSent: (payload: SentPayload) => void;
};

const queueContext = createContext<MyContextType | undefined>(undefined);

export const QueueContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [receiveQueue, setReceiveQueue] = useState<ReceiveQueue[]>([]);
  const [sendQueue, setSendQueue] = useState<SendQueue[]>([]);
  const [receivers, setReceivers] = useState<Receivers[]>([]);
  const addToReceiveQueue = (item: ReceivePayload) => {
    setReceiveQueue((prev) => {
      return [...prev, { ...item, have_received: false, bytes_received: 0 }];
    });
  };
  const markReceived = (item: ReceivedPayload) => {
    setReceiveQueue((prev) => {
      const newQueue = prev.map((files) => {
        console.log(files);
        if (
          files.file_name == item.file_name &&
          files.sender_name == item.sender_name
        ) {
          return {
            ...files,
            bytes_received: item.bytes_received,
            have_received: true,
          };
        }
        return files;
      });

      return newQueue;
    });
  };

  const searchReceivers = () => {
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
    invoke("mdns_scanner")
      .then((res) => {
        setReceivers((prev) => {
          let hosts: Receivers[] = prev;
          for (let i = 0; i < (res as Receivers[]).length; i++) {
            if (!rowExists(hosts, (res as Receivers[])[i])) {
              hosts.push((res as Receivers[])[i]);
            }
          }
          return hosts;
        });
      })
      .catch((err) => {
        console.log(err);
      });
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };
  const addToSendQueue = (payload: SendPayload) => {
    setSendQueue((prev) => {
      return [...prev, { ...payload, bytes_sent: 0, have_sent: false }];
    });
  };
  const markSent = (payload: SentPayload) => {
    setSendQueue((prev) => {
      const newQueue = prev.map((files) => {
        if (
          files.receiver_ip === payload.receiver_ip &&
          files.file_name === payload.file_name
        ) {
          return {
            ...files,
            bytes_sent: payload.bytes_sent,
            have_sent: true,
          };
        } else return files;
      });
      return newQueue;
    });
  };

  // const getSendQueue(receiver_ip:String) =>{
  //   setSendQueue((prev)=>{
  //     prev.filter((files)=>{

  //     })
  //     return prev
  //   })
  // }
  const contextValue: MyContextType = {
    receiveQueue,
    sendQueue,
    receivers,
    addToReceiveQueue,
    markReceived,
    searchReceivers,
    addToSendQueue,
    markSent,
  };
  return (
    <queueContext.Provider value={contextValue}>
      {children}
    </queueContext.Provider>
  );
};

export const useQueueContext = () => {
  const context = useContext(queueContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
