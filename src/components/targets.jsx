import React from 'react';
import Newtarget from "./newtargets"
import axios from 'axios';
import { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Prop from './prop';
import './styles.css'

function createdata(props) {
    return (
        <Prop 
            key={props.id}
            id={props.id}
            target={props.target}
            tags={props.tags}
            label={props.label}

        />
    );
}
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

    
 
function Target() {
    const location = useLocation();
    const backendData = location.state;
    

    const [widgetVisible, setWidgetVisible] = React.useState(false);
const [data, setData] = useState([]); // Initial data state

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/target');
      setData(response.data); // Update data state
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
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
    const updateData = () => {
        fetchData(); // Refresh data
        closeWidget(); // Close the widget
      };
    
    return (
        <div>
           
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
                    Add Targets
                </button>
            </div>
            <div style={container_scan}>
            <div style={container2}>
            <div style={boldText}>Targets</div>
            <div style={infoRow}>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('SOURCE'),paddingLeft:'10px' }}
                    onMouseEnter={() => handleMouseEnter('SOURCE')}
                    onMouseLeave={handleMouseLeave}
                >
                    SOURCE
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('LABEL') }}
                    onMouseEnter={() => handleMouseEnter('LABEL')}
                    onMouseLeave={handleMouseLeave}
                >
                    LABEL
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('TARGET') }}
                    onMouseEnter={() => handleMouseEnter('TARGET')}
                    onMouseLeave={handleMouseLeave}
                >
                    TARGET
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('TAGS') }}
                    onMouseEnter={() => handleMouseEnter('TAGS')}
                    onMouseLeave={handleMouseLeave}
                >
                    TAGS
                </div>
                
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('ACTIONS') }}
                    onMouseEnter={() => handleMouseEnter('ACTIONS')}
                    onMouseLeave={handleMouseLeave}
                >
                    ACTIONS
                </div>
                
            </div>
            
            {backendData && backendData.map((item) => createdata(item))}
        </div>
            </div>
            
            {widgetVisible && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '130%',
                    borderRadius: '100px', // Add this line for curved border
                    // Add this line to set background color
                    boxShadow: '0 2px 5px #ccc', // Add this line for a subtle shadow
                }}>
                    <Newtarget onClose={updateData}  />
                </div>
            )}
        </div>
    );
}

export default Target;