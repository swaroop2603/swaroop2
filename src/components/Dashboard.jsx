// PatternedBackground.js
import React from 'react';
import './PatternedBackground.css';

const PatternedBackground = () => {
  return (
    <div>
      <div className="patterned-background">
        <div className="content">
          <div className="vulnerability-text"></div>
          {/* Your additional content goes here */}
        </div>
      </div>
      <div className="scrolling-text">
        <div className="scrolling-item">Vulnerability scanners: Your first line of defense against digital threats</div>
      </div>
      <div className="container">
        <div className="left">
          <img
            src="https://i0.wp.com/www.alphr.com/wp-content/uploads/2022/10/nmap.jpg?fit=650%2C320&ssl=1"
            alt="Nmap"
          />
        </div>
        <div className="right">
          <h1>Nmap Scanner:</h1>
          <p style={{ fontSize: '30px' }}>
            Nmap, short for Network Mapper, is a powerful open-source network scanning tool used for network discovery and security auditing. It's widely recognized for its versatility and effectiveness in scanning and mapping networks.
          </p>
        </div>
      </div>
      <div className="container">
        <div className="left">
          <h1>OpenVAS Scanner:</h1>
          <p style={{ fontSize: '30px' }}> {/* Adjust the font size as needed */}
            OpenVAS (Open Vulnerability Assessment System) is an open-source vulnerability scanner and management tool designed to help organizations identify and mitigate security vulnerabilities in their systems and networks.
          </p>
        </div>
        <div className="right">
          <img
            src="https://www.101labs.net/wp-content/uploads/2022/04/33-1.png"
            alt="OpenVAS"
          />
        </div>
      </div>
      <div className="container">
        <div className="left">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdE4zpID67g-2QbK3yQTu5ymVFQcjif4N-A&usqp=CAU"
            alt="Sslyze"
            style={{ width: '600px' }}
          />
        </div>
        <div className="right">
          <h1>Sslyze Scanner:</h1>
          <p style={{ fontSize: '30px' }}>
            SSLyze is an open-source Python tool that allows users to perform various types of SSL/TLS scans on a target server. It's designed to identify potential vulnerabilities and misconfigurations in SSL/TLS implementations, providing valuable insights into the security posture of a server's cryptographic protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatternedBackground;
