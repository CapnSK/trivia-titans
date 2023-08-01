import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css'
import Button from '@mui/material/Button';



const UserProfile = () => {

    
  const [name, setname] = useState(null);
  const [contactNo, setContactNo] = useState(null);
  const [address, setAddress] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // State to manage edit mode

  async function fetchData() {
  const data = {
      "email": "aakash738@gmail.com",
      "userName": "Akash738",
    };

    const apiUrl = 'https://us-east1-elated-channel-394023.cloudfunctions.net/UserProfileDetails';

    await axios.post(apiUrl, data)
      .then(response => {
        setname(response.data.data.Name);
        setContactNo(response.data.data.Contact)
        setAddress(response.data.data.Address)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleEditClick = () => {
    setIsEditable(true);
  }


  useEffect( () => {
  fetchData()
  }, []); 

    const handlenameChange = (e) => {
         setname(e.target.value);
     }
    const handlenContactChange = (e) => {
        setContactNo(e.target.value);
    }
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    }
  const handleSubmit = (e) => {
    alert('Your details are updated successfully.');
    setIsEditable(false); // Disable edit mode after saving
    e.preventDefault();
  }

    const saveUserDetails = (e) => {
      
  }


  return (
     <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handlenameChange}
            disabled={!isEditable} // Disable the input if not in edit mode
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number:</label>
          <input
            type="text"
            name="contact"
            value={contactNo}
            onChange={handlenContactChange}
            disabled={!isEditable} // Disable the input if not in edit mode
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleAddressChange}
            disabled={!isEditable} 
          />
        </div>

        {!isEditable && (
          <Button
            variant='contained'
            color='primary'
            style={{ width: '100%' }}
            onClick={handleEditClick}
          >
            Edit
          </Button>
        )}

        {isEditable && (
          <Button
            onClick={() => saveUserDetails()}
            type="submit"
            variant='contained'
            color='primary'
            style={{ width: '100%' }}
          >
            Save
          </Button>
        )}
      </form>
    </div>
  )
}

export default UserProfile