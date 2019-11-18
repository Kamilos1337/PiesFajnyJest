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
import Profile from './profile';
import PostFinder from './PostFinder';

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

class Konto extends React.Component {
  render(){
    return(
      <div>
      <Profile/>
      </div>
    );
  }
}

class Posty extends React.Component {
  render(){
    return(
      <div>
      <PostFinder/>
      </div>
    );
  }
}



export { App, addPost, Konto, Posty };
