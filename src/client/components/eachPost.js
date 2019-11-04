import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Navbar100 from './Navbar/Navbar100';
import Footer from './footer';
import { Container, Row, Col } from 'reactstrap';
import Error404 from './img/sad-dog.png';
import Dog2 from './img/dog2.svg';
import Share from './img/share.png';
import Facebook from './img/Facebook.png';
import LoadingDog from './img/LoadingDog.gif';
import Twitter from './img/Twitter.png';
import { FacebookShareButton, FacebookShareCount, FacebookIcon } from 'react-share';


export default class EachPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noPosts: '',
      CurrentPost:'',
      FacebookCounts:0,
      RandomPost:''
     };
     this.facebookShare = this.facebookShare.bind(this);
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

    if(resp.Error=="Post nie istnieje lub został usunięty."){
        this.setState({noPosts:"Post nie istnieje lub został usunięty!"});
    }else{
      this.setState({
        CurrentPost:resp
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

  facebookShare(){
    document.getElementsByClassName("SocialMediaShareButton--facebook")[0].click();
  }

  render(props) {
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
              {this.state.CurrentPost.postPhoto ?
                <div>
                <img className="postImage" src={this.state.CurrentPost.postPhoto} alt={this.state.CurrentPost.postTitle} />
                  <Row className="postDetails">
                    <Col>
                      <p className="eachTitle">{this.state.CurrentPost.postTitle}</p>

                    </Col>
                  </Row>
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
            <p className="postUser">Kontakt: <b>{this.state.CurrentPost.postUserEmail}</b></p>
            <p className="postUser">Województwo: <b>{this.state.CurrentPost.postVoivodeship}</b></p>
            <p className="postUser">Kategoria: <b>{this.state.CurrentPost.postCategory}</b></p>
            <p className="postUserLast">Dodano: <b>{this.state.CurrentPost.postCreatedAt}</b></p>
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


            {(this.state.RandomPost.RandomPhoto ? <div>
                <div className="fbContainer">
                <img className="SmallImage" src={this.state.RandomPost.RandomPhoto} alt="PiesFajnyJest zobacz również ten post!" />
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
                  <p className="postShare PostButtons">Opis <span className="AktualnosciBlank"></span></p>
                </Col>
                <Col className="PostItem">
                  <p className="postShare PostButtons">Aktualności  <span className="Aktualnosci">3</span></p>
                </Col>
                <Col className="PostItem">
                  <p className="postShare PostButtons">Komentarze <span className="Aktualnosci">3</span></p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <p className="PostText">{this.state.CurrentPost.postDescription}</p>
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
      </div>
    );
  }

}
