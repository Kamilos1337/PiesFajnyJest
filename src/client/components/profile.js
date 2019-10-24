import React from 'react';
<<<<<<< HEAD
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Card, Row, Col, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, FormGroup, Input, Label } from 'reactstrap';
  import Container from 'react-bootstrap/Container'
  import Badge from 'react-bootstrap/Badge'
import Dog from './img/dog.png';
import Map from './img/map.svg';
import Arrow from './img/right-arrow.png';
import LoadingDog from './img/LoadingDog.gif';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { BrowserRouter, Route, IndexRoute, Link } from 'react-router-dom'
import Navbar100 from './Navbar/Navbar100';

=======
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';
>>>>>>> Profile component

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
      isLoading: true,
      CurrentPage:'ustawienia',
      MainPosts:"Brak postów",
      userName: '',
      userEmail:'',
      userAds:'',
      userCreated:'',
      newPassword1:'',
      newPassword2:'',
      oldPass1:'',
      isChecked: false
     };
     this.LeftArrow = this.LeftArrow.bind(this);
     this.RightArrow = this.RightArrow.bind(this);
     this.displayPostsSlider = this.displayPostsSlider.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.changePassword = this.changePassword.bind(this);
     this.savePreferences = this.savePreferences.bind(this);
}

componentDidMount () {
  this.displayPostsSlider();
  fetch('/api/getProfile', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userEmail:localStorage.getItem('userEmail'),
    userPass:localStorage.getItem('userPass')
  }),
})
.then(resp => resp.json())
.then(resp => {

    if(resp.Info=="Zaloguj się!"){
        window.location.href="/"
    }

    if(resp.Info=="success"){
      this.setState({
        userName:resp.Name,
        userEmail:resp.Email,
        userCreated:resp.Created_At,
        userAds: resp.ads
      });
    }
    if(this.state.userAds=="1"){
      this.setState({
        isChecked:true
      });
    }
  })
}
componentDidUpdate() {
  if(this.state.MainPosts!=="Brak postów" && this.state.isLoading==true){
    this.setState({isLoading: false})
  }
}

toggleChange = () => {
  this.setState({
    isChecked: !this.state.isChecked,
  });
}

savePreferences(){
  fetch('/api/savePreferences', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userEmail:localStorage.getItem('userEmail'),
    userPass:localStorage.getItem('userPass'),
    userAds:this.state.isChecked
  }),
})
.then(resp => resp.json())
.then(resp => {

  if(resp.Info=="success"){
      NotificationManager.success("Twoje preferencje zostały zmienione.", "Udało się!");
  }else{
      NotificationManager.error("Twoje preferencje nie zostały zmienione.", "Nie udało się!");
  }



}).catch(function() {
  NotificationManager.error("Zbyt wiele prób zmiany preferencji, spróbuj ponownie za 30min.", "Nie udało się!");
 });

}

changePassword(){
  if(this.state.newPassword1.length<6){
    NotificationManager.error("Nowe hasło musi zawierać conajmniej 6 znaków!", "Za krótkie hasło!");
  }else if(this.state.newPassword1!==this.state.newPassword2){
    NotificationManager.error("Podane hasła się różnią, proszę spróbuj ponownie!", "Złe hasła!");
  }else{
    fetch('/api/changePassword', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail:localStorage.getItem('userEmail'),
      newPass1:this.state.newPassword1,
      newPass2:this.state.newPassword2,
      oldPass1:this.state.oldPass1
    }),
  })
  .then(resp => resp.json())
  .then(resp => {
    console.log(resp);
    if(resp.Info=="Haslo zmienione!"){
      NotificationManager.success("Gratulacje, twoje hasło zostało zmienione.", "Udało się!");
      localStorage.setItem('userPass', resp.Pass);
    }

    if(resp.Info=="Podane hasło jest niepoprawne!"){
      NotificationManager.error("Aktualne hasło jest nieprawidłowe, proszę spróbuj ponownie!", "Nie udało się!");
    }

    }).catch(function() {
      NotificationManager.error("Zbyt wiele prób zmiany hasła, spróbuj ponownie za 30min.", "Nie udało się!");
     });
  }
}

handleChange(event) {
  const target = event.target;
  var value = target.value;
  var name = target.id;
  this.setState({
   [name]: value
  });
}

LeftArrow(){
  document.getElementsByClassName('react-multiple-carousel__arrow--left')[0].click();
}
RightArrow(){
  document.getElementsByClassName('react-multiple-carousel__arrow--right')[0].click();
}

