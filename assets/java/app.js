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
var uid = '';
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogOut = document.getElementById('btnLogOut');
const txtFav = document.getElementById('fav');
const btnFav = document.getElementById('btnFav');

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

    // let newUser = {
    //     email: email,
    //     password: pass
    // }

    // Create User
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(function () {
        uid = firebase.auth().currentUser.uid;
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
        uid = firebase.auth().currentUser.uid;
        console.log("uid " + uid)
        // Render to DOM each time the value changes
        database.ref('favorites/' + uid).on("value", function (snapshot) {
            console.log("on value1" + snapshot.val().favorite);
            document.getElementById('display').innerHTML = snapshot.val().favorite;
        }, function (error) {
            console.error(error);
        });
    } else {
        console.log('not logged in');
    }
});

//Get favorite on click event
btnFav.addEventListener("click", f => {
    const fav = txtFav.value;
    firebase.database().ref().child('favorites').child(uid).set({
        favorite: fav
    });
})



//APIs -------------------------------------------------------------------------------------------------------------------------------------------------
let breed;
let zip;
let count = 5;
let offset = 5;

$("#submit").on("click", function () {
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=93111',
        dataType: 'jsonp',
    }).then( function(response) {
        console.log(response);
        for (let i = 0; i < count; i++) {
            let dogInfo = $("<div>");
            let dogImage = $("<img>").attr("src", response.petfinder.pets.pet[i].media.photos.photo[3].$t);
            dogInfo.append(dogImage);
            dogInfo.append("<br>");
            let dogName = $("<p>").innerHTML = response.petfinder.pets.pet[0].name.$t;
            dogInfo.append(dogName);
            dogInfo.append("<br>");
            let dogAge = $("<p>").innerHTML = response.petfinder.pets.pet[0].age.$t;
            dogInfo.append(dogAge);
            $("#petFinder").append(dogInfo); 
        }
    })
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





