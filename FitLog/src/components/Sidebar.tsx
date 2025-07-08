import React, { useState } from "react";
import "./Sidebar.css";
import { IoHomeSharp, IoPerson, IoCamera, IoBarbell } from "react-icons/io5";
import { GiGymBag } from "react-icons/gi";
import { useHistory } from "react-router-dom";

const Sidebar: React.FC<{ onToggle: (open: boolean) => void }> = ({
  onToggle,
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle(newOpen);
  };

  const handleNavigate = (path: string) => {
    history.push(path);
    handleToggle(); // Sidebar nach Navigation schließen
  };

  return (
    <>
      {!open && (
        <div className="top-right-toggle" onClick={handleToggle}>
          <img src="/logo.png" alt="Logo" className="toggle-logo" />
        </div>
      )}

      <div className={`side-drawer ${open ? "open" : ""}`}>
        <div className="logo-circle" onClick={handleToggle}>
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="nav-icons">
          <IoHomeSharp onClick={() => handleNavigate("/home")} />
          <GiGymBag onClick={() => handleNavigate("/activity")} />
          <IoBarbell onClick={() => handleNavigate("/training")} />
          <IoCamera onClick={() => handleNavigate("/progressphotos")} />
          <IoPerson onClick={() => handleNavigate("/profile")} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
