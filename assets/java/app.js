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
var txtZip = document.getElementById('signUpZip')
const txtEmail = document.getElementById('signUpName');
const txtPassword = document.getElementById('signUpPassword');
const btnLogin = document.getElementById('signInBtn');
const btnSignUp = document.getElementById('SignUpBtn');
const btnLogOut = document.getElementById('logOutBtn');
// const txtFav = document.getElementById('fav');
// const btnFav = document.getElementById('btnFav');

var zipToSearch;

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
    const zip = txtZip.value;
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
            zip: zip,
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
        // store active user UID
        uid = firebase.auth().currentUser.uid;
        console.log("uid " + uid)
        // hide sign in area
        document.getElementById("hiddenAfter").style.display = 'none';
        // display dog search area
        document.getElementById('jumboPage').style.display = 'block';
        // set active user zip code
        database.ref('accounts/' + uid).on("value", function (snapshot) {
            console.log("pulling zip " +  snapshot.val().zip);
            zipToSearch =  snapshot.val().zip;
        });
        // Render to DOM each time the value changes
        // database.ref('favorites/' + uid).on("value", function (snapshot) {
        //     console.log("on value1" + snapshot.val().favorite);
        //     document.getElementById('display').innerHTML = snapshot.val().favorite;
        // }, function (error) {
        //     console.error(error);
        // });
    } else {
        console.log('not logged in');
        // hide dog search area
        document.getElementById('jumboPage').style.display = 'none';
        //display sign in area
        document.getElementById("hiddenAfter").style.display = 'block';
    }
});

//Get favorite on click event
// btnFav.addEventListener("click", f => {
//     const fav = txtFav.value;
//     firebase.database().ref().child('favorites').child(uid).set({
//         favorite: fav
//     });
// })



//APIs -------------------------------------------------------------------------------------------------------------------------------------------------
let breed;
let count = 5;

$("#btnSearch").on("click", function () {
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=' + zipToSearch + '&count=' + count + '&breed=' + selectBreed,
        dataType: 'jsonp',
    }).then( function(response) {
        console.log(response);
        for (let i = 0; i < response.petfinder.pets.pet.length; i++) {
            let dogInfo = $("<div>");
            let dogImage = $("<img>").attr("src", response.petfinder.pets.pet[i].media.photos.photo[3].$t);
            dogInfo.append(dogImage);
            dogInfo.append("<br>");
            let dogName = $("<p>").innerHTML = response.petfinder.pets.pet[i].name.$t;
            dogInfo.append(dogName);
            dogInfo.append("<br>");
            let dogAge = $("<p>").innerHTML = response.petfinder.pets.pet[i].age.$t;
            dogInfo.append(dogAge);
            dogInfo.append("<br>");
            let dogAddress = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.address1.$t;
            dogInfo.append(dogAddress);
            dogInfo.append("<br>");
            let dogPhone = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.phone.$t;
            dogInfo.append(dogPhone);
            dogInfo.append("<br>");
            let dogEmail = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.email.$t;
            dogInfo.append(dogEmail);
            $("#dogPic").append(dogInfo); 
        }
    })
});

// $("#submit2").on("click", function () {
//     $.ajax({
//         url: 'https://dog.ceo/api/breed/hound/images/random',
//     }).then(function (response) {
//         console.log(response);
//     })
// })

function dogImageSearch() {
    $.ajax({
        url: 'https://dog.ceo/api/breed/' + selectBreed +'/images/random',
    }).then(function (response) {
        console.log(response);
    })
}

$("#submit3").on("click", function () {
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=akita+dog&origin=*',
    }).then(function (response) {
        console.log(response);
    })
})



// Open drop down
$("#dropdownMenuButton").on("click", function() {
    document.getElementById("dogDropDown").classList.toggle("show");
});

//close drop down
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-toggle')) {
        var dropdowns = document.getElementsByClassName("dropdown-menu");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Get value from drop down
$(".dropdown-item").on("click", function(){
    selectBreed = this.innerHTML;
    console.log(selectBreed);
})


$("#dropdownMenuButton").onchange = function() {
    count = 5
    breed = $("#dropdownMenuButton").innerHTML
    dogImageSearch();
}

