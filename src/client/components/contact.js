import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        ctName:'',
        ctEmail:'',
        ctTitle:'',
        ctDesc:'',
        RegisterRules:false
     };
     this.handleChange = this.handleChange.bind(this);
     this.sendMail = this.sendMail.bind(this);
}
handleChange(event) {
  const target = event.target;
  var value = target.value;
  var name = target.id;
  this.setState({
   [name]: value
  });
}
toggleChangeRules = () => {
  this.setState({
    RegisterRules: !this.state.RegisterRules,
  });
}
sendMail(){
if(this.state.RegisterRules==true){
  fetch('/api/contactMail', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ctName:this.state.ctName,
    ctEmail:this.state.ctEmail,
    ctTitle: this.state.ctTitle,
    ctDesc: this.state.ctDesc
  }),
})
.then(resp => resp.json())
.then(resp => {
  console.log(resp);
  if(resp.Success=="Mail wyslany"){
    NotificationManager.success("Twój mail został wysłany, odpowiemy Ci na podany przez Ciebię adres email: "+resp.mail, "Udało się!")
    this.setState({ctName:'', ctEmail:'', ctTitle:'', ctDesc:''})
  }

  if(resp.Error=="Zly email"){
    NotificationManager.error("Podaj poprawny email.", "Nie udało się!")
  }

  if(resp.Error=="brak tytulu"){
    NotificationManager.error("Podaj poprawny tytuł.", "Nie udało się!")
  }
  if(resp.Error=="brak opisu"){
    NotificationManager.error("Podaj poprawny opis.", "Nie udało się!")
  }

  if(resp.Error=="brak imienia"){
    NotificationManager.error("Podaj poprawne imię.", "Nie udało się!")
  }


  if(resp.Error=="dlugi tytul"){
    NotificationManager.error("Tytuł może zawierać maksymalnie 50 znakow", "Nie udało się!")
  }

  if(resp.Error=="dlugie imie"){
    NotificationManager.error("Imie może zawierać maksymalnie 20 znakow", "Nie udało się!")
  }

  if(resp.Error=="dlugi opis"){
    NotificationManager.error("Opis może zawierać maksymalnie 10000 znakow", "Nie udało się!")
  }


}).catch(function() {
  NotificationManager.error("Aby wysłać kolejne mail musisz odczekać 30 minut.", "Nie udało się!")
 });
}else{
  NotificationManager.error("Aby wysłać wiadomość musisz zaakceptować politykę prywatności!,","Nie udało się!")
}

}
     render(props){
       return(
         <div className="" id="contact">
           <Container>
             <Row className="contactRow status">
               <Col className="contactCOL">
                <img className="contactIMG" src="/public/contact.png" alt="Skontaktuj się z piesfajnyjest.com"/>
                <FormGroup className="styleInput marginTop20">
                 <Input type="text" className="inputBor" value={this.state.ctName} onChange={this.handleChange} id="ctName" placeholder="Podaj imię..." />
               </FormGroup>
               <FormGroup className="styleInput marginTop20">
                <Input type="email" className="inputBor" value={this.state.ctEmail}  onChange={this.handleChange} id="ctEmail" placeholder="Podaj email..." />
              </FormGroup>
                  <FormGroup className="styleInput marginTop20">
                   <Input type="text" className="inputBor" value={this.state.ctTitle} onChange={this.handleChange}  id="ctTitle" placeholder="Podaj temat..." />
                 </FormGroup>
                 <FormGroup className="styleInput">
                  <Input type="textarea" className="inputBor" value={this.state.ctDesc} onChange={this.handleChange} id="ctDesc" placeholder="Podaj opis..." />
                </FormGroup>
                <FormGroup className="accRules">
                <Input type="checkbox" checked={this.state.RegisterRules}
                onChange={this.toggleChangeRules} />{' '}
                 <a target="_BLANK" href="/pomoc/polityka_prywatnosci.pdf">Akceptuję politykę prywatności</a><span className="rules"></span>
                </FormGroup>
                  <Button color="danger"  className="sendMessage" onClick={this.sendMail}>Wyślij wiadomość</Button>
               </Col>
             </Row>
           </Container>
         </div>
       );
     }





}
