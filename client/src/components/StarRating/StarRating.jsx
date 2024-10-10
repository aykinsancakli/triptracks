import { useState } from "react";
import PropTypes from "prop-types";
import { IoStarOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  gap: "4px",
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func,
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(defaultRating);

  function handleSetRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }

  function handleSetTempRating(rating) {
    setTempRating(rating);
  }

  //   console.log(`Temp Rating: ${tempRating}
  // Rating: ${rating}
  // `);

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            num={i + 1}
            onSetRating={handleSetRating}
            onSetTempRating={handleSetTempRating}
            tempRating={tempRating}
            key={i}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating - 1]
          : tempRating > 0 && tempRating}
      </p>
    </div>
  );
}

function Star({ num, tempRating, onSetRating, onSetTempRating, color, size }) {
  const starStyle = {
    height: `${size}px`,
    width: `${size}px`,
    display: "block",
    cursor: "pointer",
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={() => onSetRating(num)}
      onMouseEnter={() => onSetTempRating(num)}
    >
      {tempRating >= num ? (
        <IoStar size={size} color={color} />
      ) : (
        <IoStarOutline size={size} color={color} />
      )}
    </span>
  );
}
