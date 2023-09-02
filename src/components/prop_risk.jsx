import React from 'react';

function Proprisk(props) {
    const presentTime = new Date();
    const dataTime = new Date(props.time);
    const timeDifference = presentTime - dataTime;
    const timeDifferenceInHours = Math.floor(timeDifference / (1000 * 60 * 60));

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        /* Add any other container styles you want */
    };

    const textStyle = {
        marginRight: '10px', // Adjust the margin as needed
        /* Add any other text styles you want */
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        width: '150px',
    };

    
    const circleStyle = {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        marginRight: '5px',
    };
    const getCircleColor = (value) => {
        if (typeof value === 'string') {
            value = value.toLowerCase(); // Convert to lowercase
            if (value === 'low') return 'blue';
            if (value === 'medium') return 'yellow';
            if (value === 'high') return 'red';
            if (value === 'accepted') return 'green';
            if (value === 'open') return 'yellow';
            if (value === 'closed') return 'gray';
        }
        return 'transparent';
    };


    return (
        <div style={containerStyle}>
           <div style={{ marginRight:'15px'}}> <p style={textStyle}> {props.Title}</p> </div>
           <div style={{ marginLeft: '10px' }}> <p style={textStyle}>{props.Scantype}</p></div> 
           <div style={{ marginLeft: '20px' }}> <p style={textStyle}>{props.target}</p></div> 
           <div style={{ display: 'flex', alignItems: 'center',marginLeft: '80px' }}>
  <div style={{ ...circleStyle, backgroundColor: getCircleColor(props.Thread_Level) }}></div>
  <p style={{ ...textStyle,  }}>{props.Thread_Level}</p>
</div>
 
           <div style={{ marginLeft: '70px' }}> <p style={textStyle}>{props.openvas_QOD*100}%</p></div> 
           <div style={{ display: 'flex', alignItems: 'center', marginLeft: '50px' }}>
  <div style={{ ...circleStyle, backgroundColor: getCircleColor(props.STatus) }}></div>
  <p style={{ ...textStyle, marginLeft: '10px' }}>{props.STatus}</p>
</div>
 
           <div style={{ marginLeft: '50px' }}> <p style={textStyle}>{timeDifferenceInHours} hours ago</p></div>
           
          
        
        </div>
    );
}

export default Proprisk;