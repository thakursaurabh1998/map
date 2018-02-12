var map;
var positionLive;
var livePos;
var spots;
var markers = [];
var foursquare_client_id = "3VU3JPF4MALSI0PRWMV1VEVPWXO0HXACAEJDDNSB5GDHH0ZG"
var foursquare_client_secret = "YSBYZX0VSOEQO45P2D0MDM5OHKDFWKGSBUZ0JJXDK4S2W0AZ"
var short;
var allMarkers=[];
var searchLocation;
var posMarker;
var last;
var lastInfoWindow;
var bouncingMarker;


function findArea() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#search-bar-text').val();
    
    if (address == '') {
        window.alert('You have to enter query first!');
    } else {
        geocoder.geocode({
            address: address,
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            	searchLocation = results[0].geometry.location
                map.setCenter(searchLocation);
                map.setZoom(15);
                searchLocation = {lat: searchLocation.lat(), lng: searchLocation.lng()};
                createJSON(searchLocation);                
            } else {
                window.alert('We could not find this location. Try something else.');
            }
        });
    }
}

function gps() {
	navigator.geolocation.getCurrentPosition(function(position) {
        livePos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        if(posMarker)
        	posMarker.setMap(null);

        posMarker = new google.maps.Marker({
	        position: livePos,
	        title: `${position.lat} ${position.lng}`,
	        icon: {
	            path: google.maps.SymbolPath.CIRCLE,
	            scale: 4,
	            strokeColor: "skyblue"
	        },
	        animation: google.maps.Animation.DROP,
	    });

        createJSON(livePos);

	    posMarker.setMap(map);

        map.setCenter(livePos);

        map.setZoom(15);
    });
}

function showAllMarkers(){
	var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(map);
        bounds.extend(allMarkers[i].position);
    }
    map.fitBounds(bounds);
};

function initMap() {
	var defaultLocation = { lat: 40.7413549, lng: -73.9980244 };
    var placeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('search-bar-text'));

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false
    });

    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    createJSON(defaultLocation);

    gps();

    $('#search-button').click(function() {
        findArea();
    });
    $('#all-markers').click(function(){
    	showAllMarkers();
    });
    $('#marker-hide').click(function(){
    	hideMarkers();
    });
    $('#gps').click(function(){
    	gps();
    });
}


function createJSON(livePos){

	allMarkers = [];
	markers = [];
	for(var i=0;i<4;i++){
		places[types[i]] = [];
	}

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
            }
        });
	});
}

function createMarkers(type) {
	markers = [];
	var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

	for(var i=0;i<5;i++){
    	short = places[type];
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
        markers.push(marker);
        allMarkers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
            toggleBounce(this);
        });
        bounds.extend(markers[i].position);

    	
    }  
}

function showMarkers() {
	hideAllMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideAllMarkers() {
    for (var i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(null);
    }
}

function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    hideAllMarkers();
}

function toggleBounce(marker) {
    if(last)
        last.setAnimation(null);

    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    last = marker;
}

function populateInfoWindow(marker, infoWindow) {
    if(lastInfoWindow)
        lastInfoWindow.close();

    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        infoWindow.setContent(`<div><h6>${marker.title}</h6></div><div style="max-width:150px;"><strong>Address:</strong> ${marker.address}</div>`);
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function() {
            infoWindow.setMarker = null;
        });
    }
    lastInfoWindow = infoWindow;
}

$(function() {
    // $('.tap-target').tapTarget('open');
    $('select').material_select();
    $('#menu').click(function(){
    	$('#float').toggleClass('floating-panel-open');
    });
    viewModel.populate;
});





/**************************VIEWMODEL******************************/




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

var viewModel = function() {
	var self = this;
	this.categoryList = ko.observableArray([]);

	this.categoryList = types;

	this.currentCategory = ko.observable();

    this.currentCategory = ko.observable(this.categoryList[0]);

    this.listPlaces = ko.observableArray([]);

    this.showParticularMarker = function(marker){
        markers.forEach(function(single){
            if(single.title===marker)
                bouncingMarker = single;
        });
        toggleBounce(bouncingMarker);
        var largeInfoWindow = new google.maps.InfoWindow();
        populateInfoWindow(bouncingMarker,largeInfoWindow);
    }

    this.populate = function(type) {
        self.listPlaces.removeAll();
        for(var j=0;j<5;j++){
            self.listPlaces.push(places[type.currentCategory()][j].name);
        }
    };

	this.changePlace = function() {
		hideMarkers();
		hideAllMarkers();
		if(self.currentCategory()===undefined){
			showAllMarkers();
            self.populate();
		} else {
			createMarkers(self.currentCategory());
			showMarkers();
		}
	};
};


ko.applyBindings(new viewModel());