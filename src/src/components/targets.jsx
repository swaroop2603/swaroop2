import React from 'react';
import Newtarget from "./newtargets"
import axios from 'axios';
import { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faWarning } from '@fortawesome/free-solid-svg-icons';
import './styles.css'
import { faEdit, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
    
 
function Target() {
    const location = useLocation();
  const backendData = location.state;
   // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    label: '',
    target: '',
    tags: ''
  });
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTargetData, setDeleteTargetData] = useState(null);
  const [editTargetData, setEditTargetData] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [widgetVisible, setWidgetVisible] = React.useState(false);
  const [data, setData] = useState([]); // Initial data state
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPageBeforeEdit, setCurrentPageBeforeEdit] = useState(1);
  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [isLoading, setIsLoading] = useState(true);
const [pagesArray, setPagesArray] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    const Handleedit = async (id) => {
        try {
          setCurrentPageBeforeEdit(currentPage);
          const response = await axios.get(`http://127.0.0.1:8000/api/target/${id}`);
          const targetData = response.data;
          setEditTargetData(targetData);
          setFormData({
            label: targetData.label,
            target: targetData.target,
            tags: targetData.tags,
          });
          setEditFormVisible(true);
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [currentPage]);
      // Update data when currentPage or pageSize changes
      useEffect(() => {
        const totalPages = Math.ceil(totalDataCount / pageSize);
        const newPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPagesArray(newPagesArray);
      }, [totalDataCount, pageSize]);

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
      const loadMore = () => {
        if (data.length >= pageSize) {
          setPage(page + 1);
        }
      };
      
  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/target/${id}`);
      setDeleteTargetData(response.data); // Store the data of the target to be deleted
      setShowConfirmDelete(true);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const handleSubmit = async () => {
    const id = editTargetData.id;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/target/${id}`,
        formData
      );        

      console.log('PUT request successful:', response.data);
      setEditFormVisible(false);
      setCurrentPage(currentPageBeforeEdit);

    fetchData();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const confirmDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/target/${id}`);
      setShowDeleteSuccess(true); // Show the success message
      
      console.log('DELETE request successful:', response.data);
      fetchData()
      
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('An error occurred:', error);
    }
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };
  

    
    const onClose = () => {
        setEditFormVisible(false)
    };
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
        gap: '250px',
        paddingTop: '20px',
    };

    const flowerBracketItems = {
        paddingTop: '50px',
        
        cursor: 'pointer',
    };
    const buttonContainerStyle = {
        display: 'flex',
        gap: '10px'
      };
      const but= {
        backgroundColor: 'rgba(7, 89, 133, 150)',
        color: 'white',
        borderRadius: '5px',
        padding: '10px 20px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
      }
    
     const inputRow= {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap:"80px",
    }
     const header= {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '25px',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        fontFamily: 'Open Sans, sans-serif',
        paddingLeft:'20px',
        marginRight:'90px'
    }
    const centerScreenStylesedit = {
    
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '100px',
        paddingLeft:'20px',
        paddingTop:'20px',
        paddingBottom:'20px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '850px',
        wordWrap: 'break-word'
      };
      const centerScreenStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '450px',
        wordWrap: 'break-word'
      };const deleteSuccessStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 128, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
      };
    const [hoveredItem, setHoveredItem] = React.useState('');

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
    const updateData = () => {
        fetchData(); // Refresh data
        closeWidget(); // Close the widget
      };
      
      
      const loadPage = (pageNumber) => {
        setPage(pageNumber);
      };
    return (
        <div style={{backgroundColor:"#e0f3ff"}}>
           
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
                <button  onClick={toggleWidget}  style={{ ...buttonStyle }}
                   
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                        e.target.style.color = buttonHoverStyle.color;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = buttonStyle.backgroundColor;
                        e.target.style.color = buttonStyle.color;
                    }}
                >
                   + Add Targets
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
  <div style={{ width: '60%' }}> {/* Adjust the width as needed */}
    <table >
      <thead>
        <tr>
          <th style={{ textAlign: 'center', width: '20%', }}>SOURCE</th>
          <th style={{ textAlign: 'center', width: '20%', }}>LABEL</th>
          <th style={{ textAlign: 'center', width: '20%' }}>TARGET</th>
          <th style={{ textAlign: 'center', width: '20%' }}>TAGS</th>
          <th style={{ textAlign: 'center', width: '20%' }}>ACTIONS</th>
        </tr>
      </thead>
      {data.map((item, index) => (
        <tr key={item.id} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
          <td style={{ textAlign: 'center' }}>Manual</td>
          <td style={{ textAlign: 'center' }}>{item.label}</td>
          <td style={{ textAlign: 'center' }}>{item.target}</td>
          <td style={{ textAlign: 'center' }}>{item.tags}</td>
          <td style={{ paddingLeft: '50px' }}>
            <div style={buttonContainerStyle}>
              <button
                style={buttonStyle}
                onClick={() => {
                  Handleedit(item.id);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                  e.target.style.color = buttonHoverStyle.color;
                  e.target.style.borderColor = buttonHoverStyle.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = buttonStyle.backgroundColor;
                  e.target.style.color = buttonStyle.color;
                  e.target.style.borderColor = buttonStyle.borderColor;
                }}
              >
                <FontAwesomeIcon icon={faEdit} style={{ fill: 'none', backgroundcolor: 'black' }} />
              </button>
              <button
                style={buttonStyle}
                onClick={() => handleDelete(item.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                  e.target.style.color = buttonHoverStyle.color;
                  e.target.style.borderColor = buttonHoverStyle.borderColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = buttonStyle.backgroundColor;
                  e.target.style.color = buttonStyle.color;
                  e.target.style.borderColor = buttonStyle.borderColor;
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </td>
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
     

    {editFormVisible && (
        <div className="edit-form" style={centerScreenStylesedit}>
           <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', color: 'rgb(100 116 139)', transition: 'color 0.3s ease-in-out' }} onClick={onClose} onMouseOver={e => e.target.style.color = 'rgb(100 116 139 / 0.8)'} onMouseOut={e => e.target.style.color = 'rgb(100 116 139)'}>
                ✕
            </button>
          <form>
          <h1 style={header}>Edit Target</h1>
         
          <div style={inputRow}>
          <label>
              Target:
              <input
               style={{ width: '300px', height: '40px' }}
                type="text"
                value={formData.target}
                readOnly
              />
            </label>
            <label>
              Tags:
              <input
               style={{ width: '200px', height: '40px' }}
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </label>
            <label>
              Label:
              <input
               style={{ width: '230px', height: '40px' }}
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </label>
            
            </div>
            <div style={{ marginLeft: '800px' }}>
                  <button style={but} onClick={handleSubmit }>
                    Submit
                </button>
            </div>
            
          </form>
        </div>
      )}
            {showConfirmDelete && (
        <div style={centerScreenStyles}>
            
            <p style={{ fontSize: '18px', marginBottom: '10px', marginTop: '5px' }}>
  <FontAwesomeIcon
    icon={faWarning}
    color='#FFCCCB'
    style={{
      border: '2px solid red',
      borderRadius: '50%',
      padding: '5px',
      backgroundColor: '#FFCCCB',
      color: 'red',
      marginRight: '10px', // Add some gap
      verticalAlign: 'middle', // Vertically align the icon and text
    }}
  />
  Delete Target
</p>

          <div style={{ marginBottom: '20px',marginLeft:'40px' }}>
            
          
            <p>IPv4 / DNS Name:<strong> {deleteTargetData.target}</strong></p>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
  Are you sure you want to delete this target?
  The scans and risks for this target will also be removed.
</p>
</div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
            
            <button
              style={{
                flex: 1,
                padding: '10px 0',
                backgroundColor: 'gray',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
                fontSize: '16px',
              }}
              onClick={cancelDelete}
            >
              Cancel
            </button>
            <button
              style={{
                flex: 1,
                padding: '10px 0',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
                fontSize: '16px',
                marginRight: '10px',
              }}
              onClick={() => confirmDelete(deleteTargetData.id)}
            >
              Delete
            </button>
          </div>
          
        </div>
      )}
      {showDeleteSuccess && (
        <div style={deleteSuccessStyle}>
          "{deleteTargetData && deleteTargetData.target}" has been deleted successfully!
        </div>
      )}
            {widgetVisible && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '130%',
                   
                }}>
                    <Newtarget onClose={updateData}  />
                </div>
            )}
        </div>
    );
}

export default Target;