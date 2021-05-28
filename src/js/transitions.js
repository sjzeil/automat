/**
 * Transition: rendering of a potential change from one state to another.
 * 
 * Displayed as a labelled arrow between two states.
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
        this.set('hasControls', false);

        if (fromState == toState) {
            this.curved = true;
        }

        this.callSuper('initialize', this.label,
            { fontSize: 13, fontFamily: "cursive" });

    },

    render: function (ctx) {
        let x0 = this.from.rendering.left + this.from.rendering.circle.radius;
        let y0 = this.from.rendering.top + this.from.rendering.circle.radius;

        let x1 = this.to.rendering.left + this.to.rendering.circle.radius;
        let y1 = this.to.rendering.top + this.to.rendering.circle.radius;

        let dx = x1 - x0;
        let dy = y1 - y0;
        let angle = Math.atan2(dy, dx);

        if (this.from == this.to) {
            angle = -Math.PI / 2.0;
        }

        let xc = (x0 + x1) / 2;
        let yc = (y0 + y1) / 2;

        let exitAngle = angle - ((this.curved) ? Transition.angleOffset : 0);
        let fromXc = this.from.rendering.left + this.from.rendering.circle.radius;
        let fromYc = this.from.rendering.top + this.from.rendering.circle.radius;
        let exitX = fromXc + this.from.rendering.circle.radius * Math.cos(exitAngle);
        let exitY = fromYc + this.from.rendering.circle.radius * Math.sin(exitAngle);


        

        if (this.from != this.to) {
            let entryAngle = angle + Math.PI + ((this.curved) ? Transition.angleOffset : 0);
            let toXc = this.to.rendering.left + this.to.rendering.circle.radius;
            let toYc = this.to.rendering.top + this.to.rendering.circle.radius;
            let entryX = toXc + this.to.rendering.circle.radius * Math.cos(entryAngle);
            let entryY = toYc + this.to.rendering.circle.radius * Math.sin(entryAngle);

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
            let toXc = this.to.rendering.left + this.to.rendering.circle.radius;
            let toYc = this.to.rendering.top + this.to.rendering.circle.radius;
            let entryX = toXc + this.to.rendering.circle.radius * Math.cos(entryAngle);
            let entryY = toYc + this.to.rendering.circle.radius * Math.sin(entryAngle);

            ctx.save();
            ctx.beginPath();
            
            ctx.moveTo(exitX, exitY);
            ctx.bezierCurveTo(exitX-Transition.curveOffset, exitY-Transition.curveOffset,
                entryX+Transition.curveOffset, entryY-Transition.curveOffset,
                entryX, entryY);
            
            
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
            this.top = this.from.rendering.top - this.from.rendering.circle.radius - 0.5 * textOffset  - this.height;
        }

        this.setCoords();
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




/**
 * A renderable transition within an automaton
 */
 class AutomatonTransition extends RenderedElement {

    constructor (label, fromState, toState, canvas) {
        super(canvas);
        this._label = label;
        this.from = fromState;
        this.to = toState;
        this._curved = false;
        this._prepareRendering();
    }

    _prepareRendering()
    {
        let rendering = new Transition(this.from, this.to,
            {
            label: this._label,
            curved: this._curved
        });
        this.setRendering(rendering, true);
    }

    get label() {
        return this._label;
    }

    set label(newLabel) {
        if (newLabel != this._label) {
            this._label = newLabel;
            this._prepareRendering();
        }
    }

    get curved() {
        return this._curved;
    }

    set curved(curvedState) {
        if (curvedState != this._curved) {
            this._curved = curvedState;
            this._prepareRendering();
        }
    }

    
   
}