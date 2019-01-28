import firebase from 'firebase'
let config = {
    apiKey: "AIzaSyAkkkEK-mjkla5Px2SyXO_HplgvJvRffcs",
    authDomain: "selfskillsessions.firebaseapp.com",
    databaseURL: "https://selfskillsessions.firebaseio.com",
    projectId: "selfskillsessions",
    storageBucket: "selfskillsessions.appspot.com",
    messagingSenderId: "57983607028"
};
let fire = firebase.initializeApp(config);
export default fire;