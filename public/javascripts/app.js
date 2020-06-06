/**
 * App.js, provides main methods of submitting events, as well as generic helper functions
 * @class app.js public
 */

/**
 * Submit event, used when creating a new event, saves it to the database
 * @method submitEvent
 */
function submitEvent(){
    var s = $('#submit_event');
    var form = s.serializeArray();
    var image_data = $('#eventpicpic').attr('src')

    var data = {};
    for (index in form) {
        data[form[index].name] = form[index].value;
    }
    // Create data-item
    var item = {
        radius: data["radius"],
        mongodbID: null,
        title: data["title"],
        lat: data["lat"],
        lon: data["lon"],
        image: image_data,
        created: new Date().getTime()
    };

    // creates indexdb id
    //sends the result to mongodb
    //emit to everyone that there has been a new event
    //else render locally
    events.count().then(function (id) {
        $.ajax({
            url: '/events/create',
            type: "POST",
            data: JSON.stringify({
                id: id + 1,
                radius: item["radius"],
                title: item["title"],
                lat: item["lat"],
                lon: item["lon"],
                file: item["image"],
                created: item["created"]
            }),
            contentType: 'application/json',
            success: function (mid) {
                socket.emit('Sync Event', { id: mid });
            },
            error: function (err) {
                console.log(item)
                // alert('Error: ' + err.status + ':' + err.statusText);
                events.add(item).then(function (iid) {
                    renderEvent(iid,"#trending_posts");
                    mapDb.add_event(iid, item);
                })
            }
        });
    });

    document.getElementById("submit_event").reset();
}

/**
 * submitPosts, creates a new post on an event
 *
 * @method submitPost
 * @param {Integer} id Event ID
 */
function submitPost(){
    var s = $('#submit_post');
    var form = s.serializeArray();
    var data = {};
    var image_data = $('#selfiepic').attr('src')
    for (index in form) {
        data[form[index].name] = form[index].value;
    }

    //create index item
    var item = {
        eventid: data["eventid"],
        mongodbID: null,
        title: data["title"],
        lat: data["lat"],
        lon: data["lon"],
        image: image_data,
        created: new Date().getTime()
    };

    // creates indexdb id
    //sends the result to mongodb
    //emit to everyone that there has been a new post
    //else render locally
    posts.count().then(function (id) {
        console.log(id + "Indexdb id")
        $.ajax({
            url: '/posts/create',
            type: "POST",
            data: JSON.stringify({
                id: id+1,
                eventid: item["eventid"],
                title: item["title"],
                lat: item["lat"],
                lon: item["lon"],
                image: item["image"],
                created: item.created
            }),
            contentType: 'application/json',
            success: function (mid) {
                console.log(mid)
                socket.emit('Sync Post', { id: mid });
            },
            error: function (err) {
                alert('Error: ' + err.status + ':' + err.statusText);
                console.log(err)
                posts.add(item).then(function (iid) {
                    renderPost(item["eventid"], iid,"post");
                    mapDb.add_post(item["eventid"], item)
                })
            }
        });
    }).then(function () {

    });
}


/**
 * Render Post
 *
 * @method renderPost
 * @param {Integer} id object id
 * @param {Object} data object with necessary data
 * @param {String} loc Location to append html to
 */
function renderPost(eventid,postid,loc) {
    $("#" + eventid + 'post').append('<div style="display:inline-block"> ' +
        '<img id="post'+postid+'img"style="display: inline-block;", class="img-thumbnail" > ' +
        '<div class="caption"> <b id="posttitle'+postid+'"></b> <p id="postcomment'+postid+'"></p> </div></div>');
    posts.get(postid).then(function(event){
            $("#post"+event.id+"img").attr("src", event.image)
            $("#posttitle"+event.id).html(event.title)
            $("#postcomment"+event.id).html(event.description)
        }
    )
}

/**
 *  Submit Comment, submits a new comment on an event
 *
 * @method submitComment
 * @param {Integer} id EventID
 */
