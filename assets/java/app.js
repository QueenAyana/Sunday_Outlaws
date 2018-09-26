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

var favArray = [];
var dogArray = [];
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
    favArray = [];
    dogArray = [];
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
        document.getElementById('secondPage').style.display = 'block';
        // set active user zip code
        database.ref('accounts/' + uid).on("value", function (snapshot) {
            console.log("pulling zip " + snapshot.val().zip);
            zipToSearch = snapshot.val().zip;
        });
        // Render to DOM each time the value changes
        database.ref('favorites/' + uid).on("value", function (snapshot) {
            $("#favorites").empty();
            favArray = JSON.parse(snapshot.val().favorite);
            for (let i = 0; i < favArray.length; i++) {
                let dogInfo2 = $("<div>");
                let dogImage2 = $("<img>").attr("src", favArray[i].image);
                dogInfo2.append(dogImage2);
                dogInfo2.append("<br>");
                let dogName2 = $("<p>").innerHTML = favArray[i].name;
                dogInfo2.append(dogName2);
                dogInfo2.append("<br>");
                let dogAge2 = $("<p>").innerHTML = favArray[i].age;
                dogInfo2.append(dogAge2);
                dogInfo2.append("<br>");
                let dogAddress2 = $("<p>").innerHTML = favArray[i].address;
                dogInfo2.append(dogAddress2);
                dogInfo2.append("<br>");
                let dogCityState2 = $("<p>").innerHTML = favArray[i].city;
                dogInfo2.append(dogCityState2);
                dogInfo2.append("<br>");
                let dogPhone2 = $("<p>").innerHTML = favArray[i].phone;
                dogInfo2.append(dogPhone2);
                dogInfo2.append("<br>");
                let dogEmail2 = $("<p>").innerHTML = favArray[i].email;
                dogInfo2.append(dogEmail2);
                dogInfo2.append("<br>");
                let delTag = $("<button>").html("Remove from favorites");
                delTag.attr("type", "button").attr("data-index", + i).attr("id", "btnDel");
                dogInfo2.append(delTag);

                $("#favorites").append(dogInfo2);
                document.getElementById("favoriteContainer").style.display = 'block';

            }
        }, function (error) {
            console.error(error);
        });
    } else {
        console.log('not logged in');
        // hide dog search area
        document.getElementById('secondPage').style.display = 'none';
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
    document.getElementById("rescueContainer").style.visibility = 'hidden';
    document.getElementById("favoriteContainer").style.display = 'none';
    $('#signUpName').val('');
    $('#signUpPassword').val('');
    $('#signUpZip').val('');
    $("#signInError").empty();
    $("#dogPic").empty();
    $("#wiki").empty();
    $("#rescueDogs").empty();
    $("#favorites").empty();
}

window.onload = function () {
    clearAll();
};

$("#SignUpBtn").on("click", function () {
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

$("#signInBtn").on("click", function () {
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
$("#dropdownMenuButton").on("click", function () {
    document.getElementById("dogDropDown").classList.toggle("show");
    document.getElementById("rescueContainer").style.visibility = 'hidden';
});

//close drop down
window.onclick = function (event) {
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
$(".dropdown-item").on("click", function () {
    $("#dogPic").empty();
    $("#wiki").empty();
    $("#rescueDogs").empty();
    selectBreed = this.textContent;
    breed = selectBreed.toLowerCase();
    count = 5
    dogImageSearch();
    dogWiki();
    document.getElementById('moreRescueBtn').style.display = 'none';
    document.getElementById('nextImage').style.display = 'block';
    document.getElementById('btnSearch').style.display = 'block';

});

$("#nextImage").on("click", function () {
    dogImageSearch();
});

$("#btnSearch").on("click", function () {
    rescueSearch();
    document.getElementById('moreRescueBtn').style.display = 'block';
    document.getElementById("rescueContainer").style.visibility = 'visible';
});

// Random dog images by breed
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

// Run the image search again when it errors
$(document).ajaxError(function(e, xhr, opt){
    if (opt.url === ("https://dog.ceo/api/breed/" + breed + '/images/random')) {
        dogImageSearch();
    }
});

// Wiki API that finds summary text
function dogWiki() {
    if (breed === "akita" || breed === "chihuahua" || breed === "maltese" || breed === "papillon" || breed === "pointer" || breed === "pomeranian" || breed === "samoyed ") {
        $.ajax({
            url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + breed + '_(dog)',
        }).then(function (response) {
            let dogSummary = $("<p>").innerHTML = response.extract
            $("#wiki").append(dogSummary);
        })
    } else {
        $.ajax({
            url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + breed,
        }).then(function (response) {
            let dogSummary = $("<p>").innerHTML = response.extract
            $("#wiki").append(dogSummary);
        })
    }
}

// Increases the search count by 5 in the petfinder API and re-runs the search function
$("#moreRescueBtn").on("click", function () {
    count = count + 5;
    rescueSearch();
});

// Adds favorite to favArray and adds to firebase
$(document).on("click", "#btnFav", function () {
    let ind = this.dataset.index
    favArray.push(dogArray[ind]);
    firebase.database().ref().child('favorites').child(uid).set({
        favorite: JSON.stringify(favArray),
    });
});

// Removes from favArray and resets firebase
$(document).on("click", "#btnDel", function () {
    console.log("click");
    let ind2 = this.dataset.index
    favArray.splice(ind2, 1);
    firebase.database().ref().child('favorites').child(uid).set({
        favorite: JSON.stringify(favArray),
    });
})

function rescueSearch() {
    dogArray = [];
    $("#rescueDogs").empty();
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=' + zipToSearch + '&count=' + count + '&breed=' + selectBreed,
        dataType: 'jsonp',
    }).then(function (response) {
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
            let dogCityState = $("<p>").innerHTML = `${response.petfinder.pets.pet[i].contact.city.$t}, ${response.petfinder.pets.pet[i].contact.state.$t} ${response.petfinder.pets.pet[i].contact.zip.$t}`;
            dogInfo.append(dogCityState);
            dogInfo.append("<br>");
            let dogPhone = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.phone.$t;
            dogInfo.append(dogPhone);
            dogInfo.append("<br>");
            let dogEmail = $("<p>").innerHTML = response.petfinder.pets.pet[i].contact.email.$t;
            dogInfo.append(dogEmail);
            dogInfo.append("<br>");
            let favTag = $("<button>").html("Add to favorites");
            favTag.attr("type", "button").attr("data-index", + i).attr("id", "btnFav");
            dogInfo.append(favTag);

            let dogList = {
                image: response.petfinder.pets.pet[i].media.photos.photo[3].$t,
                name: dogName,
                age: dogAge,
                address: dogAddress,
                city: dogCityState,
                phone: dogPhone,
                email: dogEmail,
            }

            dogArray.push(dogList);
            $("#rescueDogs").append(dogInfo);
        }
    })
}

