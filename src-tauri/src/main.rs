
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use mdns::mdns_scanner;
use tauri::{api::dialog, Window};

static mut PORT: u16 = 0;

#[derive(Clone, serde::Serialize)]
struct ReceivePayload {
  file_name: String,
  sender_name: String,
}

#[derive(Clone, serde::Serialize,Debug)]
struct ReceivedPayload{
    bytes_received:u64,
    sender_name:String,
    file_name:String
}
#[derive(Clone, serde::Serialize,Debug)]
struct SendPayload{
    file_name:String,
    receiver_ip:String
}
#[derive(Clone, serde::Serialize,Debug)]
struct SentPayload{
    file_name:String,
    receiver_ip:String,
    bytes_sent:u64
}
#[tauri::command]
async fn send(window:Window,receiver_ip:String,receiver_port:String){
    let mut  sender = tcp::Sender::new();
    sender.set_receiver_addr(receiver_ip.as_str(), receiver_port.as_str());
    sender.select_files().await;
    sender.send(window).await.unwrap();
}
#[tauri::command]
 async  fn receive(window: Window){
    let mut receiver = tcp::Receiver::new();
    let cloned_window = window.clone();
    let handle = tokio::spawn(async move {
        unsafe{let port = format!("{}",PORT);
    receiver.listen_on(port,cloned_window).await.unwrap();}
    });
    window.once("stop_receiver", move|_event|{
        handle.abort();
        println!("Receiver stopped...");
    });
    // #[tauri::command]
    // fn stop_server<F:Fn()> (f:F){
    //     // handle.abort();
    //     f();
    //     println!("Receiver stopped");
    // }

    // stop_server(||{
    //     handle.abort();
    // });
}

async fn find_unused_port() -> u16 {
    let mut port = 8000 as i32;
    loop {
        let address = format!("0.0.0.0:{}", port);
        let stream = tokio::net::TcpListener::bind(&address).await;
        if let Ok(_) = stream {
            println!("Port {} is available", port);
            break;
        }
        println!("Port {} is not available", port);
        port += 1;
        println!("Incremented port: {:?}", port);
    }
    unsafe{PORT = port as u16;}
    port as u16
}

mod tcp;
mod mdns;
mod utils;

#[tokio::main]
async fn main() {
    let port =find_unused_port().await;
    let responder = libmdns::Responder::new().unwrap();
    let _svc = responder.register("_fileshare._tcp".into(),"_fileshare._tcp.local".into(),port,&["hello anbu"]);
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![mdns_scanner,receive,send])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
