import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
function Props(props) {
  const [formData, setFormData] = useState({
    label: '',
    target: '',
    tags: ''
  });
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const [deleteTargetData, setDeleteTargetData] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
const [hoveredItem, setHoveredItem] = React.useState('');
  const Handleedit = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/target/${id}`);
      const targetData = response.data;
      setFormData({
        label: targetData.label,
        target: targetData.target,
        tags: targetData.tags
      });
      setEditFormVisible(true);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const labelContainer= {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '200px', // Adjust the gap between label and input
    justifyContent: 'flex-start',
    fontWeight: 'bold' // Align items to the left
}
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

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '100px'
  };

  const elementStyle = {
    margin: '10px',
    whiteSpace: 'normal',
    width: '150px',
    wordWrap: 'break-word'
  };
  const labelStyle = {
    ...elementStyle,
    marginLeft: '45px'
  };
  const targetstyle = {
    ...elementStyle,
    marginLeft: '25px'
  };
  const tagsStyle = {
    ...elementStyle,
    marginLeft: '45px'
  };

  const buttonStyle = {
    marginLeft: '10px',
    backgroundColor: 'transparent',
    color: 'none',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s, border-color 0.3s',
    outline: 'none'
  };

  const buttonHoverStyle = {
    backgroundColor: 'lightblue',
    color: 'black'
  };
  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px'
  };
  
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
  const fetchData = async () => {
    // Fetch data using axios or your preferred method
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/target');
      // Update your state with the fetched data
      // For example, if you have a state named "targets", you can update it like this:
     props=(response.data);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/target/${props.id}`,
        formData
      );        

      console.log('PUT request successful:', response.data);
      setEditFormVisible(false);
      fetchData()
    } catch (error) {
      console.error('An error occurred:', error);
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

  const confirmDelete = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/target/${id}`);
      setShowDeleteSuccess(true); // Show the success message
      
      console.log('DELETE request successful:', response.data);
      fetchData()
      fetchData()
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
    const handleMouseEnter = (item) => {
      setHoveredItem(item);
  };

  const handleMouseLeave = () => {
      setHoveredItem('');
  };

  const getColorForItem = (item) => {
      return hoveredItem === item ? 'rgba(0, 0, 0, 0.6)' : 'black';
  };
  return (
    <div>

    <div style={rowStyle}>
      <div style={elementStyle}>Manual</div>
      <div style={labelStyle}>{props.label}</div>
      <div style={targetstyle}>{props.target}</div>
      <div style={tagsStyle}>
        <span
          style={{
            padding: '2px',
            backgroundColor: 'rgb(226 232 240)',
            borderRadius: '3px'
          }}
        >
          {props.tags}
        </span>
      </div>
      <div style={buttonContainerStyle}>
        <button
          style={buttonStyle}
          onClick={() => {
            Handleedit(props.id);
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
          onClick={() => handleDelete(props.id)}
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
              onClick={() => confirmDelete(props.id)}
            >
              Delete
            </button>
          </div>
          
        </div>
      )}
      {showDeleteSuccess && (
        <div style={deleteSuccessStyle}>
          "{props.target}" has been deleted successfully!
        </div>
      )}
    </div>
    </div>
  );
  
}

export default Props;