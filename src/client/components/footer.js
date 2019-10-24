import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';

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
             <Row>
               Zmiana u kamila
             </Row>
           </Container>
         </div>
       );
     }





}
