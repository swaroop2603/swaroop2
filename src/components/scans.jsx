import React from 'react';
import Newscan from './newscan'; // Make sure the filename matches the actual filename
import axios from 'axios';
import { useState} from 'react';
import { useLocation } from 'react-router-dom';
import Propscan from './prop_scan';
function Scans() {
    const location = useLocation();
    const backendData = location.state;
    const [widgetVisible, setWidgetVisible] = React.useState(false);
    const [showPopup, setShowPopup] = useState(false);
    function createdata(props) {
        return (
            <Propscan 
                key={props.id}
                id={props.id}
                target={props.target}
                pdf={props.json_file}
                label={props.label}
                time={props.date}
            />
        );
    }
    const toggleWidget =()=> {
        
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
        marginTop: '10px',
        position: "relative", // Adjust the margin as needed
        padding: '10px',
        zindex: "1",
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

                <div style={container_scan}>
            <div style={container2}>
            <div style={boldText}>Scans</div>
            <div style={infoRow}>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('SCAN TYPE') }}
                    onMouseEnter={() => handleMouseEnter('SCAN TYPE')}
                    onMouseLeave={handleMouseLeave}
                >
                    SCAN TYPE
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('TARGET(S)') }}
                    onMouseEnter={() => handleMouseEnter('TARGET(S)')}
                    onMouseLeave={handleMouseLeave}
                >
                    TARGET(S)
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('STATE') ,marginLeft:'23px'}}
                    onMouseEnter={() => handleMouseEnter('STATE')}
                    onMouseLeave={handleMouseLeave}
                >
                    STATE
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('PROGRESS/RESULTS'),marginLeft:'13px'}}
                    onMouseEnter={() => handleMouseEnter('PROGRESS/RESULTS')}
                    onMouseLeave={handleMouseLeave}
                >
                    PROGRESS/RESULTS
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('CREATED'),marginLeft:'10px' }}
                    onMouseEnter={() => handleMouseEnter('CREATED')}
                    onMouseLeave={handleMouseLeave}
                >
                    CREATED
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