/**
 * This is used to add events and post.
 *
 * @module map-module
 * @class map-interface
 * @requires map
 */
const mapDb = {
    //Used to load all existing events to the map
    async event(mymap) {
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
            })
            circle.bindPopup(eventView(cursor.value));
            circle.on("click", circleClick);
            var group = L.layerGroup([circle]);
            console.log(group);
            group.addTo(mymap);
            return cursor.continue().then(logItems);
        }).then(function () {
            console.log('Done cursoring');
        });
    },
    //Used to load all existing posts to the map
    async post(mymap,selfieIcon) {
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
                eventid: cursor.value['eventid']
            }).addTo(mymap)
            marker.bindPopup(postView(cursor.value));

            var m = L.layerGroup([marker]);
            m.addTo(mymap);

            mymap.eachLayer(function(layer){
                console.log(layer);
            });

            return cursor.continue().then(logItems);
        }).then(function () {
            console.log('Done cursoring');
        });
    },
    //Used to add a new post to the map
    async add_post(id, data) {
        var marker = L.marker([data["lat"], data["lon"]], {
            icon: selfieIcon,
            eventid: data['eventid']
        }).addTo(map)
        console.log(data)
        marker.bindPopup(postView(data));
        var m = L.layerGroup([marker]);
        m.addTo(map);
        map.closePopup();

    },
    //Used to add a new event to the map
    async add_event(id, data) {
        var circle = L.circle([data['lat'], data['lon']], {
            radius: 1000,
            eventid: id
        })
        circle.bindPopup(eventView(data));
        circle.on("click", circleClick);
        var m = L.layerGroup([circle]);
        m.addTo(map);
        map.closePopup();

    },
};

function circleClick(e) {
    $('input[id="post_lat"]').val(e.latlng['lat']);
    $('input[id="post_lon"]').val(e.latlng['lng']);
    $('input[id="post_radius"]').val(e.target.options.radius);
    $('input[id="post_eventid"]').val(e.target.options.eventid);
}