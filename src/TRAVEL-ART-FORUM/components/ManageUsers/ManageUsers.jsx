import { useEffect, useState } from "react";
import { getAllUsers, renderUsersBySearch } from "../../services/admin.service";
import "./ManageUsers.css"
import BanButton from "../Buttons/BanButton/BanButton";
import UnbanButton from "../Buttons/UnbanButton.jsx/UnbanButton";
import PromoteButton from "../Buttons/PromoteButton/PromoteButton";
const ManageUsers = () => {

  const [users, setUsers] = useState([]);
  const [clickTrigger, setClickTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, [clickTrigger]);



  const rerenderAfterClick = () => {
    setClickTrigger(prevState => !prevState);
  }

  const setSearch = (value) => {
    setSearchTerm(value);
  }

  useEffect(() => {
    getAllUsers()
      .then(users => renderUsersBySearch(searchTerm, users))
      .then(setUsers)
  }, [searchTerm]); // Update users when search term changes or when users are fetched



  return (
    <>
      <label id="search-users-label" htmlFor="search">Search Users </label>
      <input value={searchTerm} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br />
      <div className="manage-users-page">
        {users.length && users.map((u) => {
          return (
            <div className="single-user" key={`${u.uid}-single-user`}>
              <div id="first-line">
                <img
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                  src={u.avatarUrl}
                />
                <h1>{u.handle}</h1>
              </div>
              {u.handle &&
                <>
                  <h2>Name: {u.firstName} {u.lastName}</h2>
                  <h2>Email: {u.email}</h2>
                  {u.isBanned ? (
                    <>
                      {u.isAdmin ? (
                        <p>ADMIN</p>
                      ) : (
                        <UnbanButton userHandle={u.handle} rerenderAfterClick={rerenderAfterClick} key={`${u.uid}-unban-button`} />
                      )}
                    </>
                  ) : (
                    <>
                      {u.isAdmin ? (
                        <p>ADMIN</p>
                      ) : (
                        <div className="admin-buttons">
                          <BanButton userHandle={u.handle} rerenderAfterClick={rerenderAfterClick} key={`${u.uid}-ban-button`} />
                          <PromoteButton userHandle={u.handle} rerenderAfterClick={rerenderAfterClick} key={`${u.uid}-promote-button`} />
                        </div>

                      )}
                    </>

                  )}
                </>
              }


            </div>
          )

        })}
      </div>

    </>
  )
}

export default ManageUsers;


// <div key={`${u.uid}-content`}>
// <h1>Username: {u.handle}</h1>
// <h2>Email: {u.email}</h2>
// <h2>Name: {u.firstName} {u.lastName}</h2>
// {u.isBanned ? (
//   <>
//     {u.isAdmin ? (
//       <p>ADMIN</p>
//     ) : (
//       <UnbanButton userHandle={u.handle} rerenderAfterClick={rerenderAfterClick} key={`${u.uid}-unban-button`} />
//     )}
//   </>

// ) : (
//   <>
//     {u.isAdmin ? (
//       <p>ADMIN</p>
//     ) : (
//       <BanButton userHandle={u.handle} rerenderAfterClick={rerenderAfterClick} key={`${u.uid}-ban-button`} />
//     )}
//   </>

// )}
// </div>