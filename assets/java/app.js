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
const btnLogin = document.getElementById('loginSubmit');
const btnSignUp = document.getElementById('signUpSubmit');
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
    $("#signInError").empty();
    // Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => 
        $("#signInError").append(e.message));
})

btnSignUp.addEventListener('click', e => {
    // Get email and pass
    // TO DO: Validate email
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const zip = txtZip.value;
    const auth = firebase.auth();

    // Create User
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(function () {
        uid = firebase.auth().currentUser.uid;
        $("#signInError").empty();
        firebase.database().ref().child('accounts').child(uid).set({
            email: email,
            zip: zip,
            userId: uid
        });

    });
    promise.catch(e =>
        $("#signInError").append(e.message));
});

btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
    clearAll();
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

 // Clearing Sign In Info --------------------------------------------------------------

 function clearAll() {
    document.getElementById('moreRescueBtn').style.display = 'none';
    document.getElementById('nextImage').style.display = 'none';
    document.getElementById('btnSearch').style.display = 'none';
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('passwordForm').style.display = 'none';
    document.getElementById('zipForm').style.display = 'none';
    document.getElementById('signUpSubmit').style.display = 'none';
    document.getElementById('loginSubmit').style.display = 'none';
    $('#signUpName').val('');
    $('#signUpPassword').val('');
    $('#signUpZip').val('');
    $("#signInError").empty();
    $("#dogPic").empty();
    $("#wiki").empty();
    $("#rescueDogs").empty();

 }

 window.onload = function() {
clearAll();
};

$("#SignUpBtn").on("click", function() {
    document.getElementById('emailForm').style.display = 'block';
    document.getElementById('passwordForm').style.display = 'block';
    document.getElementById('zipForm').style.display = 'block';
    document.getElementById('signUpSubmit').style.display = 'block';
    document.getElementById('loginSubmit').style.display = 'none';
    $('#signUpName').val('');
    $('#signUpPassword').val('');
    $('#signUpZip').val('');
    $("#signInError").empty();
});

$("#signInBtn").on("click", function() {
    document.getElementById('loginSubmit').style.display = 'block';
    document.getElementById('emailForm').style.display = 'block';
    document.getElementById('passwordForm').style.display = 'block';
    document.getElementById('zipForm').style.display = 'none';
    document.getElementById('signUpSubmit').style.display = 'none';
    $('#signUpName').val('');
    $('#signUpPassword').val('');
    $('#signUpZip').val('');
    $("#signInError").empty();
})
    
    
//Petfinder -------------------------------------------------------------------------------------------------------------------------------------------------
let count = 5;

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
    $("#dogPic").empty();
    $("#wiki").empty();
    $("#rescueDogs").empty();
    selectBreed = this.textContent;
    console.log(selectBreed);
    breed = selectBreed.toLowerCase();
    count = 5
    dogImageSearch();
    dogWiki();
    document.getElementById('moreRescueBtn').style.display = 'none';
    document.getElementById('nextImage').style.display = 'block';
    document.getElementById('btnSearch').style.display = 'block';
   
});

$("#nextImage").on("click", function() {
    dogImageSearch();
});

$("#btnSearch").on("click", function () {
    rescueSearch();
    document.getElementById('moreRescueBtn').style.display = 'block';
});

function dogImageSearch() {
    $("#dogPic").empty();
    $.ajax({
        url: 'https://dog.ceo/api/breed/' + breed + '/images/random',
        method: "GET"
    }).then(function (response) {
        let randomPic = $("<img>").attr("src", response.message);
        $("#dogPic").append(randomPic);
    })
}

function dogWiki() {
    $.ajax({
        url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + breed,
    }).then(function (response) {
        console.log(response);
        let dogSummary = $("<p>").innerHTML = response.extract
        $("#wiki").append(dogSummary);
    })
}

$("#moreRescueBtn").on("click", function() {
    count = count + 5;
    rescueSearch();
});

function rescueSearch() {
    $("#rescueDogs").empty();
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
            let dogCityState  = $("<p>").innerHTML = `${response.petfinder.pets.pet[i].contact.city.$t}, ${response.petfinder.pets.pet[i].contact.state.$t} ${response.petfinder.pets.pet[i].contact.zip.$t}`
            dogInfo.append(dogCityState);
            dogInfo.append("<br>");
            let dogPhone = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.phone.$t;
            dogInfo.append(dogPhone);
            dogInfo.append("<br>");
            let dogEmail = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.email.$t;
            dogInfo.append(dogEmail);
            $("#rescueDogs").append(dogInfo); 
        }
    })
}

