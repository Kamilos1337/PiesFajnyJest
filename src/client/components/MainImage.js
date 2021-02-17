import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Card, Container, Row, Col, CardImg, Button } from 'reactstrap';
import Nav from './Navbar/Navbar';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: localStorage.getItem('userLogin'),
      userEmail:localStorage.getItem('userEmail'),
      firstTime:localStorage.getItem('firstTime')
     };
  }




  render(props) {
    return (
      <div className="mainDiv">
<Nav/>
<CardImg src="/public/main.jpg" className="mainImage" alt="Card image cap" />
<span className="containerMain">
<p className="mainCenterText">PIES FAJNY JEST</p>

<span className="dog2Center">
<CardImg src="/public/dog2.svg" className="dog2Image" alt="Card image cap" />
<CardImg src="/public/dog2.svg" className="dog2Image" alt="Card image cap" />
<CardImg src="/public/dog2.svg" className="dog2Image" alt="Card image cap" />
</span>
<div className="mainButtons">
<Button className="mainCenterTextButton" color="danger" ><Link to="/posty/1">ZOBACZ OGŁOSZENIA</Link></Button>
<Button className="mainCenterTextButton" color="danger" ><Link to="/dodajpost">DODAJ OGŁOSZENIE</Link></Button>
</div>

</span>
    </div>
    );
  }

}
