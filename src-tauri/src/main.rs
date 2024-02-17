#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use local_ip_address::linux::local_ip;
use mdns::mdns_scanner;
use tauri::Window;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

static mut PORT: u16 = 0;

#[derive(Clone, serde::Serialize)]
struct ReceivePayload {
    file_name: String,
    sender_name: String,
}

#[derive(Clone, serde::Serialize)]
struct AcceptPayload {
    event: String,
    file_name: String,
    sender_name: String,
}
#[derive(Clone, serde::Serialize, Debug)]
struct ReceivedPayload {
    bytes_received: u64,
    sender_name: String,
    file_name: String,
}
#[derive(Clone, serde::Serialize, Debug)]
struct SendPayload {
    file_name: String,
    receiver_ip: String,
}
#[derive(Clone, serde::Serialize, Debug)]
struct SentPayload {
    file_name: String,
    receiver_ip: String,
    bytes_sent: u64,
}
#[tauri::command]
async fn handle_manual_connect(ip: String, port: String) -> i32 {
    match tokio::net::TcpStream::connect(format!("{}:{}", ip, port)).await {
        Ok(mut stream) => {
            stream.write_i32(-1).await.unwrap();
            200
        }
        Err(_e) => 404,
    }
}

#[tauri::command]
async fn send(window: Window, receiver_ip: String, receiver_port: String) {
    let mut sender = tcp::Sender::new();
    sender.set_receiver_addr(receiver_ip.as_str(), receiver_port.as_str());
    sender.select_files().await;
    sender.send(window).await.unwrap();
}
#[tauri::command]
async fn receive(window: Window) {
    let mut receiver = tcp::Receiver::new();
    let cloned_window = window.clone();
    let handle = tokio::spawn(async move {
        unsafe {
            let port = format!("{}", PORT);
            receiver.listen_on(port, cloned_window).await.unwrap();
        }
    });
    window.once("stop_receiver", move |_event| {
        handle.abort();
        println!("Receiver stopped...");
    });
}

#[tauri::command]
async fn get_addr() -> (String, String) {
    let port = unsafe { PORT };
    let ip = local_ip().unwrap();
    (ip.to_string(), port.to_string())
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
    unsafe {
        PORT = port as u16;
    }
    port as u16
}

#[tauri::command]
async fn send_txt(receiver_ip: String, receiver_port: String, text: String) -> String {
    let mut sender = tokio::net::TcpStream::connect(format!("{}:{}", receiver_ip, receiver_port))
        .await
        .unwrap();
    let buf = text.as_bytes();
    println!("sending text to receiver");
    sender.write_i32(2).await.unwrap(); //indicating that a 'text' is coming
    let allowed = sender.read_i32().await.unwrap();
    if allowed == 0 {
        return "not allowed".to_string();
    }
    sender.write_all(buf).await.unwrap();
    "sent".to_string()
}

mod mdns;
mod tcp;
mod utils;

#[tokio::main]
async fn main() {
    let port = find_unused_port().await;
    let responder = libmdns::Responder::new().unwrap();
    let _svc = responder.register(
        "_fileshare._tcp".into(),
        "_fileshare._tcp.local".into(),
        port,
        &["hello anbu"],
    );

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            mdns_scanner,
            receive,
            send,
            handle_manual_connect,
            get_addr,
            send_txt
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
