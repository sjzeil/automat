/**
 * State: an automaton state, displayed as a short string within a circle
 *
 */

var Transition = fabric.util.createClass(fabric.Text, {

    type: 'Transition',

    initialize: function (fromState, toState, options) {
        options || (options = {});
        this.set('from', fromState);
        this.set('to', toState);
        this.set('label', options.label || '');
        this.set('curved', options.curved || false);
        this.set('selectable', true);

        if (fromState == toState) {
            this.curved = true;
        }

        this.callSuper('initialize', this.label,
            { fontSize: 13, fontFamily: "cursive" });

    },

    render: function (ctx) {
        let x0 = this.from.left + this.from.circle.radius;
        let y0 = this.from.top + this.from.circle.radius;

        let x1 = this.to.left + this.to.circle.radius;
        let y1 = this.to.top + this.to.circle.radius;

        let dx = x1 - x0;
        let dy = y1 - y0;
        let angle = Math.atan2(dy, dx);

        if (this.from == this.to) {
            console.log ('matched');

            angle = -Math.PI / 2.0;
        }

        let xc = (x0 + x1) / 2;
        let yc = (y0 + y1) / 2;

        console.log ("angle: " + angle + "  offset: " + Transition.angleOffset);
        let exitAngle = angle - ((this.curved) ? Transition.angleOffset : 0);
        console.log ("angle: " + angle + "  exit: " + exitAngle);
        let fromXc = this.from.left + this.from.circle.radius;
        let fromYc = this.from.top + this.from.circle.radius;
        let exitX = fromXc + this.from.circle.radius * Math.cos(exitAngle);
        let exitY = fromYc + this.from.circle.radius * Math.sin(exitAngle);


        

        if (this.from != this.to) {
            let entryAngle = angle + Math.PI + ((this.curved) ? Transition.angleOffset : 0);
            let toXc = this.to.left + this.to.circle.radius;
            let toYc = this.to.top + this.to.circle.radius;
            let entryX = toXc + this.to.circle.radius * Math.cos(entryAngle);
            let entryY = toYc + this.to.circle.radius * Math.sin(entryAngle);

            let arcOffset = ((this.curved) ? Transition.curveOffset : 0);
            let textOffset = ((this.curved) ? 0.75 * Transition.curveOffset : Transition.minTextOffset);

            let offSetAngle = angle - Math.PI / 2.0;
            let arcOffsetX = xc + arcOffset * Math.cos(offSetAngle);
            let arcOffsetY = yc + arcOffset * Math.sin(offSetAngle);

            let textX = xc + textOffset * Math.cos(offSetAngle);
            let textY = yc + textOffset * Math.sin(offSetAngle);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(exitX, exitY);
            ctx.quadraticCurveTo(arcOffsetX, arcOffsetY, entryX, entryY);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            // draw the arrowhead
            ctx.save();
            ctx.translate(entryX, entryY);
            ctx.rotate(entryAngle + Math.PI);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-Transition.arrowSize, Transition.arrowSize / 2);
            ctx.lineTo(-Transition.arrowSize, -Transition.arrowSize / 2);
            ctx.lineTo(0, 0);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.restore();


            if (angle < -Math.PI / 2) {
                this.left = textX - this.width;
                this.top = textY;
            } else if (angle < 0) {
                this.left = textX - this.width;
                this.top = textY - this.height
            } else if (angle < Math.PI / 2) {
                this.left = textX;
                this.top = textY - this.height;
            } else {
                this.left = textX;
                this.top = textY;
            }
        } else {
            // transition from a node to itself

            let entryAngle = exitAngle + 2.0 * Transition.angleOffset;
            console.log ("angle: " + angle + "  exit: " + exitAngle + "  entry: " + entryAngle);
            let toXc = this.to.left + this.to.circle.radius;
            let toYc = this.to.top + this.to.circle.radius;
            let entryX = toXc + this.to.circle.radius * Math.cos(entryAngle);
            let entryY = toYc + this.to.circle.radius * Math.sin(entryAngle);

            ctx.save();
            ctx.beginPath();
            drawPoint(ctx, exitX, exitY, 'green');
            drawPoint(ctx, entryX, entryY, 'red');

            ctx.moveTo(exitX, exitY);
            ctx.bezierCurveTo(exitX-Transition.curveOffset, exitY-Transition.curveOffset,
                entryX+Transition.curveOffset, entryY-Transition.curveOffset,
                entryX, entryY);
            
            //let yr = y0 - 2.0 * this.from.circle.radius;
            //ctx.arc (x0, yr, this.from.circle.radius, entryAngle + Math.PI, entryAngle + 3.0*Math.PI - 2.0*Transition.angleOffset);

            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.save();
            ctx.translate(entryX, entryY);
            ctx.rotate(3.0*Math.PI/4.0);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-Transition.arrowSize, Transition.arrowSize / 2);
            ctx.lineTo(-Transition.arrowSize, -Transition.arrowSize / 2);
            ctx.lineTo(0, 0);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.restore();

            let textOffset = Transition.curveOffset;
            this.left = x0 - this.width/2;
            this.top = this.from.top - this.from.circle.radius - 0.5 * textOffset  - this.height;
        }

        this.callSuper('render', ctx);
    },

});

function drawPoint(ctx, x, y, color) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, 3, 3);
    ctx.restore();
}



Transition.arrowSize = 8;
Transition.minTextOffset = 5;
Transition.curveOffset = 30;
Transition.angleOffset = 2.0 * Math.PI * (15.0 / 360.0);
