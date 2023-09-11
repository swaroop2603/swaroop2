import React, { useState } from 'react';
import axios from 'axios';
import Target from './targets';

const styles = {
    container: {
        width: '50%',
        height: '50%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    
    },
    
    header: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '25px',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        fontFamily: 'Open Sans, sans-serif',
        paddingLeft:'40px',
    },
    form: {
        width: '100%',
    },
    inputRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap:"80px",
    },
    labelContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '200px', // Adjust the gap between label and input
        justifyContent: 'flex-start', // Align items to the left
    },
    label: {
        fontWeight: 'bold',
    },
    label: {
        fontWeight: 'bold',
        
        
    },
    inputField: {
        padding: '5px',
        flex: 1,
        
    },
    errorMessage: {
        color: 'red',
        marginBottom: '10px',
    },
    submitButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    submitButton: {
        width: '100px',
        marginLeft: 'auto',
    },
    but: {
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: '5px',
    padding: '10px 20px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
  },
};



function Newtarget({ onClose }) {
    const [target, setTarget] = useState(null);
    const [tags, setTags] = useState(null);
    const [label, setLabel] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isTargetEmpty, setIsTargetEmpty] = useState(true);

    const handleSubmission = async () => {
        if (!target) {
            setErrorMessage('Target is a required field');
            return;
        }
         setIsTargetEmpty(true);
        let formField = new FormData()
        formField.append('target', target)
        formField.append('tags', tags)
        formField.append('label', label)
       
       try {
            await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/target',
                data: formField,
                
            });

            console.log('Submission successful');

            // Close the widget after successful submission
            onClose();
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    }

    const handleClose = () => {
        // Handle close here
        onClose();
    }

    return (
        <div style={styles.container}>
          <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', background: 'none', border: 'none', padding: '0', color: 'rgb(100 116 139)', transition: 'color 0.3s ease-in-out' }} onClick={onClose} onMouseOver={e => e.target.style.color = 'rgb(100 116 139 / 0.8)'} onMouseOut={e => e.target.style.color = 'rgb(100 116 139)'}>
                ✕
            </button>

            <h1 style={styles.header}>Add Targets</h1>
            <p style={{ textAlign: 'left', marginBottom: '20px',marginRight:'150px', color: 'rgba(100, 116, 139, 1)' }}>
                Add targets individually by IP, DNS Name, or URL. Once created, you can configure advanced options for each target.
            </p>
            <div style={{ ...styles.inputRow, justifyContent: 'space-between' }}>
            <div style={styles.labelContainer}>
                <div style={styles.label}>
                    <label style={{marginRight: '140px' }}>Target*</label>
                </div>
                <div style={styles.label}>
                    <label style={{marginRight: '60px' }}>Tags</label>
                </div>
                <div style={styles.label}>
                    <label style={{paddingRight:'190px' }}>Label</label>
                </div>
            </div>
</div>
            <div style={styles.inputRow}>
    <div style={{...styles.inputColumn}}>
        
        <input
             style={{ width: '300px', height: '40px' }}
            type="url"
            value={target}
            onChange={e => { setTarget(e.target.value); setIsTargetEmpty(e.target.value === ''); }}
            placeholder="IPv4, Domain, URL or Public CIDR"
        />
    </div>
    <div style={{...styles.inputColumn}}>
 
        <input
            style={{ width: '200px', height: '40px' }}
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Up to 5 tags"/>
    </div>
    <div style={{...styles.inputColumn} }>
       
        <input
           style={{ width: '230px', height: '40px' }}
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="e.g. my-example-server"/>
    </div>
</div>


            <div style={styles.errorMessage}>{errorMessage}</div>
            <div style={{ width: '50%', margin: 'auto', position: 'relative' }}>
            {/* ... Rest of your code ... */}
            <div style={{ marginLeft: '650px' }}>
                  <button
                    onClick={handleSubmission}
                    style={{
                        ...styles.but,
                        backgroundColor: isTargetEmpty ? '#ccc' :  'rgba(7, 89, 133, 150)',
                    }}
                    disabled={isTargetEmpty}
                >
                    Submit
                </button>
            </div>
        </div>
        </div>
    );
}

export default Newtarget;