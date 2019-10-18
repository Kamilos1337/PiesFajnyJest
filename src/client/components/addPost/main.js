import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import {Container, Row, Col} from 'react-bootstrap'
import Navbar100 from '../Navbar/Navbar100';
import DogBackground from '../img/transparent.png';
import addPhoto from '../img/addPhoto.png';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Swipe from '../img/add-image.png';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class InfoNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: localStorage.getItem('userLogin'),
      userEmail:localStorage.getItem('userEmail'),
      firstTime:localStorage.getItem('firstTime'),
      file: '',
      addPhoto:"Dodaj zdjęcie",
     imagePreviewUrl: '',
     editorHtml: '', theme: 'snow',
     text:'',
     title:'',
     category:'Oddam psa',
     email:'',
     photo:'',
     description:'',
     voivodeship:'Dolnośląskie',
     maxText:'Maksymalny rozmiar opisu',
     maxColor:'black'
     };
     this._handleImageChange = this._handleImageChange.bind(this);
   this._handleSubmit = this._handleSubmit.bind(this);
   this.UploadPhoto = this.UploadPhoto.bind(this);
  this.handleChange = this.handleChange.bind(this)
  this.AddPost = this.AddPost.bind(this)
  }


  handleChange(event) {
    const target = event.target;
    var value = target.value;
    var name = target.name;
    this.setState({
     [name]: value
    });
    if(value.length>10000 && name=="text"){
      this.setState({ maxText: 'Przekroczono maksymalny rozmiar opisu!', maxColor:'red' })
    }
    if(this.state.maxText=="Przekroczono maksymalny rozmiar opisu!" && value.length<10000 && name=="text"){
      this.setState({ maxText: 'Maksymalny rozmiar opisu',  maxColor:'black'  })
    }
 }



  _handleSubmit(e) {
     e.preventDefault();
   }

   UploadPhoto(){
     document.getElementById("addPhoto").click();
   }

   AddPost(){
     if(this.state.userLogin!==undefined && this.state.userLogin!==null){
     var date = new Date().getDate(); //Current Date
   var month = new Date().getMonth() + 1; //Current Month
   if(month<10){
     month = "0"+month;
   }
   var year = new Date().getFullYear(); //Current Year
   var hours = new Date().getHours(); //Current Hours
   var min = new Date().getMinutes(); //Current Minutes
   var sec = new Date().getSeconds(); //Current Seconds
   var FullDate = date + "." + month;
     fetch('/api/addPost', {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       title: this.state.title,
       email: this.state.email,
       category: this.state.category,
       photo: this.state.imagePreviewUrl,
       description: this.state.text,
       voivodeship: this.state.voivodeship,
       dateTime:FullDate,
       userLogin:this.state.userLogin,
       userEmail:this.state.userEmail
     }),
   })
   .then(resp => resp.json())
   .then(resp => {
         var Error = resp.Error;

         console.log(Error);
         if(Error=="Za krótki tytuł"){
           NotificationManager.error("Podany tytuł jest za krótki. Aby spełniał nasze kryteria musi zawierać minimum 6 znaków.", "Zły tytuł!");
         }

         if(Error=="Za długi tytuł"){
           NotificationManager.error("Podany tytuł jest za długi. Aby spełniał nasze kryteria może zawierać maksymalnie 80 znaków.", "Zły tytuł!");
         }

         if(Error=="Za długi tytuł"){
           NotificationManager.error("Podany tytuł jest za długi. Aby spełniał nasze kryteria nie może zawierać więcej niż 120 znaków.", "Zły tytuł!");
         }

         if(Error=="Nieprawidłowy email"){
           NotificationManager.error("Podany email jest nieprawidłowy.", "Niepoprawny email!");
         }

         if(Error=="Za krótki opis"){
           NotificationManager.error("Podany opis jest za krótki, aby spełaniał nasze kryteria musi zawierać conajmniej 100 znaków.", "Niepoprawny opis!");
         }

         if(Error=="Post added!"){
           this.setState(
             {
                addPhoto:"Dodaj zdjęcie",
                imagePreviewUrl: '',
                editorHtml: '', theme: 'snow',
                text:'',
                title:'',
                category:'Oddam psa',
                email:'',
                photo:'',
                description:'',
                voivodeship:'Dolnośląskie',
                maxText:'Maksymalny rozmiar opisu',
                maxColor:'black' })
                document.getElementById("title").value="";
                document.getElementById("email").value="";
                document.getElementById("addPostTextArea").value="";
           NotificationManager.success("Aby zobacz swój post wejdź w zakładkę 'moje posty'.", "Dodano post!");
           console.log(this.state.text)
         }
     }).catch(function() {
       NotificationManager.error("Aby dodać kolejny post musisz odczekać 30 minut.", "Nie udało się dodać postu!")
      });
   }else{
      NotificationManager.error("Aby dodać post musisz się zalogować!", "Zaloguj się!");
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



  render(props) {
    var sectionStyle = {
    color:this.state.maxColor
    };

    let {imagePreviewUrl} = this.state;
   let $imagePreview = (<img className="displayImage" src={Swipe} />);
   if (imagePreviewUrl) {
     $imagePreview = (<img className="displayImage" src={imagePreviewUrl} />);
     document.getElementById("DodajZdjecie").innerText="Kliknij aby zmienić zdjęcie";
   }

    return (
      <div className="addPostContainer" >

      <Navbar100/>

      <Container className="ContentAddPost">
        <Row className="rowFluid">
        <Col className="PageContent">DODAJ POST</Col>
        </Row>

         <Row className="formAddPost">
         <Col>
         <FormGroup>
          <Label className="formText" for="formText">Tytuł *</Label>
          <Input type="text" value={this.state.value} onChange={this.handleChange}  name="title" id="title" placeholder="Podaj tytuł swojego posta" />
        </FormGroup>
        </Col>
         </Row>
         <Row>
           <Col>
           <FormGroup>
             <Label className="formText" for="exampleSelect">Kategoria *</Label>
             <Input required type="select" name="category" value={this.state.value} onChange={this.handleChange} id="category" placeholder="Select category..">
               <option value="Oddam psa">Oddam psa</option>
               <option value="Przygarne psa">Przygarne psa</option>
               <option value="Pomoc dla psów">Pomoc dla psów</option>
               <option value="Inne">Inne</option>
             </Input>
           </FormGroup>
          </Col>
          <Col>
          <FormGroup>
           <Label className="formText" for="formText">Email *</Label>
           <Input type="email" value={this.state.value} onChange={this.handleChange} name="email" id="email" value={this.state.value} onChange={this.handleChange} placeholder="Podaj kontaktowy adres email" />
         </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
          <FormGroup>
            <Label className="formText" for="exampleSelect">Województwo *</Label>
            <Input required type="select" name="voivodeship" value={this.state.value} onChange={this.handleChange} id="voivodeship" placeholder="voivodeship">
              <option value="Dolnośląskie">Dolnośląskie</option>
              <option value="Kujawsko-Pomorskie">Kujawsko-Pomorskie</option>
              <option value="Lubelskie">Lubelskie</option>
              <option value="Lubuskie">Lubuskie</option>
              <option value="Łódzkie">Łódzkie</option>
              <option value="Małopolskie">Małopolskie</option>
              <option value="Mazowieckie">Mazowieckie</option>
              <option value="Opolskie">Opolskie</option>
              <option value="Podkarpackie">Podkarpackie</option>
              <option value="Podlaskie">Podlaskie</option>
              <option value="Pomorskie">Pomorskie</option>
              <option value="Śląskie">Śląskie</option>
              <option value="Świętokrzyskie">Świętokrzyskie</option>
              <option value="Warmińsko-Mazurskie">Warmińsko-Mazurskie</option>
              <option value="Wielkopolskie">Wielkopolskie</option>
              <option value="Zachodniopomorskie">Zachodniopomorskie</option>
            </Input>
          </FormGroup>
          </Col>
        </Row>
        <Row className="rowPhoto">
        <Col></Col>
        <Col className="displayImage"></Col>
        </Row>



                <Row className="photoRow" onClick={this.UploadPhoto}>
                <Col>
                <FormGroup>

                 <Col className="PageContent">{$imagePreview}</Col>
                 <Col className="PageContent2" id="DodajZdjecie">{this.state.addPhoto}</Col>
               </FormGroup>
               </Col>
                <FormGroup>


                 <input type="file"  id="addPhoto" hidden onChange={this._handleImageChange} />
                 <button type="submit" hidden onClick={this._handleSubmit}>Upload Image</button>


               </FormGroup>
                </Row>

          <Row>
            <Col>
            <FormGroup>
                <Label className="formText" for="exampleText">Opis *</Label>
                <Input type="textarea" value={this.state.value} onChange={this.handleChange}  name="text" id="addPostTextArea" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col><p className="maxColor" style={sectionStyle}>{this.state.text.length} / 10000 - {this.state.maxText}</p></Col>
          </Row>
          <Row className="rowAddButton">
            <Col><Button onClick={this.AddPost} className="AddPostButton" id="AddingPost" color="danger" >Dodaj Post</Button></Col>
          </Row>



      </Container>
      <NotificationContainer/>
      </div>
    );
  }


}
