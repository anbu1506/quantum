// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use mdns::mdns_scanner;
use tauri::Window;


#[derive(Clone, serde::Serialize)]
struct ReceivePayload {
  file_name: String,
  sender_name: String,
}

#[derive(Clone, serde::Serialize)]
struct ReceivedPayload{
    bytes_received:u64,
    sender_name:String
}

#[tauri::command]
async fn receive(window: Window){
    let mut receiver = tcp::Receiver::new("anbu");
    receiver.listen_on("8999",window).await.unwrap();
}


mod tcp;
mod mdns;
mod utils;

fn main() {
    let port =8999;
    let responder = libmdns::Responder::new().unwrap();
    let _svc = responder.register("_fileshare._tcp".into(),"_fileshare._tcp.local".into(),port,&["hello anbu"]);
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![mdns_scanner,receive])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
