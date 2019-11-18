import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';
import Banner from './img/Banner.png';
import BannerLove from './img/Bannerlove.png';
import Star from './img/star.png';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

     };
}
     render(props){


       return(
         <div className="BannerDiv">
           <Container className="BannerContainer">
           <Row className="BannerRow">
              <Col>
              <p className="BannerTitle">  <img className="Banner2" src={Star} alt="PiesFajnyJest, wspieraj, adoptuj, pomagaj!" /> <span className="textBanner">PiesFajnyJest - Trochę o nas</span></p>
              <p className="BannerDesc">Główną inicjatywą naszej działalności było stworzenie miejsca, w którym miłosnicy psów będą mogli wspólnie działać na rzecz dobra czworonogów. Jeśli kochasz te cudowne istoty i chcesz nieść pomoc w ich kierunku to trafiłeś idealnie! Na naszej stronie możesz dodawać oraz przeglądać posty o różnej kategorii. Dodatkowo zachęcamy do dodawania zdjeć swoich psów na naszej 'psiej ścianie' która znajduję się poniżej! </p>

              </Col>

              <Col>
                <img className="Banner" src={BannerLove} alt="PiesFajnyJest, wspieraj, adoptuj, pomagaj!" />
              </Col>
           </Row>
             <Row className="BannerRow">
                <Col>
                  <img className="Banner" src={Banner} alt="PiesFajnyJest, wspieraj, adoptuj, pomagaj!" />
                </Col>

                <Col>
                <p className="BannerTitle">  <img className="Banner2" src={Star} alt="PiesFajnyJest, wspieraj, adoptuj, pomagaj!" /> <span className="textBanner">PiesFajnyJest - Warto Pomagać!</span></p>
                <p className="BannerDesc">Na naszej cudownej planecie żyje wiele milionów psów, nas - miłośników tych istot bardzo to cieszy, niestety wiele z nich żyje w bardzo złych warunkach, głodują, marzną, cierpią. Panująca znieczulica ludzi odbija się na losie czworonogów, przez co nie otrzymują odpowieniej pomocy. Dlatego jesteśmy my! Ludzie którzy chcą pomagać tym biednym zwierzakom, nie ważne czy jest to rasowy pekińczyk, czy też kundelek. Dlatego zachęcamy do udzielania się na stronie!</p>

                </Col>
             </Row>
           </Container>
         </div>
       );
     }





}
