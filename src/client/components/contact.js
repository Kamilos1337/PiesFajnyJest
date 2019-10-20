import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';
import Contact from './img/contact.png';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

     };
}
     render(props){
       return(
         <div className="">
           <Container>
             <Row className="contactRow status">
               <Col className="contactCOL">
                <img className="contactIMG" src={Contact} alt="Skontaktuj się z piesfajnyjest.com"/>
                  <FormGroup className="styleInput marginTop20">
                   <Input type="text" className="inputBor" name="contactTitle" id="contactTitle" placeholder="Podaj temat..." />
                 </FormGroup>
                 <FormGroup className="styleInput">
                  <Input type="textarea" className="inputBor" name="contactDesc" id="contactDesc" placeholder="Podaj opis..." />
                </FormGroup>
               </Col>
             </Row>
           </Container>
         </div>
       );
     }





}
