import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
           <Container className="allFooter">
             <Row className="footerRow">
               <Col>

                <p><a href="/konto">Profil</a></p>
                <p><Link to="/dodajpost">Dodaj ogłoszenie</Link></p>
                <p><Link to="/posty/1">Zobacz ogłoszenia</Link></p>
               </Col>

               <Col>
                <p><a href="/pomoc/regulamin.pdf" target="_blank">Regulamin</a></p>
                <p><a href="/pomoc/polityka_prywatnosci.pdf" target="_blank">Polityka prywatności</a></p>
               </Col>

               <Col>
               <p className="icon"><a target="_blank" href="https://www.facebook.com/IPIESFAJNYJEST/"><IoLogoFacebook/></a></p>


               </Col>

               <Col>

               <p className="icon"><a target="_blank" href="https://www.instagram.com/imeandog"><FiInstagram/></a></p>


               </Col>

               <Col>

               <p className="icon" ><a target="_blank" href="https://www.youtube.com/channel/UCtxw386WzCdHjVP2L5mTV1Q"> <IoLogoYoutube/> </a></p>

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
