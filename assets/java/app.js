
let breed;



$("#submit").on("click", function() {
    $.ajax({
        url: 'http://api.petfinder.com/pet.find?format=json&key=dd6e5fbe664a72d7558652f9ced0762f&animal=dog&location=93111',
        dataType: 'jsonp',
        success: function(dataWeGotViaJsonp){
            console.log(dataWeGotViaJsonp);
        }
     });

});