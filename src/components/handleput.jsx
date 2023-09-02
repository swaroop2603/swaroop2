import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Handleedit(props) {
  const { id } = props;
  loadTargets(id)
  let loadTargets=async(id)=>{
    try {
      await axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/target'+id,
        
        
      });

      console.log('Submission successful');

      // Close the widget after successful submission
     
    } catch (error) {
      console.error('An error occurred:', error);
      
    }
    }
 
}

function EditTarget(props) {
  const { id } = useParams();
  return (
    <Handleedit id={id} />
  );
}

export default EditTarget;
