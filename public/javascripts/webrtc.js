
/**
 * Checks if browser compatible with webRTC
 *
 * @method hasGetUserMedia
 * @return {Boolean} Returns true if compatible, false if not
 */
function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}
/**
 * Change filter of selfie
 *
 * @method hasGetUserMedia
 * @return {Boolean} Returns true if compatible, false if not
 */
function handleFiles(files, loc) {
    file = files[0]
    const img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    var reader = new FileReader();
    base64 = reader.readAsDataURL(img.file)
    console.log(base64)
    reader.onload = function(){
        document.querySelector(loc).src
            = reader.result;
    }
}

/**
 * Change filter of selfie
 *
 * @method hasGetUserMedia
 * @return {Boolean} Returns true if compatible, false if not
 */
function changeFilter(e){
    var el = e.target;
    el.className= '';
    var effect = filters[idx++ % filters.length];
    if (effect){
        el.classList.add(effect);
    }
    console.log(filters[idx++ % filters.length])
}

var filters = ['greyscale', 'sepia']
var idx = 0;

/**
 * Change filter function
 *
 * @method cameraMode
 */
function changeFilter(e) {
    var el = e.target; el.className = ``;
// loop through filters.
    var effect = filters[idx++ % filters.length];
    if (effect) { el.classList.add(effect); }}


document.querySelector('video').addEventListener(
    'click', changeFilter, false);
/**
 * Camera mode, enables webRTC video mode.
 *
 * @method cameraMode
 */
function cameraMode(loc) {
    $(loc).fadeIn();
    if (hasGetUserMedia()) {
        console.log("WebRTC succesful")
        const constraints = {
            video: true
        };

        const video = document.querySelector(loc+'cam');

        document.querySelector(loc+'cam').addEventListener('click', changeFilter, false)
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream
        });

    } else {
        alert('getUserMedia() is not supported by your browser');
    }
}

/**
 * Snapshot function, takes a snapshot of the current camera state
 *
 * @method snapshot
 */
function snapshot(loc) {
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    if (hasGetUserMedia()) {
        const video = document.querySelector(loc+'cam');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        document.querySelector(loc+'pic').src
            = canvas.toDataURL('image/png');
    }
    userId = 1;
}

