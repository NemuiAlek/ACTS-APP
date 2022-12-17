import { useEffect, useState, useContext } from "react";
import {Link} from "react-router-dom";

const linkStyle = {
    textDecoration: "none",
    color: 'black',
    'fontWeight': 'bold',
}

export default function About(){
    return (
        <div className="homePage">
    
        <h1>About</h1>
        <p><Link to={"/"} style={linkStyle}>Home</Link></p>
    
        </div>
    )
    }