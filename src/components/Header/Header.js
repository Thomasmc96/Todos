import React from "react";
import './Header.css'
import todo from '../../assets/img/todo.svg';
import { Link } from "react-router-dom";

const Header = () => {
  return (
  <header className="header">
    <Link to={'/'}><img className="logo" src={todo} alt="To do ikon" /></Link>
    
  </header>
  );
};

export default Header;
