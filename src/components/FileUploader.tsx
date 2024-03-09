import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { DataRow } from "./Model";
import { v4 as uuidv4 } from "uuid";

interface FileUploaderProps 
{
  setData : (value:DataRow[]) => void, 
  setStatus : (value: string) => void,
  setIntervalId : (value: number) => void,
  userId : string
}

const FileUploader = (props: FileUploaderProps) => {

  const update_file_url = "http://localhost:5153/api/Data/startDataUpdate";
  const get_data_url = "http://localhost:5153/api/Data/getData";

  const {setData, setStatus, setIntervalId, userId} = props;
  const [file, setFile] = useState<File | null>(null);
  const [md5Hash, setMd5Hash] = useState<string>(''); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      await calculateMd5Hash(e.target.files[0]);
    }
  };

  const calculateMd5Hash = async (file : File) => {
    if (file) {
      const reader = new FileReader();
      setMd5Hash("Calculating MD5 hash...");
      reader.onload = () => {
        const fileData = reader.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(fileData));
        const hash = CryptoJS.MD5(wordArray).toString();
        setMd5Hash(hash);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (file) {
      console.log("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch(`${update_file_url}?userId=${encodeURIComponent(userId)}&hash=${encodeURIComponent(md5Hash)}`, {
          method: "POST",
          body: formData,
        });

        const data = await result.json();
        setData(data);
        setStatus("graph");

        const id = window.setInterval(FetchNewData, 10000);
        setIntervalId(id);

      } catch (error) {
        console.error(error);
      }
    }
  };

  const FetchNewData = async () => {

    try {
      const result = await fetch(`${get_data_url}?userId=${encodeURIComponent(userId)}`, {
        method: "GET",
      });
      const data = await result.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="file_uploader">
       <input className={"file_input add_margin_top" } type="file" onChange={handleFileChange} />

        {file && <FileDetails file = {file} hash = {md5Hash}/>}

        {file && <button onClick={handleUpload}>Upload a file</button>}

    </div>
  );
}

export default FileUploader;

const FileDetails = (props: {file: File, hash:string}) => {
  const {file, hash} = props;
  return (
          <section className="file_details">
            <h3 className="file-h3">File details:</h3>
            <ul>
              <li>Name: {file.name}</li>
              <li>Type: {file.type}</li>
              <li>Size: {file.size} bytes</li>
              <li>Hash: {hash}</li>
            </ul>
          </section>
  )
}
