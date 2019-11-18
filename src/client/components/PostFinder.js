import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Container, Row, Col, Button, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { IoLogoYoutube, IoLogoFacebook } from 'react-icons/io';
import { FiInstagram } from 'react-icons/fi';
import { Select, FormGroup, Label, Input } from 'reactstrap';
import Navbar100 from './Navbar/Navbar100';
import Footer from './footer';
import MultiSelect from "@khanacademy/react-multi-select";
import LoadingDog from './img/LoadingDog.gif';
import Map from './img/map.svg';

function ShowPagination(count) {
  const PostsCount = count.count;
  const pageNumber = count.pageNum;
  var x = <div> asd </div>;
  var Pages = 0;
  var AddPage=0;
  for(var getPag=0; getPag<PostsCount; getPag++){
    AddPage+=1;
    if(AddPage==19){
      AddPage=0;
      Pages+=1;
    }
  }
  if(AddPage>0){
    Pages+=1;
  }

  var Pagination = []
  var DisplayPag = []
  for(var makePag=1; makePag<Pages+1; makePag++){
    var Linkto = "/posty/"+makePag;
    if(makePag==pageNumber){
      Pagination.push(<button id="currentPage"  className="currentPage paginationButton" key={makePag}><a href={Linkto}>{makePag}</a></button>)
    }else{
      Pagination.push(<button className="paginationButton" href={Linkto} key={makePag}><a className="colorBlack" href={Linkto}>{makePag}</a></button>)
    }
  }

  for(var v=0; v<Pagination.length; v++){
    if(Pagination[v].props.id=="currentPage"){
      if(Pagination[v-3]){
        DisplayPag.push(Pagination[v-3])
      }
      if(Pagination[v-2]){
        DisplayPag.push(Pagination[v-2])
      }
      if(Pagination[v-1]){
        DisplayPag.push(Pagination[v-1])
      }
      if(Pagination[v]){
        DisplayPag.push(Pagination[v])
      }
      if(Pagination[v+1]){
        DisplayPag.push(Pagination[v+1])
      }
      if(Pagination[v+2]){
        DisplayPag.push(Pagination[v+2])
      }
      if(Pagination[v+3]){
        DisplayPag.push(Pagination[v+3])
      }
    }
  }

  return (
    <div className="PagDiv">
    {DisplayPag}
    </div>
  );
}


function ShowPosts(posts){

const content = posts.posts.map((post, i) =>
  <div key={i} className="SearchEachPost">
  <Card  className="postMain">
    <CardImg  src={"../src/client/upload/"+post.photo} onError={(e)=>{e.target.onerror = null; e.target.src="/src/client/dog.png" }} className="postImg" alt="Zdjęcie postu na PiesFajnyJest" />
    <CardBody>
      <CardTitle  className="postTitle">{post.title}</CardTitle>
      <CardSubtitle  className="postTags">{post.category}</CardSubtitle>
      <CardText >{post.description}</CardText>
      <Row>
      <CardImg  src={Map} className="mapImg mapInfos" alt="Województwo na piesfajnyjest.com" />
        <p className="mapPlace"> {post.voivodeship } </p>


      </Row>
      <Button className="postSubmit btn-danger"><Link to={post.link}>ZOBACZ OGŁOSZENIE</Link></Button>
    </CardBody>
  </Card>
  </div>

);


return (
  <div>
    {content}
  </div>
);
}

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Category: [],
      Voivodeship:[],
      NewOld:"Najnowsze",
      CurrentPosts:[],
      Loading:false,
      PostsCount:0
     };
  this.handleChange = this.handleChange.bind(this)
  this.FindPosts = this.FindPosts.bind(this)
}

componentDidUpdate() {

}


componentDidMount () {
  const { pageNum } = this.props.match.params
  this.setState({
    pageNum:pageNum,
  });

  fetch('/api/SearchPosts', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pageNum: pageNum,
    Category: ["Oddam psa", "Przygarne psa", "Pomoc dla psów", "Inne"],
    Voivodeship:["Dolnośląskie", "Kujawsko-Pomorskie", "Lubelskie", "Lubuskie", "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie", "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie", "Świętokrzyskie", "Warmińsko-Mazurskie", "Wielkopolskie", "Zachodniopomorskie"],
    NewOld:this.state.NewOld,
  }),
})
.then(resp => resp.json())
.then(resp => {

  for(let Lx=0; Lx<resp.length; Lx++){
    if(resp[Lx].description.length>100){
      resp[Lx].description = resp[Lx].description.slice(0,100) + "...";
    }
  }
  if(resp.length>0){
    this.setState({
      PostsCount:resp[0].count,
      CurrentPosts:resp
    });
}
console.log(resp);



  })

}

handleChange(event) {
  const target = event.target;
  var value = target.value;
  var name = target.id;
  this.setState({
   [name]: value
  });
}

