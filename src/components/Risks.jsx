import React from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
function getColorForValue(value) {
  const lvalue = value.toLowerCase();
  switch (lvalue) {
    case 'medium':
      return '#FF00FF';
    case 'low':
      return '#8ebb2c';
    case 'high':
      return 'red';
    case 'accepted':
      return 'green';
    case 'closed':
      return '#6F00FF';
    case 'open':
      return '#00308F';
    default:
      return 'initial';
  }
}

function calculateTimeDifference(createdTime) {
  const currentTime = new Date();
  const createdDate = new Date(createdTime);
  const timeDifference = currentTime - createdDate;

  // Convert the time difference to a human-readable format
  const minutes = Math.floor(timeDifference / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

function Risks() {
  const location = useLocation();
  const backendData = location.state;
  // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // Initial data state
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesArray, setPagesArray] = useState([]);
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  useEffect(() => {
    fetchData(); // Fetch data initially
  }, [currentPage]); // Update data when currentPage or pageSize changes
  useEffect(() => {
    const totalPages = Math.ceil(totalDataCount / pageSize);
    const newPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPagesArray(newPagesArray);
  }, [totalDataCount, pageSize]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/risks`, {
        params: {
          page: currentPage, // Use currentPage to specify the current page
          page_size: pageSize, // Use pageSize to specify the number of items per page
        },
      });
  
      const re = response.data.results;
      console.log(re);
  
      setData(re);
      setTotalDataCount(response.data.count);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  };

  const [widgetVisible, setWidgetVisible] = React.useState(false);

  const toggleWidget = () => {
    setWidgetVisible(!widgetVisible);
  };

  const closeWidget = () => {
    setWidgetVisible(false);
  };

  const container = {
    borderRadius: '7px',
    boxShadow: '0 2px 5px #ccc',
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'rgba(7, 89, 133, 0.8)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
    outline: '2px solid rgba(7, 89, 133, 0.25)',
    marginRight: '30px',
  };

  const buttonStyle1 = {
    backgroundColor: 'white',
    color: 'rgba(7, 89, 133, 0.8)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
    outline: '2px solid rgba(7, 89, 133, 0.25)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#F0FFFF',
  };

  const buttonHoverStyle1 = {
    backgroundColor: '#F0FFFF',
  };

  const container_scan = {
    ...container,
    marginTop: '10px', // Adjust the margin as needed
    padding: '10px',
  };

  const container2 = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontFamily: '"Calibri", sans-serif',
  };

  const boldText = {
    fontWeight: 'bold',
    fontSize: '35px',
  };

  const infoRow = {
    display: 'flex',
    gap: '150px',
    paddingTop: '20px',
  };

  const flowerBracketItems = {
    paddingTop: '50px',
    cursor: 'pointer',
  };

  const oddRowStyle = {
    backgroundColor: '#f2f2f2', // Set your desired background color for odd rows
  };

  const evenRowStyle = {
    backgroundColor: 'white', // Set your desired background color for even rows
  };

  const [hoveredItem, setHoveredItem] = React.useState('');

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };
  const loadPage = (page) => {
    setCurrentPage(page);
  };
  const getColorForItem = (item) => {
    return hoveredItem === item ? 'rgba(0, 0, 0, 0.6)' : 'black';
  };

  return (
    <div style={{backgroundColor:"#e0f3ff"}}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
        <button
          onClick={toggleWidget}
          style={{
            ...buttonStyle,
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
              e.target.style.color = buttonHoverStyle.color;
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = buttonStyle.backgroundColor;
              e.target.style.color = buttonStyle.color;
            },
          }}
        >
          Add Targets
        </button>
        <button
          style={{
            ...buttonStyle1,
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = buttonHoverStyle1.backgroundColor;
              e.target.style.color = buttonHoverStyle1.color;
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = buttonStyle1.backgroundColor;
              e.target.style.color = buttonStyle1.color;
            },
          }}
        >
          New Scan
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
  <div style={{ width: '60%' }}>
      <table style={{ width: '100%' ,paddingBottom:'40px'}}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('TITLE'),
              }}
              onMouseEnter={() => handleMouseEnter('TITLE')}
              onMouseLeave={handleMouseLeave}
            >
              Title
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('SCAN TYPE'),
              }}
              onMouseEnter={() => handleMouseEnter('SCAN TYPE')}
              onMouseLeave={handleMouseLeave}
            >
              SCAN TYPE
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('TARGET'),
              }}
              onMouseEnter={() => handleMouseEnter('TARGET')}
              onMouseLeave={handleMouseLeave}
            >
              TARGET
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('THREAT LEVEL'),
              }}
              onMouseEnter={() => handleMouseEnter('THREAT LEVEL')}
              onMouseLeave={handleMouseLeave}
            >
              THREAT LEVEL
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('OPENVAS QOD'),
              }}
              onMouseEnter={() => handleMouseEnter('OPENVAS QOD')}
              onMouseLeave={handleMouseLeave}
            >
              OPENVAS QOD
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('STATUS'),
              }}
              onMouseEnter={() => handleMouseEnter('STATUS')}
              onMouseLeave={handleMouseLeave}
            >
              STATUS
            </th>
            <th
              style={{
                textAlign: 'center',
                width: '14.28%',
                ...flowerBracketItems,
                color: getColorForItem('LAST DETECTED'),
              }}
              onMouseEnter={() => handleMouseEnter('LAST DETECTED')}
              onMouseLeave={handleMouseLeave}
            >
              LAST DETECTED
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
              <td style={{ textAlign: 'center'}}>{item.Title}</td>
              <td style={{ textAlign: 'center'}}>
                <span >
                  {item.Scantype}
                </span>
              </td >
              <td style={{ textAlign: 'center'}}>{item.target}</td>
              <td style={{ textAlign: 'center'}}>
                <span style={{ color: getColorForValue(item.Thread_Level) }}>
                  {item.Thread_Level}
                </span>
              </td>
              <td style={{ textAlign: 'center'}}>{item.openvas_QOD * 100}</td>
              <td style={{ textAlign: 'center'}}>
                <span style={{ color: getColorForValue(item.STatus) }}>
                  {item.STatus}
                </span>
              </td >
              <td style={{ textAlign: 'center'}}>{calculateTimeDifference(item.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', height: '20px' }}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#00bfff',
                marginRight: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '5px 10px',
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {pagesArray.map((page) => (
              <button
              style={{
                backgroundColor: currentPage === page ? '#007bff' : 'white',
                color: currentPage === page ? 'white' : 'black',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '50%',
                
              }}
              key={page}
              className={`pagination-button ${currentPage === page ? 'activePageButton' : ''}`}
              onClick={() => handlePageChange(page)}
            >
            
                {page}
              </button>
            ))}

            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#00bfff',
                marginLeft: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '5px 10px',
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagesArray.length}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
    </div>
  );
}

export default Risks;