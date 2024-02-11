import PropTypes from "prop-types";
import './Button.css';

/**
 *
 * @param {{ children: any, onClick: function }} props
 * @returns
 */
const Button = ({ children = null, handleClick = () => {} }) => {
  return <button id="myButton" onClick={handleClick}>{children}</button>;
};

Button.propTypes = {
  children: PropTypes.any.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Button;
