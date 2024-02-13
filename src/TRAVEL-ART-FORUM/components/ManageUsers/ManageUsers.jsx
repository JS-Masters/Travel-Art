import { useEffect, useState } from "react";
import { getUsers } from "../../services/admin.service";

const ManageUsers = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, [])

  return (
    <>
      {users.length && users.map((u) => <h1 key={u.handle}>{u.handle}</h1>)}
    </>
  )
}

export default ManageUsers;