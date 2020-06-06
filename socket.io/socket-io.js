
/**
 * Socket io. Contains ability to emit and broadcast necessary socket.io capabilities.
 * @module socket-io
 * @class socket-io
 * @requires  socket-io
 * @main Socket-io
 *
 */
exports.init = function (io, appX){
    io.on('connection', function (socket){

        // Broadcasts to the rest of the users that a comment as been made
        socket.on("comment", function(msg){
            console.log("Receiving a comment")
            console.log(msg)
            socket.broadcast.emit("comment", msg.msg)
        })

        // EMITS to users that a mongo event needs to be synced to indexdb
        socket.on('Sync Event', function (msg) {
            console.log("Received Sync Event " + msg.id)
            io.emit('Sync Event', {id:msg.id})
        });
        // EMITS to users that a mongo post needs to be synced to indexdb
        socket.on('Sync Post', function (msg) {
            console.log("Received Sync POST " + msg.id)
            io.emit('Sync Post', {id:msg.id})
        });
        // EMITS to users that a mongo comment needs to be synced to indexdb
        socket.on('Sync Comment', function (msg) {
            console.log("Received Sync comment " + msg.id)
            io.emit('Sync Comment', {id:msg.id})
        });
        // EMITS to users that a mongo ALL needs to be synced
        socket.on('Sync All', function (msg) {
            console.log("Received Sync comment " + msg.id)
            io.emit('Sync Comment', {id:msg.id})
        });

    })
}