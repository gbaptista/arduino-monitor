// =================

var MIDIPlayer = require('midiplayer');
var MIDIFile = require('midifile');

midi = require('midi');
var output = new midi.output();

var output_adapter = { send: function(p) { output.sendMessage(p); } };

output.openPort(1);

var performance = { now: require('performance-now') };

window = { addEventListener: function() {} };

buffer = new MIDIFile(toArrayBuffer(fs.readFileSync('./midi-demos/in-the-end.mid')));
buffer = new MIDIFile(toArrayBuffer(fs.readFileSync('./midi-demos/moon-light.midi')));

var document = {};

// Creating player
var midiPlayer = new MIDIPlayer({ 'output': output_adapter });

// Loading the midiFile instance in the player
midiPlayer.load(buffer);

// Playing
midiPlayer.play(function() { console.log('Play ended'); });

// Volume
midiPlayer.volume = 80; // in percent

// Pausing
midiPlayer.pause();

// Resuming
midiPlayer.resume();

// Stopping
midiPlayer.stop();

// Playing again and loop
midiPlayer.play(function playCallback() {
    midiPlayer.play(playCallback);
});
