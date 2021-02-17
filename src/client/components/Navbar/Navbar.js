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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Container, Row, Col } from 'reactstrap';
import LoginModal from '../LoginModal';
import User from '../User';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

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
          <NavbarBrand href="/"><CardImg src="/public/logo.png" className="logo mr-auto" alt="Card image cap" /></NavbarBrand>

          <NavbarToggler onClick={this.toggle} className="mr-2"/>
          <Collapse isOpen={this.state.isOpen} navbar>
          {this.state.userName ?
              <Nav className="ml-auto" navbar>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
       <DropdownToggle className="btn btn-danger" caret>
        <CardImg src="/public/love.svg" className="loveImg" alt="Card image cap" /> {this.state.userName}
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem header>Panel użytkownika</DropdownItem>
        <DropdownItem> <Link to="/konto" className="black">Mój profil</Link></DropdownItem>
         <DropdownItem divider />
         <DropdownItem><Link to="/dodajpost" className="black">Dodaj ogłoszenie</Link></DropdownItem>
         <DropdownItem><Link to="/posty/1" className="black">Zobacz ogłoszenia</Link></DropdownItem>
         <DropdownItem onClick={ () => this.logout(this) }>Wyloguj</DropdownItem>
       </DropdownMenu>
     </Dropdown>
              </Nav>
             :
              <Nav className="mojaklasa ml-auto"navbar>
              <NavItem className="RegisterLogin responseButton" >
              <LoginModal
              buttonLabel="Zaloguj się"
              title="Logowanie"
              inputSubmit="Zaloguj się"
              className=" responseButton"
              />
              </NavItem>
              <NavItem className="LoginRegister responseButton" >
              <LoginModal
              buttonLabel="Zarejestruj się"
              title="Rejestracja"
              inputSubmit="Zarejestruj się"
              register="register"
              className=" responseButton"
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
