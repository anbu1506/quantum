use std::sync::mpsc;

use tauri::{api::dialog, Window};
use tokio::{io::{ copy, AsyncReadExt, AsyncWriteExt}, net::{TcpListener, TcpStream}};

use crate::{ utils::{create_or_incnum, padding, remove_padding }, ReceivePayload, ReceivedPayload};



pub struct Sender<'a>{
    name:String,
    my_streams_addr:Vec<String>,
    receiver_ip:&'a str,
    receiver_port:&'a str,
    files:Vec<String>
}

impl<'a> Sender<'a>{
    pub fn new()->Sender<'a>{
        let  name = hostname::get().unwrap();
        let name = name.to_str().unwrap().to_string();
        Sender{
            name,
            my_streams_addr:vec![],
            files:vec![],
            receiver_ip:"",
            receiver_port:""
        }
    }

    fn add_file(&mut self,file_name:String){
        self.files.push(file_name.to_owned());
    }

    pub async fn  select_files(&mut self) {
        let future = async {
            let (tx,rx) = mpsc::channel::<String>();
            dialog::FileDialogBuilder::new()
                .pick_files(move|pathBufs|{
                    for pathBuf in pathBufs.unwrap_or_else(||vec![]){
                        let path = pathBuf.to_str().unwrap().to_owned();
                        tx.send(path).unwrap();
                    }
                });

                rx.iter().for_each(|path|{
                    self.add_file(path);
                });
            
        };
        future.await;
    }

    pub fn set_receiver_addr(&mut self,receiver_ip:&'a str,receiver_port:&'a str){
        self.receiver_ip=receiver_ip;
        self.receiver_port=receiver_port;
    }

    async fn connect_nth_stream(&mut self,n:i32)->Result<TcpStream, Box<dyn std::error::Error>>{
        println!("stream {} connecting to receiver...",n);
        let  stream = tokio::net::TcpStream::connect(self.receiver_ip.to_owned()+":"+&self.receiver_port).await?;
        self.my_streams_addr.push(stream.peer_addr()?.to_string());
        println!("stream {} connected to receiver",n);
       Ok(stream)
    }

    async fn handle_transfer(file_path:&str,stream:&mut tokio::net::TcpStream,sender_name:&str)->Result<(), Box<dyn std::error::Error>>{
        let file_name = std::path::Path::new(file_path).file_name().unwrap().to_str().unwrap();
        let file_name = padding(file_name.to_string());
        //chech the file exists or not
        let  file = tokio::fs::File::open(file_path).await?;
        //then sending file_name
        stream.write_all(file_name.as_bytes()).await?;
        //sending sender_name
        stream.write_all(padding(sender_name.to_string()).as_bytes()).await?;
        //then sending data
        let mut file_reader = tokio::io::BufReader::new(file);
        let bytes_transferred = copy(&mut file_reader,  stream).await?;
        println!("Transferred {} bytes.", bytes_transferred);
        Ok(())
    }

    pub async fn send(&mut self)->Result<(),Box<dyn std::error::Error>>{
        let mut handles = vec![];
        let mut i=1;
        while self.files.len()!=0{
            let mut stream = self.connect_nth_stream(i as i32).await?;
            let file_path = self.files.pop().unwrap().to_string();
            let sender_name = self.name.to_string();
            let handle =tokio::spawn(async move{
                Self::handle_transfer(file_path.as_str(),&mut stream,sender_name.as_str()).await.unwrap();
            });
            handles.push(handle);
            i+=1;
        }

        for handle in handles{
            handle.await?;
        }
        Ok(())
    }

}







pub struct Receiver<'a>{
    name:String,
    my_ip:&'a str,
    my_port:String,
}


impl<'a> Receiver<'a>{

    pub fn new()->Receiver<'a>{
        let  name = hostname::get().unwrap();
        let name = name.to_str().unwrap().to_string();
        Receiver{
            name,
            my_ip:"0.0.0.0",
            my_port:"8080".to_owned()
        }
    }

    pub async fn listen_on(&mut self,port:String,window: Window)->Result<(),Box<dyn std::error::Error>>{
        self.my_port=port;
        let listener = TcpListener::bind(self.my_ip.to_owned()+":"+self.my_port.as_str()).await?;
        println!("Listening on port {}",self.my_port);
        let mut handles = vec![];
        let mut i=0;
        loop{
            let windows = window.clone();
            let (mut stream, _) = listener.accept().await?;
            println!("connection accepted from sender {}",stream.peer_addr()?);
            let handle =tokio::spawn(async move{
                Self::receive(&mut stream,windows).await.unwrap()
            });
            handles.push(handle);
            i+=1;
        }
        // println!("waiting for all handles to join");
        // for handle in handles{
        //     let file_name = handle.await?;
        //     self.files.push(file_name);
        // }
        // Ok(())
    }
    
    async fn receive(stream:& mut TcpStream,window: Window)->Result<String, Box<dyn std::error::Error>>{
        
        let mut file_name = [0u8; 255];
        stream.read_exact(&mut file_name).await?;
        let file_name = remove_padding(String::from_utf8(file_name.to_vec())?);

        let mut sender_name = [0u8;255];
        stream.read_exact(&mut sender_name).await?;
        let sender_name = remove_padding(String::from_utf8(sender_name.to_vec())?);

        window.emit("onReceive", ReceivePayload {file_name:file_name.to_string(),sender_name:sender_name.to_string() }).unwrap();
        println!("receiving {} from {}",file_name,sender_name);

        let download_path = home::home_dir().unwrap().join("Downloads").join(file_name.as_str());
        let mut dest_file = create_or_incnum(download_path).await?;
        let bytes_transferred = copy( stream, &mut dest_file).await?;
        println!("Received {} bytes from {} .", bytes_transferred,sender_name);
        let received_payload = ReceivedPayload{file_name:file_name.clone(),bytes_received:bytes_transferred,sender_name:sender_name.to_string()};
        println!("received payload {:?}",received_payload);
        window.emit("onReceived",received_payload).unwrap();
        Ok(file_name)
    }
}