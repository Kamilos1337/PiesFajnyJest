import React from 'react';
import '../app.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
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
      RegisterRules2: false,
      RegisterAll: false,
      resetLink:false,
      resetEmail:'',
      forgotPass:false,
      resetActive:false,
      emailReset:'',
      newPasswd:'',
      resetPassToken:'',
      resetpassword1:'',
      resetpassword2:'',
      firstTime:localStorage.getItem('firstLogIn'),
      userLogin: localStorage.getItem('userLogin')
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.sendLink = this.sendLink.bind(this);
    this.forgotPass = this.forgotPass.bind(this);
    this.changePass = this.changePass.bind(this);
    this.finalReset = this.finalReset.bind(this);
  }

componentDidMount(){
  var GetCurrentURL=window.location.href;
  var CheckCurrentURL = GetCurrentURL.indexOf("?validate")
  var CheckCurrentURL2 = GetCurrentURL.indexOf("?reset")
  if(CheckCurrentURL>-1){
    var GetToken = GetCurrentURL.slice(CheckCurrentURL+10, GetCurrentURL.length);
    history.pushState({}, null, "/");
    fetch('/api/validateAcc', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token:GetToken
    }),
  })
  .then(resp => resp.json())
  .then(resp => {
    if(resp.Error=="Link użyty"){
      NotificationManager.error("Podany link aktywacyjny został już użyty.", "Nie udało się!")
    }

    if(resp.Error=="Niepoprawny link"){
      NotificationManager.error("Podany link aktywacyjny jest niepoprawny.", "Nie udało się!")
    }

    if(resp.Success=="Potwierdzone konto"){
      NotificationManager.success("Twoje konto zostało aktywowane! Zaloguj się aby w pełni z niego korzystać." ,"Udało się!")
    }


  })
  }
  if(CheckCurrentURL2>-1){
    var GetToken2 = GetCurrentURL.slice(CheckCurrentURL2+7, GetCurrentURL.length);
    history.pushState({}, null, "/");
    fetch('/api/validateReset', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token:GetToken2
    }),
  })
  .then(resp => resp.json())
  .then(resp => {
    if(resp.Error=="Niepoprawny link"){
      NotificationManager.error("Podany link resetujący jest niepoprawny.", "Nie udało się!")
    }

    if(resp.Success=="Zmiana hasla"){
      this.setState({modal:true, resetPassToken:resp.Code, resetActive:true});
    }


  })
  }
}

finalReset(){
console.log(this.state.resetpassword1)
  fetch('/api/finalReset', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pass1: this.state.resetpassword1,
    pass2: this.state.resetpassword2,
    resetPassToken: this.state.resetPassToken,
  }),
})
.then(resp => resp.json())
.then(resp => {
  if(resp.Error=="Zly kod"){
    NotificationManager.error("Podany kod resetujący jest zły." ,"Nie udało się!")
  }

  if(resp.Error=="Za krotkie hasla"){
    NotificationManager.error("Nowe hasło jest za krótkie!" ,"Nie udało się!")
  }

  if(resp.Error=="Zle hasla"){
    NotificationManager.error("Podane hasła się różnią!" ,"Nie udało się!")
  }

  if(resp.Success=="Haslo zmienione!"){
    NotificationManager.success("Hasło zostało zmienione! Zaloguj się aby w pełni korzystac z konta." ,"Udało się!")
    localStorage.setItem('userPass', resp.Pass);
    this.setState({resetActive:false});
  }

  if(resp.Error=="Nie udalo sie zmienic hasla!"){
    NotificationManager.error("Nie udało się zmienić hasła!" ,"Error")
  }

  }).catch(function() {
    NotificationManager.error("Aby zmienić hasło musisz odczekać 30 minut.", "Nie udało się!")
   });
}
sendLink(){
  this.setState({resetLink:false})
  NotificationManager.success("Nowy link weryfikacjyny został wysłany na podany adres email." ,"Udało się!")
  fetch('/api/sendLink', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: this.state.resetEmail,
  }),
})
.then(resp => resp.json())
.then(resp => {
  if(resp.Error=="Potwierdzone jest"){
    NotificationManager.error("Podany email jest zweryfikowany, zaloguj się aby w pełny używać konta." ,"Nie udało się!")
  }

  if(resp.Error=="Zmieniony"){
    NotificationManager.success("Nowy link weryfikacyjny został wysłany na podany adres email!" ,"Udało się!")
  }

  }).catch(function() {
    NotificationManager.error("Aby zresetować link musisz odczekać 30 minut.", "Nie udało się!")
   });
}

forgotPass(){
  this.setState({forgotPass:!this.state.forgotPass})
}

