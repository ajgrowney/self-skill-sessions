import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './index.css';
import App from './App';
import SignIn from './SignIn';
import fire from './fire';
import * as serviceWorker from './serviceWorker';

(fire.auth().currentUser === null) ? (ReactDOM.render(<SignIn />, document.getElementById('root'))) : (ReactDOM.render(<App />, document.getElementById('root')));

fire.auth().onAuthStateChanged((fbUser) => {
    if(fbUser){
        ReactDOM.render(<App />, document.getElementById('root'))
    }
})
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
