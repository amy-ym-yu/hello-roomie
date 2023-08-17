import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');
    return ( 
    <div className="header">
        <h1 style={{color: 'white', fontFamily: 'DM Serif Text', letterSpacing: '10px'}} 
        onClick={handleClick}
        >   hello roomie</h1>
    </div>
        
)}

export default Header;