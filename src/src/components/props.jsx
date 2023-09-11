import React from 'react';

const Props = ({ id, target, tags, label, onCheckboxChange }) => {
    const rowStyle = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center', // Vertically center align the text
        fontFamily: 'Calibri, sans-serif', // Set the font family
        fontSize: '16px', // Set the font size
    };

    return (
        <div style={rowStyle}>
            <input type='checkbox'  id={id} />
            <p>{label}</p>
            <p>{target}</p>
            <p>{tags}</p>
        </div>
    );
};

export default Props;
