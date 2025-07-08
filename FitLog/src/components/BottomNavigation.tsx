// src/components/BottomNavigation.tsx

import React from "react";
import "./BottomNavigation.css";
import { IoHomeSharp, IoPerson, IoCamera, IoBarbell } from "react-icons/io5";
import { GiGymBag } from "react-icons/gi";
import { useHistory } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  const history = useHistory();

  const handleNavigate = (path: string) => {
    history.push(path);
  };

  return (
    <div className="bottom-nav">
      <IoHomeSharp onClick={() => handleNavigate("/home")} />
      <GiGymBag onClick={() => handleNavigate("/activity")} />
      <IoBarbell onClick={() => handleNavigate("/training")} />
      <IoCamera onClick={() => handleNavigate("/progressphotos")} />
      <IoPerson onClick={() => handleNavigate("/profile")} />
    </div>
  );
};

export default BottomNavigation;
