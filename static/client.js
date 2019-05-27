console.log("working on it");

function socket() {
    var socket = io();
    socket.on('festivalData', function (data) {
        // console.log(data);
        festivalOverview(data)
    });
}
socket()



function festivalOverview(data) {
    console.log(data);
}