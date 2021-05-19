/**
 * State: an automaton state, displayed as a short string within a circle
 *
 */

var State = fabric.util.createClass(fabric.Group, {

	type: 'State',

	initialize: function(options) {
		options || (options = { });
		this.set('label', options.label || ' ');
		this.set('selected', options.selected || false);
		this.set('final', options.final || false);
		this.set('initial', options.initial || false);

		this.set('text', new fabric.Text(
			this.label,
			{//left: options.left + 5,
			 //top: options.top - 5,
			 fontSize: 14,
			 fontWeight: 'bold',
			 originX: 'center',
			 originY: 'center'
			}));

		var radius = this.text.width;
		if (this.text.height > radius) {
			radius = this.text.height;
		}
		radius /= 2;
		radius += State.rimOffSet;
		if (this.final) {
			radius += State.rimOffSet;
		}

		this.set ('circle', new fabric.Circle({
			radius: radius,
			//left: options.left,
			//top: options.top + radius,
			fill: ((this.selected) ? State.selectedColor: State.unselectedColor),
			stroke: '#000000',
			originX: 'center',
			originY: 'center'
		}));

		this.callSuper('initialize', [this.circle, this.text], options);
		console.log ("initialized ");
		this.dirty = true;
	},

	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			label: this.get('label'),
			final: this.get('final'),
			initial: this.get('initial')
		});
	},

	render: function(ctx) {
		this.callSuper('render', ctx);
		if (this.initial) {
			ctx.beginPath();
			var y = this.top + this.height/2;
			ctx.moveTo(this.left, y);
			ctx.lineTo (this.left - State.initMarkerSize/2, y - State.initMarkerSize/2);
			ctx.lineTo (this.left - State.initMarkerSize/2, y + State.initMarkerSize/2);
			ctx.lineTo(this.left, y);
			ctx.strokeStyle='black';
			ctx.stroke();			
		}
		if (this.final) {
			var radius = this.width / 2;
			var x = this.left + radius;
			var y = this.top + radius;
			console.log ("at " + x + "," + y + ": " + radius);
			ctx.beginPath();
			ctx.arc(x, y, radius-State.rimOffSet, 0, 2*Math.PI);
			ctx.strokeStyle='black';
			ctx.stroke();
		}
	},

	_render: function(ctx) {
		this.callSuper('_render', ctx);
		alert("in _render");
		if (this.final) {
			var radius = this.width / 2;
			var x = this.left + radius;
			var y = this.top + radius;
			ctx.beginPath();
			ctx.arc(x, y, radius-State.rimOffSet, 0, 2*Math.PI);
			ctx.strokeStyle='black';
			ctx.stroke();
		}
	}
});

State.selectedColor = '#88FF88';
State.unselectedColor = '#88FFFF';
State.rimOffSet = 5;
State.initMarkerSize = 3*State.rimOffSet;	
