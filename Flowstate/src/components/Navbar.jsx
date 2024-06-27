import React from 'react'
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
        <NavLink to="/">
            <i className="fa-solid fa-house fa-4x" ></i>
        </NavLink>
        <NavLink to="/calendar">
            <i className="fa-solid fa-calendar fa-4x"></i>
        </NavLink>
        <NavLink to="/timer">
            <i className="fa-solid fa-clock fa-4x"></i>
        </NavLink>
    </>
  );
}
