import React, { useEffect, useState } from 'react';
import { getUserAvatar } from '../../services/users.service';
import './AboutView.css';


const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUserAvatar('hammersign')
      .then((user) => {
        setUsers((prevState) => [...prevState, user]);
      })
      .catch((error) => console.log(error.message));

    getUserAvatar('clancker')
      .then((user) => {
        setUsers((prevState) => [...prevState, user]);
      })
      .catch((error) => console.log(error.message));

    getUserAvatar('Tsvety')
      .then((user) => {
        setUsers((prevState) => [...prevState, user]);
      })
      .catch((error) => console.log(error.message));
  }, []);

  return (
    
    <div className="home-page">
      <div className="about-info">
        <p className="content-about">
         -  Welcome to Travel Art, a SPA application crafted by JS Masters for travel enthusiasts. Our goal is to provide a platform where users can explore and share their travel experiences, discover new destinations, and connect with fellow travelers.
        </p>  
        <p className="content-about">
         - Whether you're a seasoned globetrotter or planning your first adventure, Travel Art offers features like creating posts, adding comments, and interacting with a community of travel enthusiasts. We believe in the power of shared experiences and aim to make your journey memorable.
        </p>
        <p className="content-about">
         - Thank you for trusting our developers! We hope you enjoy the simplicity and intuitiveness of our application. If you have any observations or suggestions, please feel free to contact our team. Safe travels!
        </p>    
        <br />
        <ul> 
        <p className='our-team'>Our team: JS Masters</p>
        {users.map((user, index) => (
          <li key={index}>
            <img className="avatar" src={user.avatarUrl} alt={user.handle} />
            <p className="name">{user.firstName} {user.lastName}</p>
          </li>
        ))}
      </ul> 
      </div>
    </div>
  );
}

export default HomePage;