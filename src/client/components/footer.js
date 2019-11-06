import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';
import { IoLogoYoutube, IoLogoFacebook } from 'react-icons/io';
import { FiInstagram } from 'react-icons/fi';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

     };
}
     render(props){
       return(
         <div className="footer">
           <Container>
             <Row className="footerRow">
               <Col>

                <p><Link to="/konto">Profil</Link></p>
                <p><Link to="#contact">Kontakt</Link></p>
                <p><Link to="/dodajpost">Dodaj ogłoszenie</Link></p>
                <p><Link to="/ogloszenia">Zobacz ogłoszenia</Link></p>
               </Col>

               <Col>
                <p><Link to="/regulamin.pdf">Regulamin</Link></p>
                <p><Link to="/regulamin.pdf">Pomoc</Link></p>
                <p><Link to="/regulamin.pdf">Polityka prywatności</Link></p>
               </Col>

               <Col>
               <p className="icon" href="https://www.facebook.com/IPIESFAJNYJEST/"> <IoLogoFacebook/> </p>


               </Col>

               <Col>

               <p className="icon" href="https://www.instagram.com/imeandog"> <FiInstagram/> </p>


               </Col>

               <Col>

               <p className="icon" href="https://www.youtube.com/channel/UCtxw386WzCdHjVP2L5mTV1Q"> <IoLogoYoutube/> </p>

               </Col>

             </Row>

             <Row className="FooterDesc">
              <Col>
              <p>&#9426; PiesFajnyJest 2019, wszelkie prawa zastrzeżone.</p>
                <p>
                PiesFajnyJest.pl to narzędzie do wspólnego pomagania psom. Głównym celem strony jest rozpowrzechnanie wszelkich treści związanych z czworonogami. Jesteśmy wirtualnym miejscem w którym miłośnicy psów mogą wspólnie działać na rzecz dobra psów i nie tylko! A więc nie czekaj, twórz posty, udostępniaj, a przede wszystkim nieś pomoc zwierzakom które tego potrzebują!
                </p>
              </Col>
             </Row>
           </Container>
         </div>
       );
     }





}
