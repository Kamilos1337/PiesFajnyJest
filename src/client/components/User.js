import React from 'react';
import "./LoginModal";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: localStorage.getItem('userLogin'),
      userEmail:localStorage.getItem('userEmail'),
      firstTime:localStorage.getItem('firstTime')
     };


  }


  getUserLogin(){
    return this.state.userLogin;
  }

  getUserEmail(){
    return this.state.userEmail;
  }

  getFirstTime(){
    return this.state.firstTime;
  }


  logout(){
    localStorage.clear();
    window.location.reload();
  }





}
