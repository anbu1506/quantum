import { listen } from "@tauri-apps/api/event";

export const SelectFiles = ({
  userName,
  ip,
  port,
}: {
  userName: String;
  ip: String;
  port: String;
}) => {
  console.log(userName, ip, port);
  listen("tauri://file-drop", (event) => {
    console.log(event.payload);
  });
  return (
    <div className=" mx-4  flex items-center justify-center border border-dashed border-black">
      <div
        className="h-20 bg-slate-400"
        onDragOver={(e) => {
          e.preventDefault();
          console.log("dragging");
        }}
        onDrop={function dropHandler(ev) {
          console.log("File(s) dropped");

          // Prevent default behavior (Prevent file from being opened)
          ev.preventDefault();

          if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...ev.dataTransfer.items].forEach((item, i) => {
              // If dropped items aren't files, reject them
              if (item.kind === "file") {
                const file = item.getAsFile();
                console.log(`… file[${i}].name = ${file?.name}`);
              }
            });
          } else {
            // Use DataTransfer interface to access the file(s)
            [...ev.dataTransfer.files].forEach((file, i) => {
              console.log(`… file[${i}].name = ${file.name}`);
            });
          }
        }}
      >
        Drag and drop files here
      </div>
    </div>
  );
};
