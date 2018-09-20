//Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBbb8cOQMkMRgQlbZX-v6GVyl1ecTXf5B0",
    authDomain: "project1-86e58.firebaseapp.com",
    databaseURL: "https://project1-86e58.firebaseio.com",
    projectId: "project1-86e58",
    storageBucket: "project1-86e58.appspot.com",
    messagingSenderId: "173254637504"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


// Get elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogOut = document.getElementById('btnLogOut');

// Add login event
btnLogin.addEventListener('click', e => {
    //Get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    // Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
})

btnSignUp.addEventListener('click', e => {
    // Get email and pass
    // TO DO: Validate email
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    let newUser = {
        email: email,
        password: pass
    }

    // Create User
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(function () {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref().child('accounts').child(uid).set({
            email: email,
            userId: uid
        });

        //database.ref().push(newUser)
    });
    promise.catch(e =>
        console.log(e.message));
});

btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
})

// Add a realtime authentication listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('not logged in');
    }
});

// save the user's profile into Firebase so we can list users,
// use them in Security and Firebase Rules, and show profiles
function writeUserData(uid, email) {
    firebase.database().ref('users/' + uid).set({
        email: email
        //some more user data
    });
}



//APIs
let breed;
let zip;
let count = 5;
let offset = 5;

$("#submit").on("click", function () {
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=93111',
        dataType: 'jsonp',
        success: function (dataWeGotViaJsonp) {
            console.log(dataWeGotViaJsonp);
        }
    });

});

$("#submit2").on("click", function () {
    $.ajax({
        url: 'https://dog.ceo/api/breed/hound/images/random',
    }).then(function (response) {
        console.log(response);
    })
})

$("#submit3").on("click", function () {
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=akita+dog&origin=*',
    }).then(function (response) {
        console.log(response);
    })
})





