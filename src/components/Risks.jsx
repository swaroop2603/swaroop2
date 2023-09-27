import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FaFilePdf,FaFileCode } from 'react-icons/fa';

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

const Risks = () => {
  const location = useLocation();
  const backendData = location.state;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesArray, setPagesArray] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedItems, setExpandedItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState('');

  const toggleHiddenContent = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems((prevItems) => prevItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems((prevItems) => [...prevItems, itemId]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const totalPages = Math.ceil(totalDataCount / pageSize);
    const newPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPagesArray(newPagesArray);
  }, [totalDataCount, pageSize]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/risks', {
        params: {
          page: currentPage,
          page_size: pageSize,
          sortField: sortField,
          sortOrder: sortOrder,
        },
      });

      const re = response.data.results;
      setData(re);
      setTotalDataCount(response.data.count);
      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
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

  const buttonHoverStyle = {
    backgroundColor: '#F0FFFF',
  };

  const container_scan = {
    ...container,
    marginTop: '10px',
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
    backgroundColor: '#f2f2f2',
  };

  const evenRowStyle = {
    backgroundColor: 'white',
  };

  const getColorForItem = (item) => {
    return hoveredItem === item ? 'rgba(0, 0, 0, 0.6)' : 'black';
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  const getTitleWithArrow = (item) => {
    return (
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => toggleHiddenContent(item)}
      >
        {item}{' '}
        <FontAwesomeIcon
          icon={expandedItems.includes(item) ? faChevronUp : faChevronDown}
        />
      </span>
    );
  };

  const handleButtonClick = async (id) => {
    try {
      // Make a GET request to your server to fetch the PDF data
      const response = await axios.get(`http://127.0.0.1:8000/api/risks/pdf/${id}`, {
        responseType: 'blob', // Specify the response type as blob
      });

      // Check if the PDF file is not corrupted
      if (!response.data || response.data.size === 0) {
        throw new Error('PDF file is corrupted');
      }

      // Create a blob URL for the PDF blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new window
      window.open(pdfBlobUrl, '_blank');
    } catch (error) {
      console.error('Error fetching or opening PDF:', error);
    }
  };

return (
  <div style={{ backgroundColor: '#e0f3ff' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
      {/* Your JSX for any additional elements */}
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '60%' }}>
        <table style={{ width: '100%', paddingBottom: '40px' }}>
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
                {getTitleWithArrow('Title')}
              </th>
              <th
                style={{
                  textAlign: 'center',
                  width: '14.28%',
                  ...flowerBracketItems,
                  color: getColorForItem('ID'),
                }}
                onMouseEnter={() => handleMouseEnter('ID')}
                onMouseLeave={handleMouseLeave}
              >
                {getTitleWithArrow('ID')}
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
                {getTitleWithArrow('SCAN TYPE')}
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
                {getTitleWithArrow('TARGET')}
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
                {getTitleWithArrow('THREAT LEVEL')}
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
                {getTitleWithArrow('STATUS')}
              </th>
              <th
                style={{
                  textAlign: 'center',
                  width: '14.28%',
                  ...flowerBracketItems,
                  color: getColorForItem('PDF'),
                }}
                onMouseEnter={() => handleMouseEnter('PDF')}
                onMouseLeave={handleMouseLeave}
              >
                {getTitleWithArrow('PDF')}
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
                {getTitleWithArrow('LAST DETECTED')}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              // Check if item.title is defined
              if (!item.Title) return null; // Skip items without a title

              // Split the item.title string into an array
              const titlesArray = item.Title
                .replace('[', '') // Remove opening bracket
                .replace(']', '') // Remove closing bracket
                .split(',')
                .map((Title) => Title.trim());

              const Scantypearr = item.Scantype
                .replace('[', '') // Remove opening bracket
                .replace(']', '') // Remove closing bracket
                .split(',')
                .map((Scantype) => Scantype.trim());

            

              const Thread_Level_array = item.Thread_Level
                .replace('[', '') // Remove opening bracket
                .replace(']', '') // Remove closing bracket
                .split(',')
                .map((Thread_Level) => Thread_Level.trim());

              const STatusArray = item.STatus
                .replace('[', '') // Remove opening bracket
                .replace(']', '') // Remove closing bracket
                .split(',')
                .map((STatus) => STatus.trim());

              return (
                <React.Fragment key={item.id}>
                  <tr key={item.id} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleHiddenContent(item.id)}
                      >
                       <FontAwesomeIcon
                        icon={expandedItems.includes(item.id) ? faChevronUp : faChevronDown}
                                                />{' '}
                                                    {titlesArray[0]}
                                                    
                                                  </span>
                                                </td>
                                                <td style={{
                  textAlign: 'center'}}>{item.id_risk}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span>{Scantypearr[0]}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.target}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: getColorForValue(Thread_Level_array[0]) }}>
                        {Thread_Level_array[0]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: getColorForValue(STatusArray[0]) }}>
                        {STatusArray[0]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                    <button
  style={{
    background: 'none',
    border: 'none',
    padding: '0',
    color: 'red',
    cursor: 'pointer',
    fontSize: '24px', // Adjust the font size as needed
  }}
  onClick={() => handleButtonClick(item.id)}
>
  <FaFilePdf />
</button>


</td>
                    <td style={{ textAlign: 'center' }}>
                      {calculateTimeDifference(item.date)}
                    </td>
                  </tr>
                  {expandedItems.includes(item.id) && (
                   <tr>
                   <td>
                     <div>
                     <p >{titlesArray[1]}</p>
                     <p >{titlesArray[2]}</p>
                     <p >{titlesArray[3]}</p>
                     <p >{titlesArray[4]}</p>
                     </div>
                   </td>                 
                   <td>
                     <div>
                       <p style={{ marginLeft: "60px" }}>{Scantypearr[1]}</p>
                       <p style={{ marginLeft: "60px" }}>{Scantypearr[2]}</p>
                       <p style={{ marginLeft: "60px" }}>{Scantypearr[3]}</p>
                       <p style={{ marginLeft: "60px" }}>{Scantypearr[4]}</p>
                     </div>
                   </td>
                   <td>
                     <div>
                       <p style={{ marginLeft: "60px" }}>{item.target}</p>
                       <p style={{ marginLeft: "60px" }}>{item.target}</p>
                       <p style={{ marginLeft: "60px" }}>{item.target}</p>
                       <p style={{ marginLeft: "60px" }}>{item.target}</p>
                     </div>
                   </td>
                   <td>
                     <div>
                       <p style={{ marginLeft: "100px" }}>{Thread_Level_array[1]}</p>
                       <p style={{ marginLeft: "100px" }}>{Thread_Level_array[2]}</p>
                       <p style={{ marginLeft: "100px" }}>{Thread_Level_array[3]}</p>
                       <p style={{ marginLeft: "100px" }}>{Thread_Level_array[4]}</p>
                     </div>
                   </td>
                   <td>
                     <div>
                       <p>{STatusArray[1]}</p>
                       <p>{STatusArray[2]}</p>
                       <p>{STatusArray[3]}</p>
                       <p>{STatusArray[4]}</p>
                     </div>
                   </td>
                 </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', height: '20px' }}>
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
};

export default Risks;

