var map;
var positionLive;
var livePos;

function findArea() {
	var geocoder = new google.maps.Geocoder();
	var address = $('#search-bar-text').val();
	console.log(address);
	if(address=='') {
		window.alert('You have to enter query first!');
	} else {
		geocoder.geocode(
		{
			address: address,
		}, function(results, status) {
			if(status==google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				map.setZoom(15);
			} else {
				window.alert('We could not find this location. Try something else.');
			}
		});
	}
}

function initMap() {
	
	var placeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('#search-bar-text'));

	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false
    });

    navigator.geolocation.getCurrentPosition(function(position) {
		livePos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}
		map.setCenter(livePos);
		map.setZoom(15);
	});

	$('#search-button').click(function () {
		findArea();
	});
}

// var geolocation = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBZmyyZG4VReSyxvi9tgTf7KbM7ElSgnn4';

$(function(){
	$ ('.tap-target').tapTarget('open');
});




// $.ajax({
//     url: geolocation,
//     dataType: 'json',
//     method: 'POST',
//     success: function(response) {
//         positionLive = new google.maps.LatLng(response.location.lat,response.location.lng);
//         console.log(response);
//         console.log(positionLive);
//     }
// });

