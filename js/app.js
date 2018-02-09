var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: 40.7413549, lng: -73.9980244},
        center: { lat: 30.748882, lng: 76.641358 },
        zoom: 13,
        mapTypeControl: false
    });
}

$(function(){
	$ ('.tap-target').tapTarget('open');
});