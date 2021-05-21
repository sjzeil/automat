/**
 * State: an automaton state, displayed as a short string within a circle
 *
 */

var Transition = fabric.util.createClass(fabric.Text, {

	type: 'Transition',

	initialize: function(fromState, toState, options) {
		options || (options = { });
		this.set('from', fromState);
		this.set('to', toState);
		this.set('label', options.label || '');
		this.set('curved', options.initial || false);

        this.callSuper('initialize', this.label, 
            {fontSize: 14, fontFamily: "cursive"});

        let x0 = fromState.left + fromState.circle.radius;
        let y0 = fromState.top + fromState.circle.radius;
        let x1 = toState.left + toState.circle.radius;
        let y1 = toState.top + toState.circle.radius;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let angle = Math.atan2(dy, dx);
        console.log ('dx ' + dx + '  angle ' + angle);
        

        if (Math.abs(dx) <= this.width) {
            console.log("** override x pos")
            this.left = (x0 + x1) / 2 + Transition.minTextOffset;
        } else {
            this.left = (x0 + x1) / 2 - this.width / 2;
        }
        if (angle >= 0) {
            this.top = (y0 + y1) / 2;
        } else {
            this.top = (y0 + y1) / 2 - this.height;
        }

		
	},

	render: function(ctx) {
		let x0 = this.from.left + this.from.circle.radius;
        let y0 = this.from.top + this.from.circle.radius;
        let x1 = this.to.left + this.to.circle.radius;
        let y1 = this.to.top + this.to.circle.radius;

        let dx = x1 - x0;
        let dy = y1 - y0;
        let angle = Math.atan2(dy, dx);


        let lineLen = Math.sqrt(dx*dx + dy*dy) - this.from.circle.radius - this.to.circle.radius;

        if (Math.abs(dx) <= this.width) {
            console.log("** override x pos")
            this.left = (x0 + x1) / 2 + Transition.minTextOffset;
        } else {
            this.left = (x0 + x1) / 2 - this.width / 2;
        }
        if (angle < 0) {
            this.top = (y0 + y1) / 2;
        } else {
            this.top = (y0 + y1) / 2 - this.height;
        }
        this.callSuper('render', ctx);

        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(angle);
        ctx.translate(this.from.circle.radius, 0);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(lineLen, 0);
        ctx.strokeStyle='black';
		ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineLen, 0);
        ctx.lineTo(lineLen-Transition.arrowSize, Transition.arrowSize/2);
        ctx.lineTo(lineLen-Transition.arrowSize, -Transition.arrowSize/2);
        ctx.lineTo(lineLen, 0);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
	},

});

Transition.arrowSize = 10;
Transition.minTextOffset = 5;
