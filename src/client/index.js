import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App, addPost, Konto, Child } from './components/App';
import  EachPost  from './components/EachPost';
import  Posty  from './components/PostFinder';
import { Switch , Route, BrowserRouter } from 'react-router-dom'


ReactDOM.render((
   <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/dodajpost" component={addPost} />
        <Route path="/konto" component={Konto} />
        <Route exact path="/:postPath" component={EachPost}  />
        <Route path="/posty/:pageNum" component={Posty}  />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
