import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Card, Container, Row, Col, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import Main from './img/main.png';
import Dog2 from './img/dog2.svg';
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
<CardImg src={Main} className="mainImage" alt="Card image cap" />
<span className="containerMain">
<p className="mainCenterText">PIES FAJNY JEST</p>

<span className="dog2Center">
<CardImg src={Dog2} className="dog2Image" alt="Card image cap" />
<CardImg src={Dog2} className="dog2Image" alt="Card image cap" />
<CardImg src={Dog2} className="dog2Image" alt="Card image cap" />
</span>
<Button className="mainCenterTextButton" color="danger" >ZOBACZ OGŁOSZENIA</Button>
<Button className="mainCenterTextButton" color="danger" ><Link to="/dodajpost">DODAJ OGŁOSZENIE</Link></Button>


</span>
    </div>
    );
  }

}
