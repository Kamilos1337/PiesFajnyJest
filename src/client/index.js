import React from 'react';
import ReactDOM from 'react-dom';
import { App, Konto, Child } from './components/App';
import  EachPost  from './components/eachPost';
import AddPost from './components/addPost/main';
import  artykul  from './components/artykul';
import  Editor  from './components/add';
import  Posty  from './components/PostFinder';
import { Switch , Route, BrowserRouter } from 'react-router-dom'




ReactDOM.render((
   <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/dodajpost" component={AddPost} />
        <Route exact path="/konto" component={Konto} />
        <Route exact path="/:postPath" component={EachPost}  />
        <Route  path="/posty/:pageNum" component={Posty}  />
        <Route  path="/artykul/:id" component={artykul}  />
        <Route  path="/adds/add" component={Editor}  />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