displayPostsSlider(){
  fetch('/api/displayPostsSliderProfile', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userEmail:localStorage.getItem('userEmail')
  }),
})
.then(resp => resp.json())
.then(resp => {
  var reader = new FileReader();
  for(let Lx=0; Lx<resp.length; Lx++){
    if(resp[Lx].description.length>100){
      resp[Lx].description = resp[Lx].description.slice(0,100) + "...";
    }
  }

  if(resp.Error=="Brak postów"){
  }else{
  this.setState({
    MainPosts: resp,
    isLoading:false
  });

  }
})

}
     render(props){

       const responsive = {
     superLargeDesktop: {
       // the naming can be any, depends on you.
       breakpoint: { max: 4000, min: 3000 },
       items: 5,
     },
     desktop: {
       breakpoint: { max: 3000, min: 1024 },
       items: 3,
     },
     tablet: {
       breakpoint: { max: 1024, min: 464 },
       items: 2,
     },
     mobile: {
       breakpoint: { max: 464, min: 0 },
       items: 1,
     },
   };

       return(
         <div>
         <Navbar100/>
         <div className="profile">
           <Container className="profileContainer">
             <Row className="ProfileRow">
               <Col className="margin10">
               <span className="ProfileItem">Moje dane</span>
               </Col>
             </Row>


             <Row className="ProfileUstawienia">
                <Col>
               <FormGroup>
                  <Input type="text" name="name" id="profileName" value={this.state.userName} disabled placeholder="Twoje imię" />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                   <Input type="email" name="email" id="profilEmail" value={this.state.userEmail} disabled placeholder="Twój email" />
                 </FormGroup>
                </Col>
             </Row>


             <Row className="ProfileUstawienia">
               <Col>
               <FormGroup>
                <Input type="text" name="text" id="profileCreated" value={this.state.userCreated} disabled placeholder="Data utworzenia konta" />
                </FormGroup>
               </Col>

                <Col>
                </Col>
             </Row>

             <Row className="ProfileRow ProfilePref">
               <Col className="margin10">
               <span className="ProfileItem">Moje preferencje</span>
               </Col>
             </Row>


             <Row className="ProfileUstawienia">
                <Col>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" checked={this.state.isChecked}
          onChange={this.toggleChange} id="profileAds" name="radio1" />{' '}
                    Chcę otrzymywać maile o nowych funkcjach, interesujących akcjach oraz tym podobnym od PiesFajnyJest.pl.
                  </Label>
                </FormGroup>
                <Button  className="PreferencjeButton" id="savePreferences" onClick={this.savePreferences} color="danger" >Zapisz preferencje</Button>

                </Col>
             </Row>


             <Row className="ProfileRow ProfilePref">
               <Col className="margin10">
               <span className="ProfileItem">Zmiana hasła</span>
               </Col>
             </Row>


             <Row className="ProfileUstawienia">
                <Col>
               <FormGroup>
               <p>Nowe hasło</p>
                  <Input type="password" id="newPassword1" value={this.state.value} onChange={this.handleChange} placeholder="Nowe hasło" autoComplete="new-password" />
                </FormGroup>
                </Col>
                <Col>
                <FormGroup>
                <p>Powtórz nowe hasło</p>
                   <Input type="password" id="newPassword2" value={this.state.value} onChange={this.handleChange} placeholder="Powtórz nowe hasło" autoComplete="new-password" />
                 </FormGroup>
                </Col>
             </Row>

             <Row className="ProfileUstawienia">
                <Col>
               <FormGroup>
                  <p>Stare hasło</p>
                  <Input type="password" id="oldPass1" value={this.state.value} onChange={this.handleChange} placeholder="Stare hasło" autoComplete="new-password" />
                </FormGroup>
                </Col>
                <Col>
                <p>Minimum 6 znaków</p>
                  <Button  className="ZmienHaslo" id="changePassword" onClick={this.changePassword} color="danger" >Zmień hasło</Button>

                </Col>
             </Row>

             <Row className="ProfileRow ProfilePref NoBorder">
               <Col className="margin10">
               <span className="newPostsHeader"><img src={Arrow} className="LeftArrow" onClick={this.LeftArrow} alt="PiesFajnyJest.com najnowsze posty" />
               Twoje posty
         <img src={Arrow} className="RightArrow" onClick={this.RightArrow} alt="PiesFajnyJest.com najnowsze posty" />
         </span>
               </Col>
             </Row>

              {  this.state.isLoading ? <div className="Loading"><img src={LoadingDog} alt="loading..." /><p>Ładowanie postów</p></div> :

                    <Carousel  swipeable={false}
                    draggable={true}
                    responsive={responsive}
                    infinite={true}
                    autoPlay={this.props.deviceType !== "mobile" ? true : false}
                    autoPlaySpeed={5000}>

              {

                  Object.keys(this.state.MainPosts).map((item, i) => (

                <Col  key={i}>

                          <Card  className="postMain">
                            <CardImg  src={this.state.MainPosts[item].photo} onError={(e)=>{e.target.onerror = null; e.target.src='/src/client/dog.png'}} className="postImg" alt="Card image cap" />
                            <CardBody>
                              <CardTitle  className="postTitle">{this.state.MainPosts[item].title}</CardTitle>
                              <CardSubtitle  className="postTags">{this.state.MainPosts[item].category}</CardSubtitle>
                              <CardText >{this.state.MainPosts[item].description}</CardText>
                              <Row>
                              <CardImg  src={Map} className="mapImg mapInfos" alt="Card image cap" />
                                <p className="mapPlace"> {this.state.MainPosts[item].voivodeship } </p>


                              </Row>
                              <Button className="postSubmit btn-danger"><Link to={this.state.MainPosts[item].link}>ZOBACZ OGŁOSZENIE</Link></Button>
                            </CardBody>
                          </Card>
                            </Col>
                  ))

              }
              </Carousel>
               }

               <Row className="ProfileRow ProfilePref">
                 <Col className="margin10">
                 <span className="ProfileItem">Usunięcie konta</span>
                 </Col>
               </Row>
           </Container>
           <NotificationContainer/>
           </div>
=======

     };
}
     render(props){
       return(
         <div className="profile">
           <Container>
             <Row>
             </Row>
           </Container>
>>>>>>> Profile component
         </div>
       );
     }





}