changePass(){
  fetch('/api/resetPass', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: this.state.emailReset,
  }),
})
.then(resp => resp.json())
.then(resp => {
  console.log(resp);
  if(resp.Error=="Brak maila"){
    NotificationManager.error("Podany email jest niepoprawny, spróbuj ponownie!" ,"Nie udało się!")
  }

  if(resp.Success=="Wysłany kod na maila"){
    NotificationManager.success("Na podany adres email został wysłany link umożliwiający zmianę hasła." ,"Udało się!")
  }

  }).catch(function() {
    NotificationManager.error("Aby zresetować hasło musisz odczekać 30 minut.", "Nie udało się!")
   });
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

  toggleChangeRules2 = () => {
    this.setState({
      RegisterRules2: !this.state.RegisterRules2,
    });
  }

    toggleChangeBoth = () => {
      if(this.state.RegisterAll==false){
        this.setState({
          RegisterRules: true,
          RegisterAds: true,
          RegisterAll: true,
          RegisterRules2: true,
        });
      }else{
        this.setState({
          RegisterRules: false,
          RegisterAds: false,
          RegisterAll: false,
          RegisterRules2: false,
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
      modal: !prevState.modal,
      resetActive:false
    }));
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      resetActive:false
    });
  }




Register(){
  if(this.state.RegisterRules==true && this.state.RegisterRules2==true){
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
  console.log(resp);
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
      CheckRegister == true ? NotificationManager.success("Wysłaliśmy kod aktywacyjny na podany adres email w celu potwierdzenia konta." ,resp.Name+", udało się!")  : null



  }).catch(function(){
      NotificationManager.error("Zbyt wiele prób rejestracji, spróbuj ponownie za 30 minut!", "Nie udało się!")
  });
}else{
  NotificationManager.error("Aby się zarejestrować, musisz potwierdzić nasz regulamin oraz politykę prywatności!", "Nie udało się!")
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

      if(resp.Error=="Potwierdz email"){
        NotificationManager.error("Aby zalogować się na konto, musisz je aktywować poprzez link który wysłaliśmy na podany adres email!", "Nie udało się!");
        this.setState({resetLink:true, resetEmail:this.state.email})
      }
      if(resp.Error=="Podany email nie istnieje!" || resp.Error=="Podane hasło jest niepoprawne!"){
        NotificationManager.error("Podany email lub hasło jest niepoprawny. Spróbuj ponownie lub użyj funkcji odzyskiwania hasła.", "Niepoprawne dane!");
      }
      if(CheckLogin=="Użytkownik zalogowany!"){
        this.toggle()
        localStorage.setItem('userLogin', resp.Name);
        localStorage.setItem('userPass', resp.Password);
        localStorage.setItem('userEmail', resp.Email);
        localStorage.setItem('firstTime', "Yes");
        window.location.reload();
      }



  })
}


  render() {
    return (
      <div className="NavButtons">

        <Button color="danger"  onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        {this.state.resetActive==true ? <ModalHeader toggle={this.toggle}>Zmiana hasła</ModalHeader> : <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>}
          {this.state.resetActive==true ?
                <ModalBody>
                <p>Nowe hasło musi mieć conajmniej 6 znaków!</p>
                <FormGroup>
                  <Input type="password" name="resetpassword1" value={this.state.value} onChange={this.handleChange} placeholder="Podaj Hasło" />
                </FormGroup>
                <FormGroup>
                  <Input type="password" name="resetpassword2"  value={this.state.value} onChange={this.handleChange}placeholder="Powtórz hasło" />
                </FormGroup>
                </ModalBody>
                :
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
                      Akceptuję <a target="_BLANK" href="/pomoc/regulamin.pdf"><span className="rules">regulamin</span></a><span className="rules"></span>
                    </Label>
                    <Label check>
                      <Input type="checkbox" checked={this.state.RegisterRules2}
                      onChange={this.toggleChangeRules2} />{' '}
                      Akceptuję <a target="_BLANK" href="/pomoc/polityka_prywatnosci.pdf"><span className="rules">politykę prywatności</span></a><span className="rules"></span>
                    </Label>
                    </div>
                  :
                  <div>
                  <p className="LoginItems" onClick={this.forgotPass}>Nie pamiętam hasła</p>
                  {this.state.resetLink==true ?<p onClick={this.sendLink} className="LoginItems">Wyślij nowy link aktywacyjny na podany adres email</p>:null  }
                  </div>
                  }
                  { this.state.forgotPass==true ?
                    <div>
                    <p> Zmień hasło za pomocą maila:</p>
                    <FormGroup>
                      <Input type="email" name="emailReset"  value={this.state.value} onChange={this.handleChange} placeholder="Podaj adres email do konta" />
                    </FormGroup>
                    <FormGroup>
                      <Button color="danger" className="loginSubmit" onClick={this.changePass}>ZMIEŃ HASŁO</Button>
                    </FormGroup>
                    </div>
                    :null
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
          }

          <ModalFooter>
          {this.state.resetActive==true ? <div>
          <Button color="danger" className="loginSubmit" onClick={this.finalReset}>Zmień hasło</Button>
          </div>
          :
          <div>
          {this.props.register ?
            <Button color="danger" className="loginSubmit" onClick={this.Register.bind(this)}>{this.props.inputSubmit}</Button>
          : <Button color="danger" className="loginSubmit" onClick={this.Login.bind(this)}>{this.props.inputSubmit}</Button>}
          </div>
        }
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default LoginModal;