FindPosts(){
  this.setState({CurrentPosts:[], pageNum:1})
  history.pushState({}, null, '/posty/1');
  var CategoryVar  = this.state.Category;
  var VoivodeshipVar  = this.state.Voivodeship;
  if(this.state.Category.length==0){
    CategoryVar = ["Oddam psa", "Przygarne psa", "Pomoc dla psów", "Inne"]
  }
  if(this.state.Voivodeship.length==0){
    VoivodeshipVar = ["Dolnośląskie", "Kujawsko-Pomorskie", "Lubelskie", "Lubuskie", "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie", "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie", "Świętokrzyskie", "Warmińsko-Mazurskie", "Wielkopolskie", "Zachodniopomorskie"]
  }

  fetch('/api/SearchPosts', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pageNum: 1,
    Category: CategoryVar,
    Voivodeship: VoivodeshipVar,
    NewOld:this.state.NewOld,
  }),
})
.then(resp => resp.json())
.then(resp => {

  for(let Lx=0; Lx<resp.length; Lx++){
    if(resp[Lx].description.length>100){
      resp[Lx].description = resp[Lx].description.slice(0,100) + "...";
    }
  }
  if(resp.length>0){
    this.setState({
      CurrentPosts:resp,
      PostsCount:resp[0].count,
    });

}
  })
}

     render(props){

       const CategoryOptions = [
          {label: "Oddam psa", value: "Oddam psa"},
          {label: "Przygarne psa", value: "Przygarne psa"},
          {label: "Pomoc dla psów", value: "Pomoc dla psów"},
          {label: "Inne", value: "Inne"},
        ];

        const VoivodeshipOptions = [
           {label: "Dolnośląskie", value: "Dolnośląskie"},
           {label: "Kujawsko-Pomorskie", value: "Kujawsko-Pomorskie"},
           {label: "Lubelskie", value: "Lubelskie"},
           {label: "Lubuskie", value: "Lubuskie"},
           {label: "Łódzkie", value: "Łódzkie"},
           {label: "Małopolskie", value: "Małopolskie"},
           {label: "Mazowieckie", value: "Mazowieckie"},
           {label: "Opolskie", value: "Opolskie"},
           {label: "Podkarpackie", value: "Podkarpackie"},
           {label: "Podlaskie", value: "Podlaskie"},
           {label: "Pomorskie", value: "Pomorskie"},
           {label: "Śląskie", value: "Śląskie"},
           {label: "Świętokrzyskie", value: "Świętokrzyskie"},
           {label: "Warmińsko-Mazurskie", value: "Warmińsko-Mazurskie"},
           {label: "Wielkopolskie", value: "Wielkopolskie"},
           {label: "Zachodniopomorskie", value: "Zachodniopomorskie"},
         ];

        const {Category} = this.state;
        const {Voivodeship} = this.state;
        const {NewOld} = this.state;
       return(
         <div className="PostFinder">
          <Navbar100/>
          <Container>
          <Row className="BlocksRow">
            <Col>
              <span className="SearchNums1">1</span>
              <span className="SearchBlocks">Zastanów się czego szukasz</span>
            </Col>

            <Col>
            <span  className="SearchNums2">2</span>
            <span className="SearchBlocks">Wybierz odpowiednie kryteria</span>
            </Col>


            <Col>
              <span  className="SearchNums3">3</span>
            <span className="SearchBlocks">Zacznij szukać</span>
            </Col>


          </Row>
            <Row className="FindFirstRow">
              <Col>

               <FormGroup className="FormGroupFind">

                        <MultiSelect
                               className="SelectFind"
                               options={CategoryOptions}
                               selected={Category}
                               onSelectedChanged={Category => this.setState({Category})}
                               overrideStrings={{
                               selectSomeItems: "Wybierz kategorie",
                               allItemsAreSelected: "Wszystkie kategorie",
                               selectAll: "Wszystkie kategorie",
                               search: "Znajdź w wyszukiwarce",
                           }}
                         />

                         <Input type="select" value={this.state.value} onChange={this.handleChange}  id="NewOld" className="SelectFind" name="select">
                             <option value="Najnowsze">Najnowsze</option>
                             <option value="Najstarsze">Najstarsze</option>
                           </Input>

                         <MultiSelect
                                className="SelectFind"
                               options={VoivodeshipOptions}
                               selected={Voivodeship}
                               onSelectedChanged={Voivodeship => this.setState({Voivodeship})}
                               overrideStrings={{
                               selectSomeItems: "Wybierz województwo",
                               allItemsAreSelected: "Wszystkie województwa",
                               selectAll: "Wszystkie województwa",
                               search: "Znajdź w wyszukiwarce",
                           }}
                         />




              </FormGroup>
              </Col>
            </Row>
            <Button  className="FindPosts" id="changePassword" onClick={this.FindPosts} color="danger" >Szukaj posty</Button>
            <Row className="SearchAllPosts">
              <Col>
              {
                this.state.CurrentPosts.length>0 ? <ShowPosts posts={this.state.CurrentPosts}/> :   <div className="Loading"><img src={LoadingDog} alt="loading..." /><p>Poczekaj chwile! Już biegne po twoje posty.</p></div>


              }

              </Col>
            </Row>

            <Row className="Pagination">
              <Col>
                <ShowPagination count={this.state.PostsCount} pageNum={this.state.pageNum}/>
              </Col>
            </Row>
          </Container>
          <Footer/>
         </div>
       );
     }





}
