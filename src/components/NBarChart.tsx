import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DataRow, ColorSet, GetColorCode } from './Model';
import { v4 as uuidv4 } from "uuid";

interface NBarChartProps 
{
  dataRows : DataRow[], 
  setStatus : (value : string)=>void,
  status : string,
  setUserId : (value : string) => void,
  userId : string,
  intervalId : number | null
}

function NBarChart(props : NBarChartProps) {
const {dataRows, setStatus, status, setUserId, userId, intervalId} = props;
const remove_user = "http://localhost:5153/api/Data/deleteUser";
ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

 const options = {
  responsive: true,
  plugins: {
    legend: {
        display: false
            },
    tooltips: {
        callbacks: {
          label: function(tooltipItem: { yLabel: any; }) {
              return tooltipItem.yLabel;
       }
    }
},
    title: {
      display: true,
      text: 'Snow data set',
    },
  },
};

const labels = dataRows.map(d=> d.name); 

const data = {
  labels,
  datasets: [
    {
  
      data: dataRows.map(d=> d.value),
      backgroundColor : dataRows.map(d=> d.color.toLowerCase()),
    }
  ],
};

const handleStop = () => {
  clearInterval(intervalId!);
  setStatus("stop");
}

const removeUser = async () => {

  try {
    const result = await fetch(`${remove_user}?userId=${userId}`, {
      method: "DELETE",
    });
    const statusCode = await result.status;
    console.log("remove user result ",statusCode);
    setUserId(uuidv4());

  } catch (error) {
    console.error(error);
  }
}

const handleReset = async () => {

  await removeUser();
  setStatus("load");
}


  return (
    <div className='Bar-Chart'> 
        <Bar options={options} data={data} />
        {status === "graph" && <button className='Btn Btn-stop' onClick = {handleStop}>stop</button>}
        {status === "stop" && <button className='Btn Btn-reset' onClick = {handleReset}>reset</button>}
    </div>
  )
}

export default NBarChart;