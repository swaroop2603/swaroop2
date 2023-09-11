import React, { useState ,useEffect } from 'react';
import Props from './props';
import axios from 'axios';
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
    
const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };
  const headerCellStyle = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
  };
  
  const dataCellStyle = {
    padding: '8px',
    textAlign: 'left',
  };
  
  const checkboxCellStyle = {
    padding: '8px',
    textAlign: 'center',
  };





const styles = {
    
    container: {
        width: '45%',
        
        minHeight: '100vh', 
        
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align contents to the left
        alignItems: 'flex-start',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '25px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        
    
    },
    but: {
        backgroundColor:  'blue',
        color: 'white',
        borderRadius: '5px',
        padding: '10px 20px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        fontWeight: 700,
        marginLeft: '800px',
      },
     elementStyle :{
        margin: '10px',
        whiteSpace: 'normal',
        
        wordWrap: 'break-word', // Allow words to wrap within the specified width
    },
    successPopup: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'green',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
      },
}

const options = [
    { value: "Nmap Scanner", label: "Nmap Scanner" },
    { value: "OpenVAS Scanner", label: "OpenVAS Scanner" },
    { value: "Sslyze Scanner", label: "Sslyze Scanner" }
  ];
  
const Newscan = ({ onClose,showPopupFunction }) => {

 const [selectedRows, setSelectedRows] = useState([]);
 // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // Initial data state
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedItem1, setSelectedItem1] = useState("");
  const [check1, setcheck1] = useState(false);
  const [check2, setcheck2] = useState(false);
  const [check3, setcheck3] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [buttonColor, setButtonColor] = useState('#ccc');
  const [pagesArray, setPagesArray] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

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
  useEffect(() => {
    const isButtonEnabled = selectedOptions.length > 0 && selectedItem1 && selectedRows.length > 0;
    setButtonColor(isButtonEnabled ? 'blue' : '#ccc');
  }, [selectedOptions, selectedItem1, selectedRows]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/target`, {
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
  const handleCheckboxChange = (rowIndex) => {
    const selectedCheckboxes = data
    .filter((item, index) => isRowSelected(index))
    .map((item) => item.target);

  console.log('Selected Checkboxes:', selectedCheckboxes);
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };
  
  // Modify isRowSelected to check if a row is selected based on its unique identifier
  const isRowSelected = (rowIndex) => selectedRows.includes(rowIndex);

  const handleChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  const handleSelectChange1 = (event) => {
    setSelectedItem1(event.target.value);
  };


  const selectStyle1 = {
    width: "200px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    fontSize: "20px",
    outline: "none"
  };

  const labelStyle1 = {
    fontSize: "23px",
    marginRight: "10px"
  };

  const resultStyle1 = {
    marginTop: "10px",
    fontSize: "30px",
    color: "green"
  };
  const loadPage = (page) => {
    setCurrentPage(page);
  };

 
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const handleSubmission = async () => {
      console.log(check1);
      console.log(check2);
      console.log(check3);
    
      if (buttonColor === 'blue') {
        let formField = {
          target: "http://127.0.0.1:8000/api/targets/",
          label: "ss",
        };
        setShowSuccessPopup(true);
        onClose();
        showPopupFunction(true);
    
        try {
          // Send the first POST request
          await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/scan',
            data: formField,
          }).then(() => {
            console.log('First submission successful');
    
            if (selectedSchedule === 'Daily') {
              // Schedule daily scans here
              
              const intervalId = setInterval(() => {
                axios({
                  method: 'post',
                  url: 'http://127.0.0.1:8000/api/scan', // Modify the URL as needed
                  data: formField,
                }).then(() => {
                  console.log('Daily scan submission successful');
                });
              }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
             
             
             
            }
    
            // Close the widget after the second submission
            setTimeout(() => {
              showPopupFunction(false);
            }, 3000);
          });
    
          console.log('Second submission successful');
        } catch (error) {
          console.error('An error occurred:', error);
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else {
        console.log('Not all checkboxes are selected. Submission not allowed.');
        setErrorMessage('Some checkboxes are not selected.');
      }
    };
    
      // Use useEffect to automatically hide the success popup after a delay
      
    const rowStyle = {

        display: 'flex',
        gap: '100px',
        alignItems: 'center',
        fontFamily: 'Calibri, sans-serif',
        fontSize: '16px',
    };

    const rowstyle1={
        ...rowStyle,gap:'20px'
    }

    const handlecheck1=()=>{
        setcheck1(!check1)
     }
     const handlecheck2=()=>{
         setcheck2(!check2)
     }
     const handlecheck3=()=>{
         setcheck3(true)
     }
    return (
        <div 
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                marginTop: '-40px',
                 }}>
            <div style={styles.container}>
                <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', color: 'rgb(100 116 139)', transition: 'color 0.3s ease-in-out' }} onClick={onClose} onMouseOver={e => e.target.style.color = 'rgb(100 116 139 / 0.8)'} onMouseOut={e => e.target.style.color = 'rgb(100 116 139)'}>
                ✕
            </button>
<div>
                <h1>New Scan</h1>
 <div>
      <h3>Select Scan types</h3>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
      />
      <div>
        <h3>Selected Options:</h3>
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>
</div>
<div style={{paddingTop:'40px'}}>
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
  <div style={{ width: '60%' }}>
                    
<table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerCellStyle}></th>
          <th style={headerCellStyle}>SOURCE</th>
          <th style={headerCellStyle}>LABEL</th>
          <th style={headerCellStyle}>IPV4 / DNS NAME</th>
          <th style={headerCellStyle}>TAGS</th>
        </tr>
      </thead>
      <tbody>
        
        {data.map((item, index) => (
          <tr key={index}>
          <td style={checkboxCellStyle}>
            <input
              type="checkbox"
              checked={isRowSelected(index)}
              onChange={() => handleCheckboxChange(index)}
            />
          </td>
          <td style={dataCellStyle}>Manual</td>
          <td style={dataCellStyle}>{item.label}</td>
          <td style={dataCellStyle}>{item.target}</td>
          <td style={dataCellStyle}>{item.tags}</td>
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
        <div>
            <div>
                            <h1>Schedule</h1>
                            </div>
                            <div>
      <label htmlFor="selectItem" style={labelStyle1}>
        Select an item:
      </label>
      <select
        id="selectItem"
        value={selectedItem1}
        onChange={(e) => {
          setSelectedSchedule(e.target.value);
          handleSelectChange1(e); // Call your existing select change handler
        }}
        style={selectStyle1}
      >
        <option value="">Select an item</option>
        <option value="One Time">One Time</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>
      {selectedItem1 && <p style={resultStyle1}>You selected: {selectedItem1}</p>}
    </div>      
                 </div>
                    <button
                    onClick={handleSubmission }
                    style={{...styles.but,
                        backgroundColor:buttonColor}}
                >
                    Submit
                </button>
                
            </div>
        </div>
    );
};

export default Newscan;