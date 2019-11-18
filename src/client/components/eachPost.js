import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Navbar100 from './Navbar/Navbar100';
import Footer from './footer';
import { Container, Row, Col, Input, FormGroup } from 'reactstrap';
import Error404 from './img/sad-dog.png';
import Share from './img/share.png';
import Facebook from './img/Facebook.png';
import LoadingDog from './img/LoadingDog.gif';
import Twitter from './img/Twitter.png';
import Swipe from './img/add-image.png';
import { FacebookShareButton, FacebookShareCount, FacebookIcon } from 'react-share';
import { FaDog, FaBone } from 'react-icons/fa';

export default class EachPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noPosts: '',
      CurrentPost:'',
      FacebookCounts:0,
      CurrentItem:"descriptionSwitcher",
      RandomPost:'',
      postOwn:false,
      EditProfile:false,
      EditTitle:'',
      EditContact:'',
      EditVoivodeship:'',
      EditCategory:'',
      EditDesc:'',
      EditPhoto:'',
      addPhoto:"Zmień zdjęcie",
      imagePreviewUrl: '',
      file: '',
      photoChanged:false
     };
     this.facebookShare = this.facebookShare.bind(this);
     this.editProfile = this.editProfile.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.UploadPhoto = this.UploadPhoto.bind(this);
     this._handleImageChange = this._handleImageChange.bind(this);
     this.Cancel = this.Cancel.bind(this);
     this.SaveChanges = this.SaveChanges.bind(this);
     this.itemHandle = this.itemHandle.bind(this);
  }

  UploadPhoto(){
    document.getElementById("addPhoto").click();
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        photoChanged:true,
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  componentDidMount () {
    const { postPath } = this.props.match.params
    fetch('/api/showPost', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postPath:postPath
    }),
  })
  .then(resp => resp.json())
  .then(resp => {

    if(resp.postUserEmail==localStorage.getItem('userEmail')){
      this.setState({postOwn:true});
    }
    if(resp.Error=="Post nie istnieje lub został usunięty."){
        this.setState({noPosts:"Post nie istnieje lub został usunięty!"});
    }else{
      this.setState({
        CurrentPost:resp,
        EditTitle:resp.postTitle,
        EditContact: resp.postEmail,
        EditVoivodeship: resp.postVoivodeship,
        EditCategory: resp.postCategory,
        EditDesc: resp.postDescription,
        EditPhoto: resp.postPhoto,
      });
    }

    })

    // Ilosc udostępnień posta
    fetch('/api/facebookCounts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Link:window.location.href
    }),
  })
  .then(resp => resp.json())
  .then(resp => {

    this.setState({FacebookCounts:resp.FacebookCounts});

    })

    fetch('/api/randomPost', {
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
    if(resp.Error=="Nie udało się znaleźć losowego posta."){
      console.log("Nie mozna wygenerować losowego posta.");
    }else{
      this.setState({RandomPost:resp});
    }


    })



  }

  itemHandle(event){
    const target = event.target;
    var id = target.id
    this.setState({
      CurrentItem:id
    })
    document.getElementById("descriptionSwitcher").classList.remove("itemBorder");
    document.getElementById("newsSwitcher").classList.remove("itemBorder");
    document.getElementById("commentsSwitcher").classList.remove("itemBorder");
    document.getElementById(id).classList.add("itemBorder");
  }
  handleChange(event) {
    const target = event.target;
    var value = target.value;
    var name = target.id
    this.setState({
     [name]:value
    });
 }

 Cancel(){
   this.setState({
     EditTitle: this.state.CurrentPost.postTitle,
     EditContact: this.state.CurrentPost.postEmail,
     EditVoivodeship:this.state.CurrentPost.postVoivodeship,
     EditCategory:this.state.CurrentPost.postCategory,
     EditDesc: this.state.CurrentPost.postDescription,
     EditPhoto: this.state.CurrentPost.postPhoto,
     EditProfile:false
   });
 }

 SaveChanges(){
   fetch('/api/ChangePost', {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     title: this.state.EditTitle,
     email: this.state.EditContact,
     category: this.state.EditCategory,
     photo: this.state.EditPhoto,
     description: this.state.EditDesc,
     voivodeship: this.state.EditVoivodeship,
     emailUser: localStorage.getItem('userEmail'),
     passUser: localStorage.getItem('userPass'),
     link: this.state.CurrentPost.postLink,
     photoChanged:this.state.photoChanged,
     newPhoto: this.state.imagePreviewUrl
   }),
 })
 .then(resp => resp.json())
 .then(resp => {
   console.log(resp);
       var Error = resp.Error;
       if(resp.NewRandomPhoto){
         this.setState({photo:resp.NewRandomPhoto})
       }

       if(Error=="Za długi email"){
         NotificationManager.error("Podany email jest za długi. Aby spełniał nasze kryteria nie może zawierać więcej niż 30 znaków.", "Zły email!");
       }
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
       this.setState({photoChanged:false})
       if(Error=="Udało się zmienić post!"){

         window.location.href="/"+this.state.CurrentPost.postLink

       }
       if(Error=="Nie udało się zmienić posta!"){
           NotificationManager.error("Prosimy spróbować ponownie.", "Nie udało się zmienić postu!")
       }
   }).catch(function() {
     NotificationManager.error("Aby dodać zmienić post musisz odczekać 30 minut.", "Nie udało się zmienić postu!")
    });
 }


  facebookShare(){
    document.getElementsByClassName("SocialMediaShareButton--facebook")[0].click();
  }

  editProfile(){
    this.setState({EditProfile:!this.state.EditProfile})
  }

  render(props) {

    let {imagePreviewUrl} = this.state;
   let $imagePreview = (<img className="displayImage" src={Swipe} />);
   if (imagePreviewUrl) {
     $imagePreview = (<img className="displayImage" src={imagePreviewUrl} />);
     document.getElementById("DodajZdjecie").innerText="Kliknij aby zmienić zdjęcie";
   }


    return (

      <div className="PostContainer">
        <Navbar100/>
        {this.state.noPosts=="Post nie istnieje lub został usunięty!" ?
        <Container className="PostContainer">
          <Row>
            <Col className="notFound">
            <img src={Error404} alt="Nie znaleziono posta!" />
            <p>{this.state.noPosts }</p>
            </Col>
          </Row>
        </Container>
        :
        <Container>
          <Row className="postRow">
            <Col className="ShareCol">


              <p className="redInfo InformacjeOPoscie">INFORMACJE O POŚCIE</p>
              <div className="postHeader">



                {this.state.CurrentPost.postLink ?
                  <div>
                        {this.state.EditProfile==false ?
                          <div>
                  <img className="postImage" src={"./src/client/upload/"+this.state.CurrentPost.postPhoto} onError={(e)=>{e.target.onerror = null; e.target.src="/src/client/dog.png" }}  alt="Zdjęcie postu na piesfajnyjest.com" />
                    <Row className="postDetails">
                      <Col>
                   <p className="eachTitle">{this.state.EditTitle}</p>






                      </Col>
                    </Row>
                    </div>
                        :
                        <div>
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
                     <Input type="text" className="eachTitle editInput" id="EditTitle" onChange={this.handleChange} value={this.state.EditTitle} />
                        </Col>
                        </Row>
                        </div>

                        }
                   </div>
                  :
                  <div className="Loading"><img src={LoadingDog} alt="loading..." /><p>Ładowanie postu</p></div>
                }







              </div>
            </Col>

            <Col className="colUser ShareCol">
            <p className="redInfo">SZCZEGÓŁY</p>
            <div className="colUserDiv">
            <p className="postUser">Dodano przez: <b>{this.state.CurrentPost.postUserLogin}</b></p>

            {
              this.state.EditProfile==false ?   <p className="postUser">Kontakt: <b>{this.state.CurrentPost.postEmail}</b></p> :
              <div>
                <Input type="text" className="eachTitle editInput editInput16 postUser" id="EditContact" onChange={this.handleChange} value={this.state.EditContact} />
              </div>
            }

            {
              this.state.EditProfile==false ?     <p className="postUser">Województwo: <b>{this.state.CurrentPost.postVoivodeship}</b></p> :
              <div>
              <Input required type="select" className="postUser editInput16 editInput editMargin" id="EditVoivodeship" value={this.state.EditVoivodeship} onChange={this.handleChange}>
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
              </div>
            }

            {
              this.state.EditProfile==false ?      <p className="postUser">Kategoria: <b>{this.state.CurrentPost.postCategory}</b></p> :
              <div>
              <Input required type="select" className="postUser editInput16 editInput editMargin" value={this.state.EditCategory} onChange={this.handleChange} id="EditCategory" >
                <option value="Oddam psa">Oddam psa</option>
                <option value="Przygarne psa">Przygarne psa</option>
                <option value="Pomoc dla psów">Pomoc dla psów</option>
                <option value="Inne">Inne</option>
              </Input>
              </div>
            }





            <p className="postUser">Dodano: <b>{this.state.CurrentPost.postCreatedAt}</b></p>
            {
              this.state.postOwn==false || this.state.EditProfile==true ? null :
                <p className="postUserLast">  <button onClick={this.editProfile} className="EditProfile mainCenterTextButton   btn btn-danger">Edytuj post</button></p>
            }
            {
              this.state.EditProfile==false ? null:
              <p className="postUserLast">  <button onClick={this.SaveChanges} className="EditProfile mainCenterTextButton   btn btn-danger">Zapisz zmiany</button></p>
            }
            {this.state.EditProfile==false ? null:
                <p className="postUserLast">  <button onClick={this.Cancel} className="EditProfile mainCenterTextButton   btn btn-danger">Cofnij zmiany</button></p>
            }


            </div>
            </Col>

          </Row>

          <Row className="postRow">
            <Col className="ShareCol">
            <div className="postHeader">
              <Row className="postDetails ">
                <Col>
                  <p className="postShare">Pomóż udostępniając post!</p>
                  <div className="fbContainer">
                  <img src={Facebook} onClick={this.facebookShare} className="facebookIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  <img src={Twitter} className="twitterIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  </div>


                </Col>

                <Col>
                <p className="postShare">Udostępnienia:</p>
                <FacebookShareButton id="FacebookShare" url={"https://zrzutka.pl/2zasw9"}/>
                  <p className="postShare2">{this.state.FacebookCounts}</p>

                </Col>
              </Row>

            </div>
            </Col>

            <Col className="colUser ShareCol randomPostDisplay">
            <div className="postHeader  ">
            <p className="postShare AlsoSee">Zobacz również:</p>


            {(this.state.RandomPost.RandomLink ? <div>
                <div className="fbContainer">
                <img className="SmallImage" src={"./src/client/upload/"+this.state.RandomPost.RandomPhoto} onError={(e)=>{e.target.onerror = null; e.target.src="/src/client/dog.png" }} alt="PiesFajnyJest zobacz również ten post!" />
              <p className="randomtitle">{this.state.RandomPost.RandomTitle}</p>
              <button className="mainCenterTextButton btn btn-danger"><a href={"/"+this.state.RandomPost.RandomLink}>Zobacz Post</a></button>
              </div>
              </div>
                : <div>
                  <div className="Loading"><img src={LoadingDog} alt="loading..." /><p>Ładowanie postu</p>
                </div>
              </div>

            )}
              </div>
            </Col>

          </Row>


          <Row className="postRow">
            <Col className="ShareCol DescirptionCol">
            <div className="postHeader">
              <Row className="PostItems">
                <Col className="PostItem">
                  <p className="postShare PostButtons leftItem itemBorder" id="descriptionSwitcher" onClick={this.itemHandle} >Opis</p>
                </Col>
                <Col className="PostItem">
                  <p className="postShare PostButtons" id="newsSwitcher"onClick={this.itemHandle}>Aktualności<sup className="sup">12</sup></p>
                </Col>
                <Col className="PostItem">
                  <p className="postShare PostButtons rightItem" id="commentsSwitcher" onClick={this.itemHandle} >Komentarze<sup className="sup">7</sup></p>
                </Col>
              </Row>

              <Row>
                <Col>
                {
                  this.state.CurrentItem=="descriptionSwitcher" ?
                  <div>
                  {
                    this.state.EditProfile==false ?       <p className="PostText">{this.state.CurrentPost.postDescription}</p> :
                    <div>
                <Input type="textarea" className="postUser EditDesc" value={this.state.EditDesc} onChange={this.handleChange}  name="text" id="EditDesc" />
                    </div>
                  }
                  </div>
                  :
                  null

                }

                {
                  this.state.CurrentItem=="newsSwitcher" ?
                  <div className="allItems">

                  {this.state.postOwn==true ?
                    <div>
                    <Row className="AddNews">
                      <Col>
                      <Input type="textarea" className="textareaNews" value="" placeholder="Napisz aktualność..." onChange={this.handleChange}  name="text"  />

                      </Col>

                    </Row>
                    <Row className="AddNews">
                    <Col className="buttonNews">
                      <button className="NewButton">Dodaj aktualność</button>
                    </Col>
                    </Row>
                    </div>
                    : null
                  }

                    <Row>
                      <Col className="colItems">
                        <p><FaDog className="dogIcon"/> <span className="itemDate">19.10.2019</span></p>
                        <p className="textItems">Prace idą pełną parą, jestesmy już bardzo blisko aby skończyć projekt </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                          <FaBone className="trans90"/>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="colItems">
                        <p><FaDog className="dogIcon"/> <span className="itemDate">12.01.2019</span></p>
                        <p className="textItems">Już prawie udało nam się skonczyć Prace idą pełną parą, jestesmy już bardzo blisko aby skończyć projekt </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                          <FaBone className="trans90"/>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="colItems">
                        <p><FaDog className="dogIcon"/> <span className="itemDate">22.04.2019</span></p>
                        <p className="textItems">Już prawie udało nam się skonczyć </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                          <FaBone className="trans90"/>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="colItems">
                        <p><FaDog className="dogIcon"/> <span className="itemDate">12.05.2019</span></p>
                        <p className="textItems">Prace idą pełną parą, jestesmy już bardzo blisko aby skończyć projekt </p>
                      </Col>
                    </Row>
                  </div>
                  :
                  null
                }

                {
                  this.state.CurrentItem=="commentsSwitcher" ?
                  <div>
                    <p> asdastest</p>
                  </div>
                  :
                  null
                }



                </Col>
              </Row>
            </div>

            </Col>

            <Col className="colUser ShareCol randomPostDisplay">

            </Col>

          </Row>

          <Row className="postRow">
            <Col className="ShareCol">
            <div className="postHeader">
              <Row className="postDetails ">
                <Col>
                  <p className="postShare">Pomóż udostępniając post!</p>
                  <div className="fbContainer">
                  <img src={Facebook} onClick={this.facebookShare} className="facebookIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  <img src={Twitter} className="twitterIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  </div>


                </Col>

                <Col>
                <p className="postShare">Udostępnienia:</p>
                <FacebookShareButton id="FacebookShare" url={"https://zrzutka.pl/2zasw9"}/>
                  <p className="postShare2">{this.state.FacebookCounts}</p>

                </Col>
              </Row>

            </div>
            </Col>

            <Col className="SeeToo colUser ShareCol randomPostDisplay postHeader ">
            <div className="fbContainer goTO">
            <p className="postShare">Szybki dostęp:</p>
            <button className="mainCenterTextButton btn btn-danger marginTop20"><a href="/">Główna</a></button>
            <button className="mainCenterTextButton btn btn-danger marginTop20"><a href="/dodajpost">Dodaj Post</a></button>


            </div>
            </Col>

          </Row>


        </Container>

       }

        <Footer/>
        <NotificationContainer/>
      </div>
    );
  }

}
