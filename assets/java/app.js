
let breed;
let zip;
let count = 5;
let offset = 5;

$("#submit").on("click", function() {
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=93111',
        dataType: 'jsonp',
        success: function(dataWeGotViaJsonp){
            console.log(dataWeGotViaJsonp);
        }
     });

});

$("#submit2").on("click", function() {
    $.ajax({
        url: 'https://dog.ceo/api/breed/hound/images/random',
    }).then(function(response) {
        console.log(response);
    })
})

$("#submit3").on("click", function() {
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=akita+dog&origin=*',
    }).then(function(response) {
        console.log(response);
    })
})





