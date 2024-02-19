import { updateUserProperty } from "../../../services/admin.service";
import "./PromoteButton.css"

const PromoteButton = ({ userHandle, rerenderAfterClick }) => {

    const handlePromoteClick = async () => {
        const promotePath = `users/${userHandle}/isAdmin`;
        const ptomoteValue = true;
        await updateUserProperty(promotePath, ptomoteValue)
        .then(console.log(`${userHandle} was promoted for Admin role!`))
    
        rerenderAfterClick();
      }


    return (
        <button key={`promote-user-${userHandle}`} className="promote-buttons" onClick={handlePromoteClick}>Promote to Admin</button>
      )
};

export default PromoteButton;