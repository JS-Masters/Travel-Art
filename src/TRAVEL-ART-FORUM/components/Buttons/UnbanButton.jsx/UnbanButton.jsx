import { updateUserProperty } from "../../../services/admin.service";
import "../BanUnbanButtons.css";

const UnbanButton = ({ userHandle, rerenderAfterClick }) => {

  const handleUnbanClick = async () => {
    const unbanPath = `users/${userHandle}/isBanned`;
    const unbanValue = false;

    await updateUserProperty(unbanPath, unbanValue)
      .then(console.log(`${userHandle} was unbanned!`))

    rerenderAfterClick();
  }


  return (
    <button key={`unban-user-${userHandle}`} id="unban-button" className="ban-buttons" onClick={handleUnbanClick}>Unban User</button>
  )
}
export default UnbanButton;