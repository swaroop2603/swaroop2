import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState} from 'react';
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(`${name}=`)) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
function Headers() {
  const navigate = useNavigate();
  const [backendData, setBackendData] = useState(null);
  const [backendDataS, setBackendDataS] = useState(null);
  const [backendDataR, setBackendDataR] = useState(null);

  const targetget = async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/target',
        headers: {
          'X-CSRFToken': csrftoken,
        },
      });
      setBackendData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const scanget = async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/scan',
        headers: {
          'X-CSRFToken': csrftoken,
        },
      });
      setBackendDataS(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const riskget = async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/risks',
        headers: {
          'X-CSRFToken': csrftoken,
        },
      });
      setBackendDataR(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTargetClick = async () => {
    await targetget(); // Fetch data
    navigate('/target', { state: backendData });// Navigate to the target page
  };
  const handleScanClick = async () => {
    await scanget(); // Fetch data
    navigate('/scan', { state: backendDataS });// Navigate to the target page
  };
  const handleRiskClick = async () => {
    await riskget(); // Fetch data
    navigate('/risk', { state: backendDataR });// Navigate to the target page
  };
  return (
   
    <header className="container">
      
      <div className="side">
      <a href="/dashboard">
      <img
  src="https://img1.wsimg.com/isteam/ip/f5246092-6632-43f4-aff3-382105966beb/s3infosoft_logo.png/:/rs=w:469,h:75,cg:true,m/cr=w:469,h:75/qt=q:100/ll"
  alt="S3 infotech"
  
/>
</a>



        
      </div>

     

      <div className="buttons">
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={handleTargetClick}>Targets</button>
        <button onClick={handleScanClick}>Scans</button>
        <button onClick={handleRiskClick}>Risks</button>
      </div>
    </header>
  );
}

export default Headers;