var socket = io();

//render the message alert to the screen
socket.on('comment', function (msg) {
    console.log("Got A Chat Message!")
    $('#alert').append("<div class='alert alert-warning alert-dismissible fade show' role='alert'> Got A Comment! "+msg+" <button type='button' class='close' data-dismiss='alert' aria-label='Close' <span aria-hidden='true'>&times;</span></button></div>")
})

//syncs mongo event to indexdb
//and renders to the screen and map
socket.on('Sync Event', function (msg) {
    console.log("! " + msg.id)
    //get the mongo event
    $.ajax({
        url: '/events/'+ msg.id.replace(/"/g, ""),
        type: "GET",
        contentType: 'application/json',
        success: function (data) {

            const item = {
                radius: data["radius"],
                mongodbID: data["_id"],
                title: data["title"],
                lat: data["lat"],
                lon: data["lon"],
                image: data["file"],
                created: data["created"]
            };

            //add the resulting data to the indexdb and render to screen/map
            events.put(item, data.id).then(function () {
                renderEvent(data.id,"#trending_posts");
                mapDb.add_event(data.id, item);
                console.log(data.id)
            })

        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
            console.log(err)
        }
    });
});

//syncs mongo post to indexdb
//and renders to the screen and map
socket.on('Sync Post', function (msg) {
    console.log("! " + msg.id);
    //get the mongo post
    $.ajax({
        url: '/posts/'+ msg.id.replace(/"/g, ""),
        type: "GET",
        contentType: 'application/json',
        success: function (data) {
            const item = {
                mongodbID: data._id,
                eventid: data.eventid,
                title: data.title,
                lat: data.lat,
                lon: data.lon,
                image: data.file,
                created: data.created
            };

            console.log(item);
            //save reponse to the index db
            posts.put(item, data.eventid).then(function (id) {
                renderPost(data.eventid, id,"post");
                mapDb.add_post(data.eventid, item);
                console.log(data.eventid)

            })

        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
            console.log(err)
        }
    });
});


//syncs mongo comment to indexdb
//and renders to the screen and map
socket.on('Sync Comment', function (msg) {
    console.log("! " + msg.id)
    //get the mongo comment
    $.ajax({
        url: '/comments/'+ msg.id.replace(/"/g, ""),
        type: "GET",
        contentType: 'application/json',
        success: function (data) {

            const item = {
                mongodbID: data._id,
                eventid: data["eventid"],
                comment: data["comment"],
                created: data["created"]
            };
            //save and render comment
            console.log(item);
            comments.put(item, data.eventid).then(function () {
                renderComment(data.eventid, item);
            });

        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
            console.log(err)
        }
    });
});


function makeMessage(msg) {
    socket.emit('comment', { msg: msg});
}
