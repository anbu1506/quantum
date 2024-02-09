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

type ReceiveQueue = ReceivePayload &
  ReceivedPayload & { haveReceived: boolean };

type MyContextType = {
  receiveQueue: ReceiveQueue[];
  addToReceiveQueue: (payload: ReceivePayload) => void;
  markReceived: (payload: ReceivedPayload) => void;
};

const queueContext = createContext<MyContextType | undefined>(undefined);

export const QueueContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [receiveQueue, setReceiveQueue] = useState<ReceiveQueue[]>([]);
  const addToReceiveQueue = (item: ReceivePayload) => {
    // const news = [
    //   ...receiveQueue,
    //   { ...item, haveReceived: false, bytes_received: 0 },
    // ];
    setReceiveQueue((prev) => {
      //   console.log(prev, item);
      return [...prev, { ...item, haveReceived: false, bytes_received: 0 }];
    });
    console.log(receiveQueue);
  };
  const markReceived = (item: ReceivedPayload) => {
    console.log(receiveQueue);
    console.log(item);
    const newQueue = receiveQueue.map((files) => {
      console.log(files);
      if (
        files.file_name == item.file_name &&
        files.sender_name == item.sender_name
      ) {
        return {
          ...files,
          bytes_received: item.bytes_received,
          haveReceived: true,
        };
      }
      return files;
    });
    console.log(newQueue);
    setReceiveQueue(newQueue);
  };

  const contextValue: MyContextType = {
    receiveQueue,
    addToReceiveQueue,
    markReceived,
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
