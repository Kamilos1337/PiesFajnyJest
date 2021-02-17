import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Navbar100 from './Navbar/Navbar100';
import Footer from './footer';
import { Container, Row, Col, Input, FormGroup } from 'reactstrap';
import { FacebookShareButton, FacebookShareCount, FacebookIcon, TwitterShareButton  } from 'react-share';
import { FaDog, FaBone, FaCommentAlt } from 'react-icons/fa';




function ShowNews(news) {
  const News = news.news;
  if(news.news.length>0){
  const listNews = News.map((EachNews, i) =>
  <div key={i}>
  <Row>
    <Col>
        <FaBone className="trans90"/>
    </Col>
  </Row>
  <Row>
    <Col className="colItems">
      <p><FaDog className="dogIcon"/> <span className="itemDate">{EachNews.created_at}</span></p>
      <p className="textItems">{EachNews.newsText}</p>
    </Col>
  </Row>
  </div>
   );

  return (
    <div>
    {listNews}
    </div>
  );
}else{
  return(
    <div>
      Brak aktualności!
    </div>
  );
}
}

function ShowComments(comments) {
    if(comments.comments.length>0){
  const Comments = comments.comments;
  const listNews = Comments.map((EachComment, i) =>
  <div key={i}>
  <Row className="EachComment">
    <Col>
      <Row>
        <Col>
          <span className="nameComments">{EachComment.commentsUserName}</span>
        </Col>

        <Col>
          <span className="dateComments">{EachComment.created_at}</span>
        </Col>
      </Row>
      <p className="PostText">{EachComment.commentsText}</p>
    </Col>
  </Row>
  </div>
   );


  return (
    <div>
    {listNews}
    </div>
  );
}else{
  return (
    <div className="text-center">
    Brak komentarzy!
    </div>
  );
}
}

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
      photoChanged:false,
      addNewsText:"",
      addCommentText:"",
      AllNews:[],
      AllComments:[]
     };
     this.facebookShare = this.facebookShare.bind(this);
     this.twitterShare = this.twitterShare.bind(this);
     this.editProfile = this.editProfile.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.UploadPhoto = this.UploadPhoto.bind(this);
     this._handleImageChange = this._handleImageChange.bind(this);
     this.Cancel = this.Cancel.bind(this);
     this.SaveChanges = this.SaveChanges.bind(this);
     this.itemHandle = this.itemHandle.bind(this);
     this.addNews = this.addNews.bind(this);
     this.addComment = this.addComment.bind(this);
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
    (window.adsbygoogle = window.adsbygoogle || []).push({});
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
      fetch('/api/facebookCounts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Link:resp.postLink
      }),
    })
    .then(resp => resp.json())
    .then(resp => {

      this.setState({FacebookCounts:resp.FacebookCounts});

      })
    }

    })

    fetch('/api/showNews', {
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
    this.setState({AllNews:resp})
    })

    fetch('/api/showComments', {
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
    this.setState({AllComments:resp})
    })

    // Ilosc udostępnień posta


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




  addNews(){
    const { postPath } = this.props.match.params
     var date = new Date().getDate(); //Current Date
     var month = new Date().getMonth() + 1; //Current Month
     if(month<10){
       month = "0"+month;
     }
     var year = new Date().getFullYear(); //Current Year
     var hours = new Date().getHours(); //Current Hours
     var min = new Date().getMinutes(); //Current Minutes
     var sec = new Date().getSeconds(); //Current Seconds
     var FullDate = date + "." + month + "." + year + " " + hours +":"+min;
    fetch('/api/addNews', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      addNewsText: this.state.addNewsText,
      emailUser: localStorage.getItem('userEmail'),
      passUser: localStorage.getItem('userPass'),
      nameUser:this.state.CurrentPost.postUserLogin,
      link: this.state.CurrentPost.postLink,
      created_at: FullDate
    }),
  })
  .then(resp => resp.json())
  .then(resp => {

    if(resp.Error=="Nie udało się dodać newsa!"){
      NotificationManager.error("Aby dowiedzieć się więcej skontaktuj się z nami!", "Nie udało się!")
    }

    if(resp.Error=="Za krótki text"){
      NotificationManager.error("Podany tekst musi mieć minimum 6 znaków!", "Nie udało się!")
    }

    if(resp.Error=="Za długi text"){
      NotificationManager.error("Podany tekst może mieć maksymalnie 1000 znaków!", "Nie udało się!")
    }

    if(resp.Success=="Udało się dodać newsa!"){
      NotificationManager.success("Aktualność została dodana pomyślnie!", "Udało się!");
      this.setState({addNewsText:""})
      fetch('/api/showNews', {
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
      this.setState({AllNews:resp})
      })
    }

    }).catch(function() {
      NotificationManager.error("Aby dodać aktualność musisz odczekać 30 minut.", "Nie udało się!")
     });
  }

  addComment(){
    const { postPath } = this.props.match.params
     var date = new Date().getDate(); //Current Date
     var month = new Date().getMonth() + 1; //Current Month
     if(month<10){
       month = "0"+month;
     }
     var year = new Date().getFullYear(); //Current Year
     var hours = new Date().getHours(); //Current Hours
     var min = new Date().getMinutes(); //Current Minutes
     var sec = new Date().getSeconds(); //Current Seconds
     var FullDate = date + "." + month + "." + year + " " + hours +":"+min;
    fetch('/api/addComment', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      addCommentText: this.state.addCommentText,
      emailUser: localStorage.getItem('userEmail'),
      passUser: localStorage.getItem('userPass'),
      nameUser:this.state.CurrentPost.postUserLogin,
      link: this.state.CurrentPost.postLink,
      created_at: FullDate
    }),
  })
  .then(resp => resp.json())
  .then(resp => {

    if(resp.Error=="Nie udało się dodać komentarza!"){
      NotificationManager.error("Aby dowiedzieć się więcej skontaktuj się z nami!", "Nie udało się!")
    }

    if(resp.Error=="Za krótki text"){
      NotificationManager.error("Podany tekst musi mieć minimum 6 znaków!", "Nie udało się!")
    }

    if(resp.Error=="Za długi text"){
      NotificationManager.error("Podany tekst może mieć maksymalnie 1000 znaków!", "Nie udało się!")
    }

    if(resp.Success=="Udało się dodać newsa!"){
      NotificationManager.success("Komentarz został dodany pomyślnie!", "Udało się!");
      this.setState({addCommentText:""})
      fetch('/api/showComments', {
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
      this.setState({AllComments:resp})
      })
    }

    }).catch(function() {
      NotificationManager.error("Aby dodać komentarz musisz odczekać 30 minut.", "Nie udało się!")
     });
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
    document.getElementsByClassName("react-share__ShareButton")[0].click();
  }

  twitterShare(){
    document.getElementsByClassName("react-share__ShareButton")[1].click();
  }


  editProfile(){
    this.setState({EditProfile:!this.state.EditProfile})
  }

  render(props) {

    let {imagePreviewUrl} = this.state;
   let $imagePreview = (<img className="displayImage" src="/public/add-image.png" />);
   if (imagePreviewUrl) {
     $imagePreview = (<img className="displayImage" src={imagePreviewUrl} />);
     document.getElementById("DodajZdjecie").innerText="Kliknij aby zmienić zdjęcie";
   }

   const AllNews = this.state.AllNews;
   const AllComments = this.state.AllComments;
    return (

      <div className="PostContainer">

        <Navbar100/>
        {this.state.noPosts=="Post nie istnieje lub został usunięty!" ?
        <Container className="PostContainer">
          <Row>
            <Col className="notFound">
            <img src="/public/sad-dog.png" alt="Nie znaleziono posta!" />
            <p>{this.state.noPosts }</p>
            </Col>
          </Row>
        </Container>
        :
        <Container>
          <Row className="postRow highTop">
            <Col className="ShareCol">


              <p className="redInfo InformacjeOPoscie">INFORMACJE O POŚCIE</p>
              <div className="postHeader">



                {this.state.CurrentPost.postLink ?
                  <div>
                        {this.state.EditProfile==false ?
                          <div>
                  <img className="postImage" src={"./src/client/upload/"+this.state.CurrentPost.postPhoto} onError={(e)=>{e.target.onerror = null; e.target.src="/public/dog.png" }}  alt="Zdjęcie postu na piesfajnyjest.com" />
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
                  <div className="Loading"><img src="/public/LoadingDog.gif" alt="loading..." /><p>Ładowanie postu</p></div>
                }







              </div>
            </Col>

            <Col className="colUser ShareCol">
            <p className="redInfo detailsRed">SZCZEGÓŁY</p>
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

          <Row className="postRow resetMargin">
            <Col className="">
              <div className="postHeader noneColors">
                <ins className="adsbygoogle"
                   style={{ display: 'block' }}
                   data-ad-client="ca-pub-2708531917515904"
                   data-ad-slot="7851653213"
                   data-ad-format="auto"
                   data-full-width-responsive="true"/>
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
                  <img src="/public/Facebook.png" onClick={this.facebookShare} className="facebookIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  <img src="/public/Twitter.png" onClick={this.twitterShare} className="twitterIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  </div>


                </Col>

                <Col>
                <p className="postShare">Aktualna liczba udostępnień:</p>
                <FacebookShareButton id="FacebookShare" url={"https://piesfajnyjest.com/"+this.state.CurrentPost.postLink}/>
                <TwitterShareButton url={"https://piesfajnyjest.com/"+this.state.CurrentPost.postLink}/>
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
                <img className="SmallImage" src={"./src/client/upload/"+this.state.RandomPost.RandomPhoto} onError={(e)=>{e.target.onerror = null; e.target.src="/public/dog.png" }} alt="PiesFajnyJest zobacz również ten post!" />
              <p className="randomtitle">{this.state.RandomPost.RandomTitle}</p>
              <button className="mainCenterTextButton btn btn-danger"><a href={"/"+this.state.RandomPost.RandomLink}>Zobacz Post</a></button>
              </div>
              </div>
                : <div>
                  <div className="Loading"><img src="/public/LoadingDog.gif" alt="loading..." /><p>Ładowanie postu</p>
                </div>
              </div>

            )}
              </div>
            </Col>

          </Row>

          <Row className="postRow resetMargin">
            <Col className="">
              <div className="postHeader noneColors">
                <ins className="adsbygoogle"
                   style={{ display: 'block' }}
                   data-ad-client="ca-pub-2708531917515904"
                   data-ad-slot="4880308279"
                   data-ad-format="auto"
                   data-full-width-responsive="true"/>
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
                  <p className="postShare PostButtons" id="newsSwitcher" onClick={this.itemHandle}>Aktualności<sup className="sup" id="newsSwitcher" onClick={this.itemHandle}>{this.state.AllNews.length}</sup></p>
                </Col>
                <Col className="PostItem">
                  <p className="postShare PostButtons rightItem" id="commentsSwitcher" onClick={this.itemHandle} >Komentarze<sup className="sup" id="commentsSwitcher" onClick={this.itemHandle}>{this.state.AllComments.length}</sup></p>
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
                      <Input type="textarea" id="addNewsText" className="textareaNews" value={this.state.addNewsText} placeholder="Napisz aktualność..." onChange={this.handleChange}  name="text"  />

                      </Col>

                    </Row>
                    <Row className="AddNews">
                    <Col className="buttonNews">
                      <button onClick={this.addNews} className="NewButton">Dodaj aktualność</button>
                    </Col>
                    </Row>
                    </div>
                    : null
                  }

                      <ShowNews news={AllNews}/>

                  </div>
                  :
                  null
                }

                {
                  this.state.CurrentItem=="commentsSwitcher" ?
                  <div>

                    <div>
                    <Row className="AddNews">
                      <Col>
                      <Input type="textarea" id="addCommentText" className="textareaNews" value={this.state.addCommentText} placeholder="Napisz komentarz..." onChange={this.handleChange}  name="text"  />

                      </Col>

                    </Row>
                    <Row className="AddNews">
                    <Col className="buttonNews">
                      <button onClick={this.addComment} className="NewButton">Dodaj komentarz</button>
                    </Col>
                    </Row>
                    </div>

                    <ShowComments comments={AllComments}/>
                  </div>
                  :
                  null
                }



                </Col>
              </Row>
            </div>

            </Col>

            <Col className="colUser ShareCol">

            </Col>

          </Row>

          <Row className="postRow">
            <Col className="ShareCol">
            <div className="postHeader">
              <Row className="postDetails ">
                <Col>
                  <p className="postShare">Pomóż udostępniając post!</p>
                  <div className="fbContainer">
                  <img src="/public/Facebook.png" onClick={this.facebookShare} className="facebookIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  <img src="/public/Twitter.png" onClick={this.twitterShare} className="twitterIcon" alt="Udostępnij PiesFajnyJest na facebooku!" />
                  </div>


                </Col>

                <Col>
                <p className="postShare">Aktualna liczba udostępnień:</p>
                <FacebookShareButton id="FacebookShare" url={"https://piesfajnyjest.com/"+this.state.CurrentPost.postLink}/>
                  <p className="postShare2">{this.state.FacebookCounts}</p>

                </Col>
              </Row>

            </div>
            </Col>

            <Col className="SeeToo colUser ShareCol postHeader ">
            <div className="fbContainer goTO">
            <p className="postShare fastAcc">Szybki dostęp:</p>
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
