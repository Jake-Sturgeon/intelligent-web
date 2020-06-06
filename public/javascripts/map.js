/**
 * Mapping Class, produces the leafletJS front-end creation. Additionally deals with the creation of modals.
 *
 * @module map-module
 * @class map
 */


/**
 * Method to open the event modal.
 *
 * @method openEventModal()
 * @return Opens modal with id "#eventModal'
 */
function openEventModal(){
    $('#eventModal').modal()
}

/**
 * Method to open selfie modal
 *
 * @method openSelfieModal()
 * @return Opens modal with id "#selfieModal'
 */
function openSelfieModal(){
    $('#selfieModal').modal()
}

/**
 * Returns view for map
 *
 * @method openSelfieModal()
 * @return Opens modal with id "#selfieModal'
 */
function postView(data){
    return "<div class=''container-fluid><h2>" + data['title'] + "</h2><p>"+ data['created'] + "</p><img class='img-fluid' src="+data['image']+">"
}

function eventView(data){
    return "<div class=''container-fluid><h2>" + data['title'] + "</h2><p>"+ data['created']+ "</p><img class='img-fluid' src="+data['image']+"><button onclick='openSelfieModal()' class='btn btn-primary'>Add To This Event</button></div>"
}

/**
 * Jquery document on ready for mapping module.
 * @submodule Map - On Document Ready
 */
var map;
var selfieIcon;

$(document).ready(() => {

    navigator.geolocation.getCurrentPosition(function(location) {
        var userlocation = new L.LatLng(location.coords.latitude, location.coords.longitude);
        var marker = L.marker(userlocation).addTo(map);
    });
    var items = [];

    var counter = 0;
    map = new L.map('mapid', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([53.382, -1.47], 13);
    selfieIcon = L.icon({
        iconUrl: './images/Selfie_icon.png',
        shadowUrl: './images/Selfie_icon_shadow.png',
        iconSize:     [50, 50], // size of the icon
        shadowSize:   [50, 50], // size of the shadow
        iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
        shadowAnchor: [-5, 30],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 5,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZGFtYmVtIiwiYSI6ImNqczgyZmZ3MzEzOTMzeXJuODFmbjRrbjYifQ.cerkLIWoRAz2aGASHP_VaQ'
    }).addTo(map);
    
    const mapDb = {
        async event() {
            await dbPromise.then(function (db) {
                var tx = db.transaction('events', 'readonly');
                var store = tx.objectStore('events');
                return store.openCursor();
            }).then(function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                var circle = L.circle([cursor.value['lat'], cursor.value['lon']], {
                    radius: 1000,
                    eventid: cursor.value['id']
                }).addTo(map)
                circle.bindPopup(eventView(cursor.value));
                circle.on("click", circleClick);
                return cursor.continue().then(logItems);
            }).then(function () {
                console.log('Done cursoring');
            });
        },
        async post() {
            await dbPromise.then(function (db) {
                var tx = db.transaction('posts', 'readonly');
                var store = tx.objectStore('posts');
                return store.openCursor();
            }).then(function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                var marker = L.marker([cursor.value['lat'], cursor.value['lon']], {
                    icon: selfieIcon,
                }).addTo(map)
                marker.bindPopup(postView(cursor.value));
                return cursor.continue().then(logItems);
            }).then(function () {
                console.log('Done cursoring');
            });
        },
    };


    mapDb.event(map);
    mapDb.post(map,selfieIcon);

    /**
     * Method to open the event modal.
     *
     * @method openEventModal()
     * @return Opens modal with id "#eventModal'
     */
    function onMapClick(e) {
        $('input[id="event_lat"]').val(e.latlng['lat']);
        $('input[id="event_lon"]').val(e.latlng['lng']);
        $('input[id="event_radius"]').val(100);
        popup
            .setLatLng(e.latlng)
            .setContent("<p>You clicked the map at " + e.latlng.toString() + "</p><div><button class=\"btn btn-primary\" onclick='openEventModal()'> Create New Event </button></div>")
            .openOn(map);
    }
    // $('#sync').click(function() {
    //         mapDb.post(map,selfieIcon);
    //         mapDb.event(map);
    //     }
    // );
    // $('#eventCreate').click(function() {
    //     mapDb.event();
    // });

    // $('#eventModal').on('hidden.bs.modal', function (e) {
    //     console.log(e)
    //     mapDb.event(map);
    // })


    map.on('click', onMapClick);
    var popup = L.popup()
        .setLatLng([53.382, -1.47])
        .setContent("<h4>Click on an event to see details, or click on the map to create your own!</h4>")
        .openOn(map);
});
