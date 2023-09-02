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
        <img
          src="data:image/jpeg;base64,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" alt="Hostedscan" />"
        
      </div>

      <h1 className="side-content">HostedScan</h1>

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
