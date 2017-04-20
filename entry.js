require( "./style.css" );

import TiledMapRenderer from './TiledMapRenderer.js';
import json from './assets/background.json';

var canvas = document.getElementById( 'tiled_map' );

var tiledMapRenderer = new TiledMapRenderer( canvas, json );

var viewport = {
	x: 0,	
	y: 0,
	w: 320, // width and height
	h: 240
};

window.addEventListener( "keydown", function( e ) {
	switch( e.key ) {
		case "ArrowLeft":
			viewport.x -= 10;
			break;

		case "ArrowRight":
			viewport.x += 10;
			break;

		case "ArrowUp":
			viewport.y -= 10;
			break;

		case "ArrowDown":
			viewport.y += 10;
			break;
	}
});

var lastFrame = 0;
var loop = function( timestamp ) {
	var delta = timestamp - lastFrame;
	lastFrame = timestamp;

	var ctx = canvas.getContext( "2d" );
	ctx.fillStyle= "#000000";
	ctx.fillRect( 0, 0, viewport.w, viewport.h );
	ctx.fill();

	tiledMapRenderer.render( viewport );
	
	ctx.font = "10px 'Courier New'";
	var fps = 1 / ( delta / 1000 );
	ctx.fillStyle = "#ffff00";
	ctx.fillText( fps.toPrecision( 2 ) + ' fps', 10, 10 );

	window.requestAnimationFrame( loop );
};
var animationFrame = window.requestAnimationFrame( loop );