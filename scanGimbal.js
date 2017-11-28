var noble = require('noble');
var addressToTrack = '1fd5cbe68f13';
var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080', {reconnect: true});

socket.on('connect', function (socket) {
       console.log('Connection established');
   });

noble.state = "poweredOn";
noble.on('stateChange', function(state){
        console.log('state:' + state);
        noble.startScanning([], true);
});
noble.on('scanStart', function(){
        console.log('scanStart');
});
 
noble.on('discover', function(peripheral){
    // if(peripheral.uuid == addressToTrack){
         var macAddress = peripheral.uuid;
  	 var rss = peripheral.rssi;
 	 var localName = peripheral.localName; 
         console.log('found device: ', macAddress, ' ', localName, ' ', rss);
	 var distance = calculateDistance(rss);
	 console.log('Device: ', macAddress, ' Distance: ', distance);
	 sendToServer(distance, macAddress);
	 console.log('Sending to server');
    // }
});

function calculateDistance(rssi) {
  
  var txPower = -59 //hard coded power value. Usually ranges between -59 to -65
  
  if (rssi == 0) {
    return -1.0; 
  }

  var ratio = rssi*1.0/txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  }
  else {
    var distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
    return distance;
  }
} 


function sendToServer(distance, macAddress) {
   socket.emit('deviceData', {pi: 11245, GimbalId: macAddress, Distance: distance});
   var sleep = require('sleep');
   sleep.sleep(10);
}
