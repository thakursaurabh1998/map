var map;
var positionLive;
var livePos;
var spots;
var markers = [];
var foursquare_client_id = "3VU3JPF4MALSI0PRWMV1VEVPWXO0HXACAEJDDNSB5GDHH0ZG"
var foursquare_client_secret = "YSBYZX0VSOEQO45P2D0MDM5OHKDFWKGSBUZ0JJXDK4S2W0AZ"
var short;


function findArea() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#search-bar-text').val();
    // console.log(address);
    if (address == '') {
        window.alert('You have to enter query first!');
    } else {
        geocoder.geocode({
            address: address,
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            } else {
                window.alert('We could not find this location. Try something else.');
            }
        });
    }
}

function initMap() {

    // var placeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('#s/earch-bar-text'));

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7413549, lng: -73.9980244 },
        zoom: 13,
        mapTypeControl: false
    });

    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    

    navigator.geolocation.getCurrentPosition(function(position) {
        livePos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        var posMarker = new google.maps.Marker({
	        position: livePos,
	        title: `${position.lat} ${position.lng}`,
	        icon: {
	            path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
	            scale: 4,
	            strokeColor: "blue"
	        },
	        animation: google.maps.Animation.DROP,
	    });

	    posMarker.setMap(map);

        map.setCenter(livePos);

        var foursquareURL = `https://api.foursquare.com/v2/venues/explore?limit=5&ll=${livePos.lat},${livePos.lng}&client_id=${foursquare_client_id}&client_secret=${foursquare_client_secret}&v=20170801&query=`

    	types.forEach(function(type){
    		$.ajax({
	            url: foursquareURL+type,
	            method: 'GET',
	            dataType: 'json',
	            success: function(response) {
	                spots = response.response.groups[0].items;
	                createPlaces(spots,type);
	                createMarkers(type);
	                // console.log(places);
	            }
	        });
    	});
    	
    });

    $('#search-button').click(function() {
        findArea();
    });
    $('#marker-disp').click(function(){
    	showMarkers();
    });
}

function createMarkers(type) {
	var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

	for(var i=0;i<5;i++){
    	short = places[type];
    	// console.log(short[i]);
    	var position = short[i].location;
        var title = short[i].name;
        var address = short[i].address;

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            address: address,
            animation: google.maps.Animation.DROP,
            id: short[i].id
        });
        // console.log(marker);
        markers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
        });
        bounds.extend(markers[i].position);
    	
    }  
}

function showMarkers() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent(`<div><h6>${marker.title}</h6></div><div style="max-width:150px;"><strong>Address:</strong> ${marker.address}</div>`);
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function() {
            infoWindow.setMarker = null;
        });
    }
}

$(function() {
    $('.tap-target').tapTarget('open');
    $('select').material_select();
});



/************************************************************************/
var types = ['Coffee','Pizza','Icecream','Buffet'];

var count=0;

var place = function(data){
	this.id = count++;
	this.name = data.venue.name;
	this.location = {
		lat: data.venue.location.lat,
		lng: data.venue.location.lng
	};
	this.address = data.venue.location.formattedAddress.join(" ");
};

var places = {
	Coffee: [],
	Pizza: [],
	Icecream: [],
	Buffet: []
};

var createPlaces = function(data,index) {
	data.forEach(function(i){
		places[index].push(new place(i));
	});	
};

// var category = function(data) {
// 	this.categoryData = ko.observableArray(data);
// }


var viewModel = function() {
	var self = this;
	this.categoryList = ko.observableArray([]);
	this.categoryList = types;
	// console.log(this.categoryList);
	// this.placesList = ko.observableArray([]);
	// for(var i=0;i<types.length;i++){
	// 	places[types[i]].forEach(function(singlePlace){
	// 		self.placesList.push(new category(singlePlace));
	// 	});
	// }
	

	// this.currentCategory = ko.observableArray(this.)
};




ko.applyBindings(new viewModel());