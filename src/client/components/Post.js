import React from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Card, Row, Col, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
  import Container from 'react-bootstrap/Container'
  import Badge from 'react-bootstrap/Badge'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Route, Link } from 'react-router-dom'


export default class Post extends React.Component {
  constructor(props) {
    super(props);

    this.displayPostsSlider = this.displayPostsSlider.bind(this);
    this.LeftArrow = this.LeftArrow.bind(this);
    this.RightArrow = this.RightArrow.bind(this);
    setTimeout(this.displayPostsSlider, 200);

    this.state = {
      isLoading: true,
      userLogin: localStorage.getItem('userLogin'),
      userEmail:localStorage.getItem('userEmail'),
      firstTime:localStorage.getItem('firstTime'),
      MainPosts:"Brak postów"

     };
}
componentDidMount () {
  //  const { postPath } = this.props.match.params
  //  console.log(postPath) // undefined
  }

componentDidUpdate() {
  if(this.state.MainPosts!=="Brak postów" && this.state.isLoading==true){
    this.setState({isLoading: false})

  }
}


displayPostsSlider(){
  fetch('/api/displayPostsSlider', {
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
  var reader = new FileReader();
  for(let Lx=0; Lx<resp.length; Lx++){
    if(resp[Lx].description.length>100){
      resp[Lx].description = resp[Lx].description.slice(0,100) + "...";
    }
  }
  this.setState({
    MainPosts: resp
  });

})

}

LeftArrow(){
  document.getElementsByClassName('react-multiple-carousel__arrow--left')[0].click();
}
RightArrow(){
  document.getElementsByClassName('react-multiple-carousel__arrow--right')[0].click();
}
  render(props) {

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
    breakpoint: { max: 1024, min: 770 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 770, min: 0 },
    items: 1,
  },
};


    return (

      <Container className="marginTop50">
      <Row className="newPostsRow">
      <Col>
      <h3 className="newPostsHeader"><img src="/public/right-arrow.png" className="LeftArrow" onClick={this.LeftArrow} alt="PiesFajnyJest.com najnowsze posty" />
Najnowsze posty <Badge variant="secondary" id="TEST">WSZYSTKIE</Badge>
<img src="/public/right-arrow.png" className="RightArrow" onClick={this.RightArrow} alt="PiesFajnyJest.com najnowsze posty" />
</h3>
      </Col>
      </Row>
{  this.state.isLoading ? <div className="Loading"><img src="/public/LoadingDog.gif" className="LoadingDog" alt="loading..." /><p className="loadingText">Ładowanie postów</p></div> :
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
              <CardImg  src={"./src/client/upload/"+this.state.MainPosts[item].photo} onError={(e)=>{e.target.onerror = null; e.target.src="/public/dog.png"}} className="postImg" alt="Zdjęcie postu na PiesFajnyJest" />
              <CardBody>
                <CardTitle  className="postTitle">{this.state.MainPosts[item].title}</CardTitle>
                <CardSubtitle  className="postTags">{this.state.MainPosts[item].category}</CardSubtitle>
                <CardText >{this.state.MainPosts[item].description}</CardText>
                <Row>
                <CardImg  src="/public/map.svg" className="mapImg mapInfos" alt="Card image cap" />
                  <p className="mapPlace"> {this.state.MainPosts[item].voivodeship } </p>


                </Row>
                <Button className="postSubmit btn-danger allWidth"><Link to={this.state.MainPosts[item].link}>ZOBACZ OGŁOSZENIE</Link></Button>
              </CardBody>
            </Card>
              </Col>
    ))

}





</Carousel>
 }
            </Container>






    );
  }

}
