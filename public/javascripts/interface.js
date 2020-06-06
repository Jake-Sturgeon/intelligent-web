/**
 * This is the description for my class.
 *
 * @class DB-interface
 */
var dbPromise;
/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method testReplace
 * @param {String} foo Argument 1
 * @param {Object} config A config object
 * @param {String} config.name The name on the config object
 * @param {Function} config.callback A callback function on the config object
 * @param {Boolean} [extra=false] Do extra, optional work
 * @return {Boolean} Returns true on success
 */
(function () {
        'use strict';
        //check for support
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
            return;
        }
        dbPromise = idb.openDb('test-db2', 1,
            function (upgradeDb) {
                console.log('making a new object store');
                if (!upgradeDb.objectStoreNames.contains('firstOS')) {
                    var comments = upgradeDb.createObjectStore('comments',  {keyPath: 'id', autoIncrement:true});
                    comments.createIndex('mongodbID', 'mongodbID');
                    comments.createIndex('postid', 'postid', {unique: false});
                    comments.createIndex('eventid', 'eventid', {unique: false});
                    comments.createIndex('comment', 'comment', {unique: false});
                    comments.createIndex('created', 'created', {unique: false});
                    var posts = upgradeDb.createObjectStore('posts', {keyPath: 'id', autoIncrement:true});
                    posts.createIndex('mongodbID', 'mongodbID');
                    posts.createIndex('eventid', 'eventid', {unique: false});
                    posts.createIndex('title', 'title', {unique:false})
                    posts.createIndex('lat', 'lat', {unique: false});
                    posts.createIndex('lon', 'lon', {unique: false});
                    posts.createIndex('image', 'image', {unique: false});
                    posts.createIndex(       'created', 'created', {unique: false})
                    var events = upgradeDb.createObjectStore('events', {keyPath: 'id', autoIncrement:true});
                    events.createIndex('mongodbID', 'mongodbID');
                    events.createIndex('title', 'title', {unique:false})
                    events.createIndex('lat', 'lat', {unique: false});
                    events.createIndex('picture', 'picture', {unique:false});
                    events.createIndex('lon', 'lon', {unique: false});
                    events.createIndex("image", "image", {unique: false})
                    events.createIndex('radius', 'radius', {unique: false});
                    events.createIndex(       'created', 'created', {unique: false})
                }
            });
    }
)();

//Comments interface
const comments = {

    //count how many records are in the comments store, return a promise
    async count() {
        const db = await dbPromise;
        return db.transaction('comments', 'readwrite').objectStore('comments').count();
    },
    // add a comment to the store, return a promise
    async add(comment) {
        const db = await dbPromise;
        return db.transaction('comments', 'readwrite').objectStore('comments').add(comment)
    },
    //get a comment via an id, return a the comment
    async get(id) {
        const db = await dbPromise;
        return db.transaction('comments').objectStore('comments').get(id);
    },
    //put data in the comment
    async put(data) {
        const db = await dbPromise;
        return db.transaction('comments', 'readwrite').objectStore('comments').put(data);
    },
    //render commnets
    async renderComments(value) {
        const db = await dbPromise;
        return db.transaction('comments').objectStore('comments').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                // console.log(cursor.value.hasOwnProperty('eventid')&& value == cursor.value["eventid"]);
                if (cursor.value.hasOwnProperty('postid') && value == cursor.value["postid"]) {
                    renderComment(cursor.value["postid"],cursor.value);
                } else if(cursor.value.hasOwnProperty('eventid') && value == cursor.value["eventid"]){
                    renderComment(cursor.value["eventid"],cursor.value);
                }
                return cursor.continue().then(logItems);
            })
    },
    //return all the comments
    async getAll() {
        const db = await dbPromise;
        return db.transaction('comments').objectStore('comments').getAll();
    },
    //update the comments
    async update(val) {
        const db = await dbPromise;
        return db.transaction('comments', 'readwrite').objectStore('comments').put(val);
    },
    //delete the comment
    async delete(id) {
        const db = await dbPromise;
        return db.transaction('comments', 'readwrite').objectStore('comments').delete(id);
    }
};

