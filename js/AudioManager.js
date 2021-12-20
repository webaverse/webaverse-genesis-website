import EventDispatcher from './EventDispatcher';
import webAudioPlayer from './audioPlayer';
import createAnalyser from "web-audio-analyser";
import createAudioContext from "ios-safe-audio-context";
import detectMediaSource from "detect-media-element-source";
import average from "analyser-frequency-average";
import tapEvent from 'tap-event';
import UI from './UI';
exports.dispatcher = new EventDispatcher()

let onTap;
let minHz = 40;
let maxHz = 100;
let allowplay = true;

let manifest = [{ src: './assets/audio/ambient-loop.mp3', id: 'ambient-loop', loops: true }, { src: './assets/audio/bug-flapping.mp3', id: 'bug-flap', loops: true }, { src: './assets/audio/electricity.mp3', id: 'spark', loops: true }];

let audioObjectsArr = [];




exports.init = function(params) {
    console.log('AudioManager.init()');
    onTap = tapEvent(onMouseDown)
    window.addEventListener('touchstart', onTap)
    window.addEventListener('mousedown', onMouseDown)
}

function onMouseDown(ev) {
    console.log('AudioManager -> initialised by user interaction');
    exports.dispatcher.dispatchEvent('audioInitByInteraction');
    window.removeEventListener('touchstart', onTap)
    window.removeEventListener('mousedown', onMouseDown)

    ev.preventDefault()
    canplay()
}



function canplay() {

    var audioContext = createAudioContext()

    detectMediaSource(function(supportsMediaElement) {
        var shouldBuffer = !supportsMediaElement
        start(audioContext, shouldBuffer)
    }, audioContext);

}

function start(audioContext, shouldBuffer) {

    for (let i = 0; i < manifest.length; i++) {

        let src = manifest[i].src;
        let player = webAudioPlayer(src, {
            context: audioContext,
            buffer: true,
            loop: manifest[i].loops,
            id: manifest[i].id
        })

        player.id = manifest[i].id;

        let audioUtil = createAnalyser(player.node, player.context, { stereo: false })
        let analyser = audioUtil.analyser;

        player.once('decoding', function(amount) {

        })

        player.on('end', function() {
            allowplay = true;
            //player.volume = 1.0;
        })

        player.on('error', function(err) {
            console.error(err.message)

        })

        player.on('load', function() {
            /* console.log('Source:', player.element ? 'MediaElement' : 'Buffer')
            console.log('Playing', Math.round( player.duration ) + 's of audio...')
            console.log( 'LOADED AUDIO ID : ',  player.id ) */
            player.play();
            player.volume = 0.0;
            exports.dispatcher.dispatchEvent('audioLoaded', { id: player.id })


        });

        audioObjectsArr.push({ player: player, id: manifest[i].id });
    }

}

exports.stopAll = function() {
    //console.log( 'AudioManager.stopAll()')
    audioObjectsArr.forEach(player => {

        //console.log( 'player ', player.player )
        player.player.pause();
        /* console.log( 'Audio ' + player.id );
    player.pause();

   
    if (player.playing) {
      console.log( 'is Playing ' + player.id )
      player.pause();
    } */
    })
}

exports.playAll = function() {
    //console.log( 'AudioManager.playAll()')

    audioObjectsArr.forEach(player => {

        //console.log( 'player ', player.player )
        player.player.play();
        /* console.log( 'Audio ' + player.id );
    player.pause();

   
    if (player.playing) {
      console.log( 'is Playing ' + player.id )
      player.pause();
    } */
    })
}

function click(id, volume = 1.0) {


    if (!allowplay) return;
    allowplay = false;
    let playerObj = audioObjectsArr.find(p => p.id === id)
    if (playerObj == undefined) return;

    let player = playerObj.player;

    player.volume = volume;
    player.loop = loop;

    if (player.playing) {
        player.stop();
        player.play();
    } else {
        player.play();
    }
}


exports.play = function(id, volume = 1.0) {

    if (click) {
        click(id, volume);
    }
}

exports.fadeVolume = function(id, volume) {
    let playerObj = audioObjectsArr.find(p => p.id === id)
    if (playerObj == undefined) return;

    let player = playerObj.player;

    player.volume = volume;

}