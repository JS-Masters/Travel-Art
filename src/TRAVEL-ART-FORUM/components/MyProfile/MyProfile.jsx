import React, { useEffect, useState, useContext } from 'react';
import { getUserData } from '../../services/users.service';
import { getPostByAuthor } from '../../services/posts.service';
import { AppContext } from "../../providers/AppContext";
import SinglePost from '../../components/SinglePost/SinglePost';
import { Link } from 'react-router-dom'
import { getAllAvatars, getUserAvatar } from '../../services/users.service';




const MyProfile = () => {
    const { user, userData, setContext } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const [avatar, setAvatar] = useState('');



    useEffect(() => {
        if (user) {
            getUserData(user.uid).then((snapshot) => {
                if (snapshot.exists()) {
                    setContext({
                        user,
                        userData: snapshot.val()[Object.keys(snapshot.val())[0]],
                    });
                }
            });
        }
    }, [user]);


    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            getPostByAuthor(userData.handle).then((posts) => {
                setPosts(posts);
            });
        }
    }, [userData]);


    useEffect(() => {
        if (userData.handle) {
            getUserAvatar(userData.handle).then((avatar) => {
                setAvatar(avatar);
                console.log(avatar)
            });
        }
    }, [userData]);



    return (
        <div>
            <h1>{userData.handle}</h1>
            <img
  src={userData.avatarUrl}
  alt="avatar"
  style={{ maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto' }}
/>
            {Object.keys(userData).length > 0 ? (
                <>
                    <h1>User Data:</h1>
                    <p>First Name: {userData.firstName}</p>
                    <p>Last Name: {userData.lastName}</p>
                    <p>UserName: {userData.handle}</p>
                    <p>Email: {userData.email}</p>
                    <br />
                    <h1>About {userData.handle}'s travels </h1>
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>
                                <Link to={`/single-post/${post.id}`}>{post.title}</Link>
                            </li>
                        ))}

                    </ul>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <br />

        </div>
    );
}

export default MyProfile;