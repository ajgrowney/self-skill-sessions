import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './index.css';
import App from './views/App';
import SignIn from './views/SignIn';
import fire from './fire';
import * as serviceWorker from './serviceWorker';

if (fire.auth().currentUser === null){
    // No current user: prompt a login
    ReactDOM.render(<SignIn />, document.getElementById('root'));
}else{
    // User is logged in: let's go
    ReactDOM.render(<App />, document.getElementById('root'));
}

fire.auth().onAuthStateChanged((fbUser) => {
    // Check if the user exists now
    if (fbUser) {
        // They are logged in
        ReactDOM.render(<App />, document.getElementById('root'))
    }
})
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
