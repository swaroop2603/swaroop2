import React from 'react';
import axios from 'axios';
import { FaFilePdf } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Document, Page } from 'react-pdf';
import { saveAs } from 'file-saver';

function Propscan(props) {
    const presentTime = new Date();
    const dataTime = new Date(props.time);
    const timeDifference = presentTime - dataTime;
    const timeDifferenceInHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const [showPdf, setShowPdf] = React.useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = React.useState('');
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

    const buttonStyle = {
        /* Add any button styles you want */
        color:'red',
        border:'none'
    };
    const handleButtonClick = async (id) => {
        console.log("pdf");
      
        try {
          // Make a GET request to your server to fetch the PDF data
          const response = await axios.get(`http://127.0.0.1:8000/api/scan/${id}`, {
      
          });
          console.log(response.data);
          const pdf = response.data.pdf_file;
          console.log(pdf);
      
          // Check if the PDF file is not corrupted
          if (pdf.length === 0) {
            throw new Error('PDF file is corrupted');
          }
      
          // Create a blob from the PDF data
          const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
      
          // Trigger the file download
          saveAs(pdfBlob, 'downloaded.pdf');
      
        } catch (error) {
          console.error('Error fetching or downloading PDF:', error);
          console.log("catch");
        }
      };
      
    
    

    return (
        <div style={containerStyle}>
            <p style={textStyle}>Sslyze</p>
           <div style={{ marginLeft: '60px' }}> <p style={textStyle}>{props.target}</p> </div>
           <div style={{ marginLeft: '80px' }}> <p style={textStyle}>Succeeded</p></div> 
           <div style={{ marginLeft: '90px' }}><button style={buttonStyle} onClick={() => handleButtonClick(props.id)}><FaFilePdf /></button></div> 
           <div style={{ marginLeft: '210px' }}> <p style={textStyle}>{timeDifferenceInHours} hours ago</p></div>
           <div style={{ marginLeft: '75px' }}>
                <FontAwesomeIcon icon={faRefresh}  />
            </div>
           <div style={{ marginLeft: '70px' }}> </div>
           {showPdf && (
        <div>
          <Document file={pdfBlobUrl}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
        </div>
    );
}

export default Propscan;
