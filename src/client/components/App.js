import React from 'react';
import "./LoginModal";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Post from './Post';
import AddPost from './addPost/main';
import MainImage from './MainImage';
import Footer from './footer';
import Banner from './banner';
import PhotosWall from './photosWall';
import Contact from './contact';

class App extends React.Component {
  render(){
    return(
      <div>
      <MainImage/>
      <Post/>
      <Banner/>
      <PhotosWall/>
      <Contact/>
      <Footer/>
      </div>
    );
  }
}

class addPost extends React.Component {
  render(){
    return(
      <div>
      <AddPost/>
      </div>
    );
  }
}

export { App, addPost };