// Posts interface
const posts = {
    // count all the posts in the store
    async count() {
        const db = await dbPromise;
        return db.transaction('posts', 'readwrite').objectStore('posts').count();
    },
    //add post to the store
    async add(post) {
        const db = await dbPromise;
        return db.transaction('posts', 'readwrite').objectStore('posts').add(post);
    },
    //put data into a post in the store
    async put(data) {
        const db = await dbPromise;
        return db.transaction('posts', 'readwrite').objectStore('posts').put(data);
    },
    //get the post in the store
    async get(id) {
        const db = await dbPromise;
        return db.transaction('posts').objectStore('posts').get(id);
    },
    //render the post
    async renderPosts(value) {
        const db = await dbPromise;
        return db.transaction('posts').objectStore('posts').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                if(value == cursor.value["eventid"]){
                    renderPost(cursor.value["eventid"], cursor.value.id);
                }

                return cursor.continue().then(logItems);
            })
    },
    // get all the posts
    async getAll() {
        const db = await dbPromise;
        return db.transaction('posts').objectStore('posts').getAll();;
    },
    //update a post
    async update(val) {
        const db = await dbPromise;
        return db.transaction('posts', 'readwrite').objectStore('posts').put(val);
    },
    //delete a post
    async delete(id) {
        const db = await dbPromise;
        return db.transaction('posts', 'readwrite').objectStore('posts').delete(id);
    }
};


const events = {
    //count all the events in the store
    async count() {
        const db = await dbPromise;
        return db.transaction('events', 'readwrite').objectStore('events').count();
    },
    // add the event to the store
    async add(event) {
        const db = await dbPromise;
        return db.transaction('events', 'readwrite').objectStore('events').add(event);
    },
    //get event from the store
    async get(id) {
        const db = await dbPromise;
        return db.transaction('events').objectStore('events').get(id);
    },
    //put data into a item in the store
    async put(data) {
        const db = await dbPromise;
        return db.transaction('events', 'readwrite').objectStore('events').put(data);
    },
    //get all the events in the store
    async getAll() {
        const db = await dbPromise;
        return db.transaction('events').objectStore('events').getAll();
    },
    //used to search events in the map page
    async search(query, option) {
        const db = await dbPromise;
        return db.transaction('events').objectStore('events').openCursor().then(
            function search_by_title(cursor){
                if (!cursor){
                    return;
                }

                //used to query the events store
                // if a match is found ---
                //      render the event then render the comments and any posts
                const p = new Promise((resolve, reject) => {
                    queryfound = false;
                    text = cursor.value["title"]
                    console.log(query)
                    if ((text.toLowerCase()).search(query.toLowerCase()) > -1) {
                        queryfound = true;
                        resolve(renderEvent(cursor.value["id"], "#trending_posts"))
                    }
                }).then(function () {
                    if (queryfound) {
                        comments.renderComments(cursor.value["id"]);
                        posts.renderPosts(cursor.value["id"]);
                    }
                })
                return cursor.continue().then(search_by_title)
            }
        )
    },
    //render the events
    async renderEvents() {
        const db = await dbPromise;
        return db.transaction('events').objectStore('events').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }


                //used to render the events, posts, and comments to the screen
                const p = new Promise((resolve, reject) => {
                    resolve(renderEvent(cursor.value["id"], "#trending_posts"));
                }).then(function () {
                    comments.renderComments(cursor.value["id"]);
                    posts.renderPosts(cursor.value["id"]);
                });

                return cursor.continue().then(logItems);
                // renderEvent(cursor.value["id"],cursor.value);
                // comments.renderComments(cursor.value["id"]);
                // return cursor.continue().then(logItems);
            })
    },
    //update a event in the store
    async update(val, id) {
        const db = await dbPromise;
        return db.transaction('events', 'readwrite').objectStore('events').put(val,id);
    },
    async delete(id) {
        const db = await dbPromise;
        return db.transaction('events', 'readwrite').objectStore('events').delete(id);
    }
};

