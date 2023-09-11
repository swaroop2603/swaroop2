import React from 'react';
import Newscan from './newscan'; // Make sure the filename matches the actual filename
import axios from 'axios';
import { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Propscan from './prop_scan';
import { FaFilePdf } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh ,faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { Document, Page } from 'react-pdf';
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
function Scans() {
    const location = useLocation();
    const backendData = location.state;
    const [widgetVisible, setWidgetVisible] = React.useState(false);
    const [showPopup, setShowPopup] = useState(false);
     // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // Initial data state
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [showPdf, setShowPdf] = React.useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = React.useState('');  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesArray, setPagesArray] = useState([]);
       
    useEffect(() => {
        fetchData(); // Fetch data initially
      }, [currentPage]); // Update data when currentPage or pageSize changes
      useEffect(() => {
        const totalPages = Math.ceil(totalDataCount / pageSize);
        const newPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPagesArray(newPagesArray);
      }, [totalDataCount, pageSize]);
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/scan`, {
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
    const toggleWidget =()=> {
        
        setWidgetVisible(!widgetVisible);
        
    };

    const closeWidget = () => {
        setWidgetVisible(false);
    };
    const buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '10px',
        cursor: 'pointer',
        transition: 'background 0.3s, color 0.3s',
        outline: '2px solid rgba(7, 89, 133, 0.25)',
    };

    const buttonHoverStyle = {
        
        backgroundColor: '#32cd32',
        color: ' #000000 ',
        
    };
    const flowerBracketItems = {
        paddingTop: '50px',
        
        cursor: 'pointer',
    };
    const successPopup= {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'green',
        color: 'white',
        padding: '10px',
        
        marginLeft:'1350px'
      }
    const [hoveredItem, setHoveredItem] = React.useState('');
    const loadMore = () => {
        if (data.length >= pageSize) {
          setCurrentPage(currentPage + 1);
        }
      };
      
      const loadPage = (page) => {
        setCurrentPage(page);
      };
    const handleMouseEnter = (item) => {
        setHoveredItem(item);
    };

    const handleMouseLeave = () => {
        setHoveredItem('');
    };

    const getColorForItem = (item) => {
        return hoveredItem === item ? 'rgba(0, 0, 0, 0.6)' : 'black';
    };
    const oddRowStyle = {
        backgroundColor: '#f2f2f2', // Set your desired background color for odd rows
      };
    
      const evenRowStyle = {
        backgroundColor: 'white', // Set your desired background color for even rows
      };
    const handleButtonClick = async (id) => {
        try {
          // Make a GET request to your server to fetch the PDF data
          const response = await axios.get(`http://127.0.0.1:8000/api/scan/${id}`, {});
      
          const pdf = response.data.pdf_file;
          console.log(pdf)
          console.log(response.data)
      
          // Check if the PDF file is not corrupted
          if (pdf.length === 0) {
            throw new Error('PDF file is corrupted');
          }
      
          // Create a blob from the PDF data
          const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
      
          // Create a URL for the blob
          const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      
          // Open the PDF in a new tab
          window.open(pdfBlobUrl, '_blank');
        } catch (error) {
          console.error('Error fetching or opening PDF:', error);
          console.log("error")
        }
      };
      
      
    return (
        <div style={{backgroundColor:"#e0f3ff"}}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
                <button
                    onClick={toggleWidget}  style={{ ...buttonStyle }}
                   
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                        e.target.style.color = buttonHoverStyle.color;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = buttonStyle.backgroundColor;
                        e.target.style.color = buttonStyle.color;
                    }}
                >
                    New Scans
                </button>
      
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
  <div style={{ width: '60%' }}>
            <table style={{ width: '100%',paddingBottom:'40px' }}>
                <thead>
        <tr>
          <th style={{ textAlign: 'center', width: '16.66%', ...flowerBracketItems, color: getColorForItem('SCAN TYPE') }}
                    onMouseEnter={() => handleMouseEnter('SCAN TYPE')}
                    onMouseLeave={handleMouseLeave} >SCAN TYPE</th>
          <th style={{ textAlign: 'center', width: '20.66%',...flowerBracketItems, color: getColorForItem('TARGET(S)') }}
                    onMouseEnter={() => handleMouseEnter('TARGET(S)')}
                    onMouseLeave={handleMouseLeave}
                 >TARGET(S)</th>
          <th style={{ textAlign: 'center', width: '16.66%',...flowerBracketItems, color: getColorForItem('STATE') ,marginLeft:'23px'}}
                    onMouseEnter={() => handleMouseEnter('STATE')}
                    onMouseLeave={handleMouseLeave}>STATE</th>
          <th style={{ textAlign: 'center', width: '16.66%',...flowerBracketItems, color: getColorForItem('PROGRESS/RESULTS'),marginLeft:'13px'}}
                    onMouseEnter={() => handleMouseEnter('PROGRESS/RESULTS')}
                    onMouseLeave={handleMouseLeave}>PROGRESS/RESULTS</th>
          <th style={{ textAlign: 'center', width: '16.66%',...flowerBracketItems, color: getColorForItem('CREATED'),marginLeft:'10px' }}
                    onMouseEnter={() => handleMouseEnter('CREATED')}
                    onMouseLeave={handleMouseLeave}>CREATED</th>
          <th style={{ textAlign: 'center', width: '12.66%',...flowerBracketItems, color: getColorForItem('ACTIONS') }}
                    onMouseEnter={() => handleMouseEnter('ACTIONS')}
                    onMouseLeave={handleMouseLeave}>ACTIONS</th>
        </tr>
      </thead>
      {data.map((item,index) => (
        <tr key={item.id} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
          
          <td style={{ textAlign: 'center'}}>SSylze</td>  
          <td style={{ textAlign: 'center'}}>{item.target}</td>
            <td style={{ textAlign: 'center'}}>Succeeded</td>
           <td style={{ textAlign: 'center'}}> <button style={buttonStyle} onClick={() => handleButtonClick(item.id)}><FaFilePdf /></button></td>
            <td style={{ textAlign: 'center'}}>{calculateTimeDifference(item.date)} </td>
            <td style={{ textAlign: 'center'}}><FontAwesomeIcon icon={faRefresh}  /> </td>
     </tr>
      ))}
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
                {showPdf && (
        <div>
          <Document file={pdfBlobUrl}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
          
            <div>
            {showPopup && (
        <div  style={successPopup}>
          Scan has been queued
          {console.log('popup')}
        </div>
        
      )}
</div>
            {widgetVisible && (
                
                    <div style={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '130%'}}>
                    <Newscan onClose={closeWidget} showPopupFunction={setShowPopup} />
                </div>


            )}
           
        </div>
    );
}

export default Scans;