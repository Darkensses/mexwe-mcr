import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useTrail, a, useSpring } from "react-spring";
import "./styles.css";

const config = { mass: 5, tension: 3000, friction: 200 };

function DropDown({ list, selected, placeholder, style }) {
  let [isOpen, setIsOpen] = useState(false);
  let [itemSelected, setItemSelected] = useState('');

  useEffect(()=>{
    if(!list.length) {
      setItemSelected('');
    }
  })

  const trail = useTrail(list.length, {
    config,
    opacity: isOpen ? 1 : 0,
    x: isOpen ? 0 : 20,
    height: isOpen ? 80 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  const springProps = useSpring({
    config: { mass: 1, tension: 220, friction: 40 },
    height: isOpen ? "200px" : "0px",
    opacity: isOpen ? 1 : 0,
    from: {
      height: "0px",
      opacity: 0,
    },
  });


  const handleDropDownClick = () => {
    setIsOpen(!isOpen);
    //setSpringProps(isOpen ? {height: 315, opacity: 1} : {height: 0, opacity: 0})
  };

  const handleSelectTeam = (item, index) => {
    setItemSelected(item);
    selected(index);
    setIsOpen(false);
  };
  
  return (
    <div className="dropdown__wrapper" style={style}>
      <div className="dropdown__main" onClick={handleDropDownClick}>
        <span>
          {itemSelected === ''
            ? placeholder
            : itemSelected}
        </span>
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </div>
      <a.div className="dropdown__list" style={springProps}>
        <ul>
          {trail.map(({ x, height, ...rest }, index) => (
            <a.li
              key={list[index].split(" ") + index}
              onClick={() => handleSelectTeam(list[index], index)}
              style={{
                ...rest,
                transform: x.interpolate((x) => `translate3d(0,${x}px,0)`),
              }}
            >
              {list[index]}
            </a.li>
          ))}
        </ul>
      </a.div>
    </div>
  );
}

export default DropDown;