// This interface is used to sync the data from the indexdb to mongo
const upsync = {
    //sync local events to the mongo database
    async event() {
        const db = await dbPromise;
        return db.transaction('events','readwrite').objectStore('events').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }

                //if there is no mongoID --> therefore not synced
                if (cursor.value.mongodbID == null){
                    console.log(cursor.value.mongodbID)
                    $.ajax({
                        url: '/events/create',
                        type: "POST",
                        data: JSON.stringify({
                            id: cursor.value["id"],
                            radius: cursor.value["radius"],
                            title: cursor.value["title"],
                            lat: cursor.value["lat"],
                            lon: cursor.value["lon"],
                            file: cursor.value["image"],
                            created: cursor.value["created"]
                        }),
                        contentType: 'application/json',
                        success: function (mid) {
                            //emit to all users that a new event has been uploaded
                            socket.emit('Sync Event', { id: mid });
                        },
                        error: function (err) {
                            // alert('Error: ' + err.status + ':' + err.statusText);
                        }
                    });
                    //delete old record from index db
                    console.log("sfsdfsdf"+cursor.value["id"])
                    cursor.delete(cursor.value["id"]);
                }

                return cursor.continue().then(logItems);
            })
    },
    //sync local posts to the mongo database
    async post() {
        const db = await dbPromise;
        return db.transaction('posts','readwrite').objectStore('posts').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                //if there is no mongoID --> therefore not synced
                if (cursor.value.mongodbID == null){
                    console.log(cursor.value.mongodbID)
                    $.ajax({
                        url: '/posts/create',
                        type: "POST",
                        data: JSON.stringify({
                            id: cursor.value["id"],
                            eventid: cursor.value["eventid"],
                            title: cursor.value["title"],
                            lat: cursor.value["lat"],
                            lon: cursor.value["lon"],
                            image: cursor.value["image"],
                            created: cursor.value.created
                        }),
                        contentType: 'application/json',
                        success: function (mid) {
                            //emit to all users that a new post has been uploaded
                            socket.emit('Sync Post', { id: mid });
                        },
                        error: function (err) {
                            // alert('Error: ' + err.status + ':' + err.statusText);
                        }
                    });
                    //delete local post
                    console.log("sfsdfsdf"+cursor.value["id"])
                    cursor.delete(cursor.value["id"]);
                }

                return cursor.continue().then(logItems);
            })
    },
    //sync local comments to the mongo database
    async comment() {
        const db = await dbPromise;
        return db.transaction('comments','readwrite').objectStore('comments').openCursor().then(
            function logItems(cursor) {
                if (!cursor) {
                    return;
                }
                //if there is no mongoID --> therefore not synced
                if (cursor.value.mongodbID == null){
                    console.log(cursor.value.mongodbID)
                    $.ajax({
                        url: '/comments/create',
                        type: "POST",
                        data: JSON.stringify({
                            id: cursor.value["id"],
                            eventid: cursor.value["eventid"],
                            comment: cursor.value["comment"],
                            created: cursor.value["created"]
                        }),
                        contentType: 'application/json',
                        success: function (mid) {
                            //emit to all users that a new comment has been submitted
                            socket.emit('Sync Comment', { id: mid });
                        },
                        error: function (err) {
                            // alert('Error: ' + err.status + ':' + err.statusText);
                        }
                    });
                    console.log("sfsdfsdf"+cursor.value["id"])
                    cursor.delete(cursor.value["id"]);
                }

                return cursor.continue().then(logItems);
            })
    },
};

