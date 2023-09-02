import React, { useState ,useEffect } from 'react';
import Props from './props';
import axios from 'axios';

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



const Newscan = ({ onClose,showPopupFunction }) => {
    
    

    const [check1,setcheck1]=useState(false)
    const [check2,setcheck2]=useState(false)
    const [check3,setcheck3]=useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const handleSubmission = async () => {
        console.log(check1);
        console.log(check2);
        console.log(check3);
    
        if (check1 && check2 && check3) {
          let formField = {
            target: "http://127.0.0.1:8000/api/targets/",
            label: "ss",
          };
          setShowSuccessPopup(true);
            onClose();
            // Show the success popup
            showPopupFunction(true);
    
          try {
            // Send the first POST request
            await axios({
              method: 'post',
              url: 'http://127.0.0.1:8000/api/scan',
              data: formField,
            }).then(() => {
                console.log('Second submission successful');
       
                //  Close the widget after the second submission
                 setTimeout(() => {
                   showPopupFunction(false);
                 }, 3000);
               });
    
            console.log('First submission successful');
            
    
            // Send the second POST request in the background
            //axios({
              //method: 'post',
              //url: 'http://127.0.0.1:8000/api/sslyze-scan',
              // Additional data for the second request...
            //}).then(() => {
             // console.log('Second submission successful');
    
              // Close the widget after the second submission
              //setTimeout(() => {
                //showPopupFunction(false);
              //}, 3000);
            //});
    
          } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred. Please try again later.');
          }
          //axios({
            //method: 'post',
            //url: 'http://127.0.0.1:8000/api/target/pdf',
            // Additional data for the second request...
          //}).then(() => {
            //console.log('Second submission successful');
            
            // Close the widget after the second submission
            //setTimeout(() => {
              //showPopupFunction(false);
            //}, 3000);
          //});
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

                
            }}
        >
            <div style={styles.container}>
               
                
             
                <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', color: 'rgb(100 116 139)', transition: 'color 0.3s ease-in-out' }} onClick={onClose} onMouseOver={e => e.target.style.color = 'rgb(100 116 139 / 0.8)'} onMouseOut={e => e.target.style.color = 'rgb(100 116 139)'}>
                ✕
            </button>
            <div>
                <h1>New Scan</h1>
                        <label style={{ display: 'flex', alignItems: 'center',marginRight:"90px" }}>
                            <input
                                type="checkbox"
                                name="Sslyze TLS/SSL Security Scan"
                                onClick={handlecheck1}
                                style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                            />
                            Sslyze TLS/SSL Security Scan
                        </label>
                        <p style={{ marginLeft: '25px',textAlign: 'left', marginBottom: '20px', color: 'rgba(100, 116, 139, 1)' }}>
                        Analyze your TLS/SSL configuration for bad certificates, weak ciphers, Heartbleed, ROBOT and more.
            </p>
                    </div>
                    <div style={styles.elementStyle}>
                        <div style={rowStyle}>
                             
                            <p style={{ marginLeft: '45px' }}>SOURCE</p>
                            <p>LABEL</p>
                            <p style={{ marginLeft: '20px' }}>IPV4 / DNS NAME</p>
                            <p style={{ marginLeft: '138px' }}>TAGS</p> {/* Adjust the margin as needed */}
                            <hr />
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                        <div style={rowstyle1}>
                        <input type='checkbox' onClick={handlecheck2}
                           
                        />
                            <p >Manual</p>
                            <p style={{ marginLeft: '90px' }}>s</p>
                            <p style={{ marginLeft: '130px' }}>https://public-firing-range.appspot.com/</p>
                            <p style={{ marginLeft: '70px' }}>my_first_target</p>
                            
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1>Schedule</h1>
                            <p>Run the scan just one time or on a recurring schedule</p>
                            <label>
                                <input type="radio" name="radioGroup1" value="option1" onClick={handlecheck3} />
                                One Time
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="radio" name="radioGroup1" value="option2" onClick={handlecheck3}/>
                                Daily
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="radio" name="radioGroup1" value="option3" onClick={handlecheck3}/>
                                Weekly
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="radio" name="radioGroup1" value="option4" onClick={handlecheck3}/>
                                Monthly
                            </label>
                        </div>
                        <br />
                       
                    </div>
                    <button
                    onClick={handleSubmission }
                    style={{...styles.but,
                        backgroundColor: (check1 && check2 && check3) ? 'rgb(2, 132, 190)' : '#ccc',}}
                >
                    Submit
                </button>
                
            </div>
        </div>
    );
};

export default Newscan;