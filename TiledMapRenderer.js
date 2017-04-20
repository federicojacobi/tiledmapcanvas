module.exports = class TiledMapRenderer {
	constructor( canvas, json ) {
		this.json = json;
		this.canvas = canvas;

		this.tileMap = [];
		this.setImageObject();
	}

	setImageObject() {
		var ts = this.json.tilesets;
		for ( var i = 0; i < ts.length; i++ ) {
			ts[i].imageDOM = new Image();
			ts[i].imageDOM.src = 'assets/' + ts[i].image;
		}
	}

	getTile( index ) {
		var ts = this.json.tilesets;
		var min = 0;
		var max = 0;
		var trueIndex = 0;
		var ox, oy;

		for ( var i = 0; i < ts.length; i++ ) {
			
			min = ts[i].firstgid;
			max = min + ts[i].tilecount;

			if ( index >= min && index < max ) {
				trueIndex = index - min;

				ox = (trueIndex % ts[i].columns) * ts[i].tilewidth;

				oy = Math.floor( trueIndex / ts[i].columns ) * ts[i].tileheight;

				return {
					tile: ts[i],
					offsetX: ox,
					offsetY: oy
				}
			}
		}
		return false;
	}

	render( cam ) {
		var thisTile, ox, oy;
		var ctx = this.canvas.getContext( "2d" );

		this.json.layers.forEach( function( layer, index ) {
			if ( ! layer.visible )
				return;

			layer.data.forEach( function( cell, index ) {
				thisTile = this.getTile( cell );
				if ( thisTile ) {
					ox = ( index % layer.width ) * thisTile.tile.tilewidth;
					oy = Math.floor( index / layer.height ) * thisTile.tile.tileheight;
					ox = ox - cam.x;
					oy = oy - cam.y;

					if (
							ox > cam.w ||
							oy > cam.h ||
							ox < 0 - thisTile.tile.tilewidth ||
							oy < 0 - thisTile.tile.tileheight
						)
						return;
					
					ctx.drawImage( 
						thisTile.tile.imageDOM, 	// Image
						thisTile.offsetX, 			// Origin offset
						thisTile.offsetY,
						thisTile.tile.tilewidth,	// Origin size
						thisTile.tile.tileheight,
						ox,							// Destination origin
						oy,
						thisTile.tile.tilewidth,	// Destination width
						thisTile.tile.tileheight
					);
				}
			}, this );
		}, this );
	}
}