//This interface is used to sync mongo to the indexstore
const downsync = {

    //sync the mogo events to the indec db store
    async event() {
        const db = await dbPromise;
        return db.transaction('events').objectStore('events').getAll().then(function (events) {
            // loop through all the records and create a list that contains all the mongoids
            var _id = []
            for (var i = 0; i < events.length; i++) {
                if (events[i].mongodbID != null) {
                    _id.push(events[i].mongodbID);
                }
            }
            console.log(_id);
            //this sends all the mongoids to the events controller
            $.ajax({
                url: '/events/downsync',
                type: "POST",
                data: JSON.stringify({
                    _id
                }),
                contentType: 'application/json',
                success: function (res) {
                    //the result is a list of JSON objects to be added to the event store
                    for (var i = 0; i < res.length; i++ ) {
                        const item = {
                            radius: res[i]["radius"],
                            mongodbID: res[i]["_id"],
                            title: res[i]["title"],
                            lat: res[i]["lat"],
                            lon: res[i]["lon"],
                            image: res[i]["file"],
                            created: res[i]["created"]
                        };
                        // add to the store and render to the page
                        db.transaction('events', "readwrite").objectStore('events').add(item).then(function (id) {
                            db.transaction('events').objectStore('events').get(id).then(function (data) {
                                renderEvent(data.id, "#trending_posts")
                                mapDb.add_event(data.id, data)
                            })
                        })
                    }
                },
            });
        });
    },

    // sync the mondo posts to the local index store
    async post() {
        const db = await dbPromise;
        return db.transaction('posts').objectStore('posts').getAll().then(function (posts) {
            // loop through all the records and create a list that contains all the mongoids
            var _id = []
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].mongodbID != null) {
                    _id.push(posts[i].mongodbID);
                }
            }
            console.log(_id);
            //this sends all the mongoids to the posts controller
            $.ajax({
                url: '/posts/downsync',
                type: "POST",
                data: JSON.stringify({
                    _id
                }),
                contentType: 'application/json',
                success: function (res) {
                    //the result is a list of JSON objects to be added to the event store
                    for (var i = 0; i < res.length; i++ ) {

                        const item = {
                            mongodbID: res[i]._id,
                            eventid: res[i].eventid,
                            title: res[i].title,
                            lat: res[i].lat,
                            lon: res[i].lon,
                            image: res[i].file,
                            created: res[i].created
                        };
                        //render to the page
                        db.transaction('posts', "readwrite").objectStore('posts').add(item).then(function (id) {
                            db.transaction('posts').objectStore('posts').get(id).then(function (data) {
                                renderPost(data.eventid, data.id, "post")
                                mapDb.add_post(data.id, data)
                            })
                        })
                    }
                },
            });
        });

    },
    //sync mongo comments to the index db
    async comment() {
        const db = await dbPromise;
        return db.transaction('comments').objectStore('comments').getAll().then(function (comments) {
            // loop through all the records and create a list that contains all the mongoids
            var _id = []
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].mongodbID != null) {
                    _id.push(comments[i].mongodbID);
                }
            }
            console.log(_id);
            //this sends all the mongoids to the posts controller
            $.ajax({
                url: '/comments/downsync',
                type: "POST",
                data: JSON.stringify({
                    _id
                }),
                contentType: 'application/json',
                success: function (res) {
                    //the result is a list of JSON objects to be added to the event store
                    for (var i = 0; i < res.length; i++ ) {

                        const item = {
                            mongodbID: res[i]._id,
                            eventid: res[i]["eventid"],
                            comment: res[i]["comment"],
                            created: res[i]["created"]
                        };

                        //render comments to the page
                        db.transaction('comments', "readwrite").objectStore('comments').add(item).then(function (id) {
                            db.transaction('comments').objectStore('comments').get(id).then(function (data) {
                                renderComment(data.id, data, "post")
                            })
                        })
                    }
                },
            });
        });

    },
};
