import React from 'react';
import Newtarget from "./newtargets"
import axios from 'axios';
import { useState} from 'react';
import { useLocation } from 'react-router-dom';
import Prop from './prop_risk';

function createdata(props) {
    return (
        <Prop 
    key={props.id}
    Title= {props.Title}
    Scantype={props.Scantype}
    target = {props.target}
    Thread_Level= {props.Thread_Level}
    openvas_QOD={props.openvas_QOD}
    STatus= {props.STatus}
    time={props.date}
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

    
 
function Risks() {
    const location = useLocation();
    const backendData = location.state;
    

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
        marginRight: '30px'
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
                <button   style={{ ...buttonStyle1 }}
                   
                   onMouseEnter={(e) => {
                       e.target.style.backgroundColor = buttonHoverStyle1.backgroundColor;
                       e.target.style.color = buttonHoverStyle1.color;
                   }}
                   onMouseLeave={(e) => {
                       e.target.style.backgroundColor = buttonStyle1.backgroundColor;
                       e.target.style.color = buttonStyle1.color;
                   }}
               >
                   New Scan
               </button>
               </div>
            
            <div style={container_scan}>
            <div style={container2}>
            <div style={boldText}>Risks</div>
            <div style={infoRow}>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('TITLE') }}
                    onMouseEnter={() => handleMouseEnter('TITLE')}
                    onMouseLeave={handleMouseLeave}
                >
                   TITLE
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('SCAN TYPE') }}
                    onMouseEnter={() => handleMouseEnter('SCAN TYPE')}
                    onMouseLeave={handleMouseLeave}
                >
                   SCAN TYPE
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('TARGET') }}
                    onMouseEnter={() => handleMouseEnter('TARGET')}
                    onMouseLeave={handleMouseLeave}
                >
                    TARGET
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('THREAT LEVEL') }}
                    onMouseEnter={() => handleMouseEnter('THREAT LEVEL')}
                    onMouseLeave={handleMouseLeave}
                >
                    THREAT LEVEL
                </div>
                
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('OPENVAS QOD') }}
                    onMouseEnter={() => handleMouseEnter('OPENVAS QOD')}
                    onMouseLeave={handleMouseLeave}
                >
                    OPENVAS QOD
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('STATUS') }}
                    onMouseEnter={() => handleMouseEnter('STATUS')}
                    onMouseLeave={handleMouseLeave}
                >
                    STATUS
                </div>
                <div
                    style={{ ...flowerBracketItems, color: getColorForItem('LAST DETECTED') }}
                    onMouseEnter={() => handleMouseEnter('LAST DETECTED')}
                    onMouseLeave={handleMouseLeave}
                >
                    LAST DETECTED
                </div>
            </div>
            {backendData && backendData.map((item) => createdata(item))}
        </div>
            </div>
        </div>
    );
}

export default Risks;