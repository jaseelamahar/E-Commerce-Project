import React from "react";
import PropTypes from "prop-types";

const GradientButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-pink-500 to-orange-400 
               hover:from-orange-400 hover:to-pink-500 
               dark:hover:from-orange-300 dark:hover:to-pink-300 
               text-white font-semibold py-3 px-8 rounded-full 
               shadow-lg hover:shadow-2xl transition-all duration-500
               text-lg"
  >
    {text}
  </button>
);

GradientButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default GradientButton;
