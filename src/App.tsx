import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import NBarChart from './components/NBarChart';
import Header from './components/Header';
import { DataRow, ColorSet } from './components/Model';
import { v4 as uuidv4 } from "uuid";

function App() {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>(uuidv4());
  const [status, setStatus] = useState<string>("load"); 
  // values: load | graph | stop | reset 

  return (
    <div className="App">
      <Header />
      <div className='main-stage'>
        {status === "load" && (
          <FileUploader 
            setData={setData} 
            setStatus={setStatus} 
            setIntervalId={setIntervalId}
            userId={userId}
          />
        )}
        {(status === "graph" || status === "stop") && data && (
          <NBarChart 
            dataRows={data} 
            userId={userId}
            setUserId={setUserId}
            intervalId={intervalId}
            status={status}
            setStatus={setStatus}
          />
        )}
      </div>
    </div>
  );
}

export default App;

