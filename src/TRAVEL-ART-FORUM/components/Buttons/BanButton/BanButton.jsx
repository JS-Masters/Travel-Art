import { updateUserProperty } from "../../../services/admin.service";
import "../BanUnbanButtons.css";

const BanButton = ({ userHandle, rerenderAfterClick }) => {

  const handleBanClick = async () => {
    const banPath = `users/${userHandle}/isBanned`;
    const banValue = true;
    await updateUserProperty(banPath, banValue)
    .then(console.log(`${userHandle} was banned!`))

    rerenderAfterClick();
  }
  return (
    <button key={`ban-user-${userHandle}`} className="ban-buttons" onClick={handleBanClick}>Ban User</button>
  )

}

export default BanButton;