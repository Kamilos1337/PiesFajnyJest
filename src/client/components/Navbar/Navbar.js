import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Card,
  CardImg,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Container, Row, Col } from 'reactstrap';
import LoginModal from '../LoginModal';
import User from '../User';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Love from '../img/love.svg';
import Logo from '../img/logo.png';

export default class MyNavbar extends User {
  constructor(props) {
    super(props);
    this.Welcome = this.Welcome.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    setTimeout(this.Welcome, 200);
    this.state = {
      isOpen: false,
      userName: this.getUserLogin(),
      userEmail: this.getUserEmail(),
      firstTime: this.getFirstTime(),
      dropdownOpen: false,
      info:""
    };
  }

  Welcome(){

    if(this.state.firstTime=="Yes"){
      NotificationManager.success('Zalogowano pomyślnie! Możesz teraz w pełni korzystać z naszej strony.', this.state.userName+', gratulacje!');
      localStorage.removeItem('firstTime');
    }

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
 }


  render(props) {
    return (
      <div>
       <Container className="navContainer">

        <Navbar color="da" light expand="md">
          <NavbarBrand href="/"><CardImg src={Logo} className="logo" alt="Card image cap" /></NavbarBrand>

          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          {this.state.userName ?
              <Nav className="ml-auto" navbar>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
       <DropdownToggle className="btn btn-danger" caret>
        <CardImg src={Love} className="loveImg" alt="Card image cap" /> {this.state.userName}
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem header>Panel użytkownika</DropdownItem>
        <DropdownItem> <Link to="/konto" className="black">Mój profil</Link></DropdownItem>
         <DropdownItem divider />
         <DropdownItem>Dodaj ogłoszenie</DropdownItem>
         <DropdownItem>Ustawienia</DropdownItem>
         <DropdownItem onClick={ () => this.logout(this) }>Wyloguj</DropdownItem>
       </DropdownMenu>
     </Dropdown>
              </Nav>
             :
              <Nav className="ml-auto" navbar>
              <NavItem className="LoginRegister" >
              <LoginModal
              buttonLabel="Zaloguj się"
              title="Logowanie"
              inputSubmit="Zaloguj się"
              />
              </NavItem>
              <NavItem className="LoginRegister" >
              <LoginModal
              buttonLabel="Zarejestruj się"
              title="Rejestracja"
              inputSubmit="Zarejestruj się"
              register="register"
              />
              </NavItem>
              </Nav>}
          </Collapse>
        </Navbar>
        <NotificationContainer/>
       </Container>
      </div>
    );
  }
}