function submitComment(localtionid) {
    var form = $('#submit_comment'+ localtionid).serializeArray();
    var data = {};
    for (index in form) {
        data[form[index].name] = form[index].value;
    }

    //creates index db item
    var item = {};
    if (data["postid"] != null) {
        item = {
            postid: data["postid"],
            comment: data["comment"],
            created: new Date().getTime()
        };
    } else {
        item = {
            eventid: data["eventid"],
            mongodbID: null,
            comment: data["comment"],
            created: new Date().getTime()
        };
    }

    // creates indexdb ir
    //sends the result to mongodb
    //emit to everyone that there has been a new comment
    //else render locally
    comments.count(item).then(function () {
        if (data["eventid"] != null) {
            comments.count().then(function (id) {
                console.log(id + "Indexdb id")
                $.ajax({
                    url: '/comments/create',
                    type: "POST",
                    data: JSON.stringify({
                        id: id + 1,
                        eventid: item["eventid"],
                        comment: item["comment"],
                        created: item["created"]
                    }),
                    contentType: 'application/json',
                    success: function (mid) {
                        socket.emit('Sync Comment', {id: mid});
                    },
                    error: function (err) {
                        alert('Error: ' + err.status + ':' + err.statusText);
                        console.log(err)
                        comments.add(item).then(function (iid) {
                            renderComment(iid, data, "post");

                        })
                    }
                });
            });
        };
    });


    document.getElementById("submit_comment"+ localtionid).reset();


    //creates a notification for everyone but yourself
    makeMessage(data["comment"]);
}

/**
 * Render Comment, renders a new comment
 *
 * @method renderComment
 * @param {Integer} id event id
 * @param {Object} data comment data
 */
function renderComment(id,data) {
    $( "#"+id+"body" ).append(
        '<p>'+data["comment"]+'</p>'
    );
}

/**
 * Renders events by sending get request to server
 *
 * @method renderEvent
 * @param {Integer} id
 * @param {Object} value object filled with possible event values
 */
function renderEvent(id, loc) {
    $(loc).append('<div class="mx-5 card h-100"><h2 id= "'+id+'title" class="card-title text-center"></h2>' +
        '<img id= "'+id+'pic" class="card-img-top img-thumbnail" alt="Card image cap"> ' +
        '<div id= "'+id+'body" class="card-body"> <div id="'+id+'post" style="overflow-x: auto; white-space: nowrap;" class="text-center"></div>' +
        ' <p class="card-text">Comments go here</p> <p class="card-text date"></p> </div> ' +
        '<div class="card-footer"> <form id="submit_comment'+id+'" onsubmit="return false;"> ' +
        '<input type="hidden" name="eventid" value='+id+'> <input type="hidden" name="lat" value="1"> <input type="hidden" name="lon" value="1"> ' +
        '<div class="row"> <div class="col-md-10 col-sm-8"> <input type="text" class="form-control" name="comment"> </div> ' +
        '<div class="col-md-2 col-sm-4"> <button class="w-100 btn btn-primary" onclick=submitComment('+id+')><i class="far fa-paper-plane"></i></button> ' +
        '</div> </div> </form> </div> </div>')

    events.get(id).then(function(event){
            $("#"+event.id+"pic").attr("src", event.image)
            $("#"+event.id+"title").text(event.title)
            $("#"+event.id+"body").children("p.card-text.date").text(event.created)
        }
    )
}

/**
 * caches and creates service worker if not cached
 *
 * @method initialCache
 */
function initialCache(){
    console.log("Running Initial Caching")
    if ('serviceWorker' in navigator){
        navigator.serviceWorker
            .register('/service_worker.js')
            .then(function() { console.log('Service Worker Registered'); }, function(reje){console.log("Rejected with the following:" + reje)});
    }
}

/**
 * On page refresh it renders
 *
 * @method load
 */
function load() {


    //if the socket is open
    if(socket.connected) {

        //sink data
        dbPromise.then(function () {
            //sync indexdb to mongo
            upsync.event().then(function () {
                upsync.post()
            }).then(function () {
                upsync.comment()
            })

            //sync mongo to index db
            downsync.event().then(function () {
                downsync.post()
            }).then(function () {
                downsync.comment()
            })
        }).then(function () {
            //render events
            dbPromise.then(function (){
                events.renderEvents()
            })
        });
    }

}


/**
 * loads the database user, render events
 *
 * @method load_user
 * @param id id of user
 */
function load_user(id) {
    dbPromise.then(function () {
        events.get(id).then(function (value) {
            this.renderEvent(id, "#test")
        })
    })
}
/**
 * Returns postcode and other information given a latitude and longitude
 *
 * @method loc_from_latlon
 * @string postcode
 * @returns {lat:lat, lon:lon}
 */
function latlon_from_postcode(postcode){
    $.ajax({
        url: '/searchpostcode',
        type: "POST",
        data: JSON.stringify({postcode:postcode}),
        contentType: 'application/json',
        success: function (data) {
            return(data)
        },
        error: function (err) {
            console.log(err)
        },
    });
}
