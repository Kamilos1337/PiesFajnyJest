import React from 'react';
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
import Facebook from '../img/Facebook.png';
import Instagram from '../img/Instagram.png';


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
      <div className="Navbar100Div">
       <Container className="navContainer100">

        <Navbar color="da" light expand="md">
          <NavbarBrand href="/">  <CardImg src={Logo} className="logo" alt="Card image cap" /></NavbarBrand>

          <NavItem className="socialIconsLI marginRight20">
          <a target="_BLANK" href="https://www.facebook.com/IPIESFAJNYJEST">
          <CardImg href="https://asd.com" src={Facebook} className="socialIcons marginRight20" alt="Card image cap" />
          </a>
          <a target="_BLANK" href="https://www.instagram.com/imeandog/">
          <CardImg src={Instagram} className="socialIcons" alt="Card image cap" />
          </a>
           </NavItem>


          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          {this.state.userName ?
              <Nav className="ml-auto" navbar>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
       <DropdownToggle className="btn btn-danger" caret>
        <CardImg src={Love} className="loveImg" alt="Card image cap" /> {this.state.userName}
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem header>Header</DropdownItem>
         <DropdownItem>Some Action</DropdownItem>
         <DropdownItem disabled>Action (disabled)</DropdownItem>
         <DropdownItem divider />
         <DropdownItem>Foo Action</DropdownItem>
         <DropdownItem>Bar Action</DropdownItem>
         <DropdownItem onClick={ () => this.logout(this) }>Wyloguj</DropdownItem>
       </DropdownMenu>
     </Dropdown>
              </Nav>
             :
              <Nav className="ml-auto" navbar>
              <NavItem className="LoginRegister loginBTTN"  >
              <LoginModal
              buttonLabel="Zaloguj się"
              title="Logowanie"
              inputSubmit="Zaloguj się"
              />
              </NavItem>
              <NavItem className="LoginRegister registerBTTN" >
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
