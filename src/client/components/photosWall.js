import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col } from 'reactstrap';
import ResponsiveGallery from 'react-responsive-gallery';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addPhoto:"Dodaj zdjęcie",
      imagePreviewUrl: '',
      photo:'',
      file:'',
      PhotosWall:'',
      addPhotoToWall:'Dodaj zdjęcie',
      userLogin: localStorage.getItem('userLogin'),
      userEmail:localStorage.getItem('userEmail'),
      firstTime:localStorage.getItem('firstTime')

     };
     this.UploadPhoto = this.UploadPhoto.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
      this._handleImageChange = this._handleImageChange.bind(this);
        this.AddToWall = this.AddToWall.bind(this);
          this.ShowWall = this.ShowWall.bind(this);
}

ShowWall(){
  fetch('/api/displayWall', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
  }),
})
.then(resp => resp.json())
.then(resp => {

  this.setState({PhotosWall:resp});
  })
}
componentDidMount () {
  this.ShowWall();
}

_handleSubmit(e) {
   e.preventDefault();
 }

 UploadPhoto(){
   document.getElementById("addPhoto").click();
 }

 AddToWall(){
   if(localStorage.getItem('userEmail')){
   var date = new Date().getDate(); //Current Date
 var month = new Date().getMonth() + 1; //Current Month
 if(month<10){
   month = "0"+month;
 }
  var year = new Date().getFullYear(); //Current Year

 var FullDate = date + "." + month + "." + year;
   fetch('/api/AddToWall', {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     photo: this.state.imagePreviewUrl,
     userLogin:this.state.userLogin,
     userEmail:this.state.userEmail,
     Date: FullDate
   }),
 })
 .then(resp => resp.json())
 .then(resp => {

   if(resp.Error=="Wall photo added"){
       this.setState({PhotosWall:'', imagePreviewUrl:''});
     NotificationManager.success("Gratulacje, twoje zdjęcie znajduje się na naszej psiej tablicy!", "Zdjęcie zostało dodane!")
     this.ShowWall();
   }

   if(resp.Error=="Wall photo error"){
    console.log("Error!");
   }


   }).catch(function() {
     NotificationManager.error("Aby dodać kolejne zdjęcię musisz odczekać 10 minut.", "Nie udało się dodać zdjęcia!")
    });
  }else{
    NotificationManager.error("Aby dodać zdjęcie musisz być zalogowany.", "Nie udało się dodać zdjęcia!")
  }
 }

_handleImageChange(e) {
  e.preventDefault();

  let reader = new FileReader();
  let file = e.target.files[0];
  reader.onloadend = () => {
    this.setState({
      file: file,
      imagePreviewUrl: reader.result
    });
  }

  reader.readAsDataURL(file)
}
     render(props){

       let {imagePreviewUrl} = this.state;
      let $imagePreview = (<img className="displayImage" src="/public/add-image.png" />);
      if (imagePreviewUrl) {
        $imagePreview = (<img className="displayImage" src={imagePreviewUrl} />);
        var Find = document.getElementById("DodajZdjecie");
        if(Find)  document.getElementById("DodajZdjecie").remove();

        document.getElementById("SendPhotoWall").setAttribute("style", "display:block !important;")
      }

       if(this.state.PhotosWall.length>0){
        var images = this.state.PhotosWall
      }else{
        var images = [{src:'fghfghfhg'}];
      }
       return(
         <div id="Wall">
           <Container className="DogsWall">

             <Row>
              <Col className="photosWallCol">
              <p className="BannerTitle">  <img className="Banner2" src="/public/add.png" alt="PiesFajnyJest, wspieraj, adoptuj, pomagaj!" /> <span className="textBanner">Dodaj zdjęcie swojego psa!</span></p>
              <p className="BannerDesc">Nie wstydźmy się pokazywać swoich psiaków innym, twoje zdjęcie może byc inspiracją dla kogoś! Dlatego łap za telefon czy aparat i strzel fotkę swojemu czworonożnemu przyjacielowi. Niech świat go zobaczy na naszej psiej tablicy!</p>

              </Col>
              <Col className="RightDogWall">
              <FormGroup className="WallAddPhoto">

               <Col className="PageContent"  onClick={this.UploadPhoto}>{$imagePreview}</Col>
               <Col className="PageContent2" id="DodajZdjecie"  onClick={this.UploadPhoto}>Dodaj zdjęcie</Col>
               <button id="SendPhotoWall" onClick={this.AddToWall} className="bttnADDPHOTO btn-danger btn btn-secondary DisplayLater">{this.state.addPhotoToWall}</button>

                                <input type="file"  id="addPhoto" hidden onChange={this._handleImageChange} />
                                <button type="submit" hidden onClick={this._handleSubmit}>Upload Image</button>
             </FormGroup>
             </Col>
             </Row>
             <Row>
             <Col>
             {this.state.PhotosWall.length>0 ? <ResponsiveGallery images={images} useLightBox="true"/> :
             <div className="Loading LoadingWall"><img src="/public/LoadingDog.gif" alt="loading..." /><p>Ładowanie postów</p></div>
             }
             <div>

               </div>
               </Col>
             </Row>
           </Container>
             <NotificationContainer/>
         </div>
       );
     }





}
