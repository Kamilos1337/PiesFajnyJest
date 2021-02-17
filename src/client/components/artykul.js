import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Navbar100 from './Navbar/Navbar100';
import Footer from './footer';
import { Container, Row, Col, Input, FormGroup } from 'reactstrap';




export default class artykul extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      article:""
     };
  }



  componentDidMount () {
    fetch('/api/showArticle', {
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
    console.log(resp)
    this.setState({article:resp[0].html})
  });
  }


  render(props) {
    return(
      <div>
      <div dangerouslySetInnerHTML={{ __html: this.state.article }} />
      </div>
    );
  }

}
