import React from "react";
import './Header.css'
import todo from '../../assets/img/todo.svg';

const Header = () => {
  return (
  <header className="header">
    <img className="logo" src={todo} alt="To do ikon" />
  </header>
  );
};

export default Header;
