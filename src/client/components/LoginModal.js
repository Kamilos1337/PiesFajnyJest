import React from 'react';
import '../app.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      email: "",
      password: "",
      password2: "",
      dateTime: "",
      infoEmail:"",
      infoLogin:"",
      infoPassword:"",
      infoPasswords:"",
      CheckRegister:"",
      dropdownOpen: false,
      emailColor:"",
      RegisterAds: false,
      RegisterRules: false,
      RegisterAll: false,
      firstTime:localStorage.getItem('firstLogIn'),
      userLogin: localStorage.getItem('userLogin')
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);

  }


  toggleChangeAds = () => {
    this.setState({
      RegisterAds: !this.state.RegisterAds,
    });
  }

  toggleChangeRules = () => {
    this.setState({
      RegisterRules: !this.state.RegisterRules,
    });
  }

    toggleChangeBoth = () => {
      if(this.state.RegisterAll==false){
        this.setState({
          RegisterRules: true,
          RegisterAds: true,
          RegisterAll: true,
        });
      }else{
        this.setState({
          RegisterRules: false,
          RegisterAds: false,
          RegisterAll: false,
        });
      }

  }



  handleChange(event) {
    const target = event.target;
    var value = target.value;
    var name = target.name;
    this.setState({
     [name]: value
    });
 }
  toggle() {
    this.setState(prevState => ({
      name:"",
      email: "",
      password: "",
      password2: "",
      modal: !prevState.modal
    }));
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }




Register(){
  if(this.state.RegisterRules==true){
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  if(month<10){
    month = "0"+month;
  }
  var year = new Date().getFullYear(); //Current Year
  var FullDate = date + "." + month + "." + year;
  this.setState(prevState => ({infoEmail:"", infoLogin:"", infoPassword:"", CheckRegister:"", infoPasswords:"", emailColor:""}));
  fetch('/api/register', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: this.state.name,
    email: this.state.email,
    password: this.state.password,
    password2: this.state.password2,
    dateTime: FullDate,
    RegisterAds: this.state.RegisterAds
  }),
})
.then(resp => resp.json())
.then(resp => {
      var infoEmail = resp.infoEmail;
      var infoLogin = resp.infoLogin;
      var infoPassword = resp.infoPassword;
      var infoPasswords = resp.infoPasswords;
      var CheckRegister = resp.RegisterSuccess;

      infoEmail == "Podany email jest nieprawidłowy!" ?  this.setState({infoEmail: infoEmail}) : this.setState({emailColor: 'greenyellow'});
      infoLogin == "Podane imię jest za krótkie!" ?  this.setState({infoLogin:infoLogin})  : this.setState({emailColor: 'greenyellow'});
      infoPassword == "Podane hasło jest za krótkie!" ?  this.setState({infoPassword:infoPassword})  : this.setState({emailColor: 'greenyellow'});
      infoPasswords == "Podane hasła się różnią!" ?  this.setState({infoPasswords:infoPasswords})  : this.setState({emailColor: 'greenyellow'});
      CheckRegister == "Podany email jest zajęty!" ?  this.setState({CheckRegister:CheckRegister})  : null
      CheckRegister == true ?   this.toggle() : null
      CheckRegister == true ? NotificationManager.success("Twoje konto zostało założone. Zachęcamy do aktywnego korzytania z naszej strony." ,resp.Name+", udało się!")  : null



  }).catch(function(){
      NotificationManager.error("Zbyt wiele prób rejestracji, spróbuj ponownie za 30 minut!", "Nie udało się!")
  });
}else{
  NotificationManager.error("Aby się zarejestrować, musisz potwierdzić nasz regulamin!", "Nie udało się!")
}
}





Login(){
  this.setState(prevState => ({infoEmail:"", infoLogin:"", infoPassword:"", CheckRegister:"", infoPasswords:"", emailColor:""}));
  fetch('/api/login', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: this.state.email,
    password: this.state.password
  }),
})
.then(resp => resp.json())
.then(resp => {

      var CheckLogin = resp.Login;



      if(CheckLogin=="Użytkownik zalogowany!"){
        this.toggle()
        localStorage.setItem('userLogin', resp.Name);
        localStorage.setItem('userPass', resp.Password);
        localStorage.setItem('userEmail', resp.Email);
        localStorage.setItem('firstTime', "Yes");
        window.location.reload();
      }else{
         NotificationManager.warning("Podany email lub hasło jest niepoprawny. Spróbuj ponownie lub użyj funkcji odzyskiwania hasła.", "Niepoprawne dane!");
      }



  })
}


  render() {
    return (
      <div>

        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            {this.props.register ?
            <FormGroup>
              <Input type="text" name="name" value={this.state.value} onChange={this.handleChange}  placeholder="Podaj swoje imię" />
              <p className="formInfo">{this.state.infoLogin}</p>
            </FormGroup>
            : null}
            <FormGroup>
              <Input type="email" name="email"  value={this.state.value} onChange={this.handleChange} placeholder="Podaj Email" />
              <p className="formInfo">{this.state.infoEmail} {this.state.CheckRegister}</p>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" value={this.state.value} onChange={this.handleChange} placeholder="Podaj Hasło" />
              <p className="formInfo">{this.state.infoPassword}</p>
            </FormGroup>
            {this.props.register ?
            <FormGroup>
              <Input type="password" name="password2"  value={this.state.value} onChange={this.handleChange}placeholder="Powtórz hasło" />
              <p className="formInfo">{this.state.infoPasswords}</p>
            </FormGroup>
            : null}
            <FormGroup check>
            {this.props.register ?
              <div className="displayGrid">
              <Label check>
                <Input type="checkbox" checked={this.state.RegisterBoth}
                onChange={this.toggleChangeBoth} />{' '}
                Zaznacz wszystko
              </Label>
              <Label check>
                <Input type="checkbox" checked={this.state.RegisterRules}
                onChange={this.toggleChangeRules} />{' '}
                Akceptuje <a href="regulamin.pdf"><span className="rules">regulamin</span></a><span className="rules">*</span>
              </Label>
              </div>
            :
            <Label check>
              <Input type="checkbox" />{' '}
              Zapamiętaj mnie
            </Label>
            }
            {this.props.register ?
              <Label check>
                <Input type="checkbox" checked={this.state.RegisterAds}
                onChange={this.toggleChangeAds} id="profileAds" name="radio1" />{' '}
               Chcę otrzymywać maile o nowych funkcjach, interesujących akcjach oraz tym podobnym od PiesFajnyJest.pl.
              </Label>
            : null}

           </FormGroup>
          </ModalBody>
          <ModalFooter>
          {this.props.register ?
            <Button color="danger" className="loginSubmit" onClick={this.Register.bind(this)}>{this.props.inputSubmit}</Button>
          : <Button color="danger" className="loginSubmit" onClick={this.Login.bind(this)}>{this.props.inputSubmit}</Button>}
          </ModalFooter>
        </Modal>
          <NotificationContainer/>
      </div>
    );
  }
}

export default LoginModal;
