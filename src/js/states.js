/**
 * State: rendering of an automaton state, displayed as a short string within a circle
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
		this.set('hasControls', false);

		this.set('text', new fabric.Text(
			this.label,
			{fontSize: 14,
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
			fill: ((this.selected) ? State.selectedColor: State.unselectedColor),
			stroke: '#000000',
			originX: 'center',
			originY: 'center'
		}));

		this.set ('mainGroup',
			new fabric.Group(
				[this.circle, this.text],
				{
					top: 0
				}
			));

		let annotText = options.annotation || "";
		this.set('annotation', new fabric.Text(annotText, 
			{
				fontSize:this.text.fontSize,
				fontFamily: 'monospace',
				top: this.circle.height + State.rimOffSet
			}));
		this.annotation.left = -(this.annotation.width / 2);

		this.callSuper('initialize', [this.mainGroup, this.annotation], options);
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
			var y = this.top + this.circle.height/2;
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
			ctx.beginPath();
			ctx.arc(x, y, radius-State.rimOffSet, 0, 2*Math.PI);
			ctx.strokeStyle='black';
			ctx.stroke();
		}
	},

	select: function(yesNo) {
		this.fill = yesNo ? State.selectedColor: State.unselectedColor;
	},

	changeLabel(newLabel) {
		if (this.label != newLabel) {
			this.label = newLabel;
			let newText = new fabric.Text(newLabel, {
				fontSize: this.text.fontSize,
				fontWeight: this.text.fontWeight,
				fontFamily: this.text.fontFamily,
				originX: 'center',
			 	originY: 'center'
			});
			this.mainGroup.removeWithUpdate(this.text);

			this.mainGroup.addWithUpdate(newText);
			this.text = newText;
			this.setCoords();
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


/**
 * A renderable state within an automaton
 */
 class AutomatonState extends RenderedElement {

    constructor (label, canvas, renderingOptions) {
        super(canvas);
        this._label = label;
        this._selected = false;
        this._initial = false;
        this._final = false;
        this._annotation = "";
        this._prepareRendering(renderingOptions);
    }

    _prepareRendering(renderingOptions)
    {
		let options = (renderingOptions) ? renderingOptions : {};
		let left = (options.left) ? options.left : ((this.rendering) ? this.rendering.left : 50);
		let top = (options.top) ? options.top : ((this.rendering) ? this.rendering.top : 50);
		
        let rendering = new State({
            label: this.label,
            selected: this.selected,
            initial: this.initial,
            final: this.final,
            annotation : this.annotation,
			left: left,
			top: top
        });
        this.setRendering(rendering, false);
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

    get annotation() {
        return this._annotation;
    }

    set annotation(newAnnotation) {
        if (newAnnotation != this._annotation) {
            this._annotation = newAnnotation;
            this._prepareRendering();
        }
    }

    get selected() {
        return this._selected;
    }

    set selected(selectionState) {
        if (selectionState != this._selected) {
            this._selected = selectionState;
            this._prepareRendering();
        }
    }
    
    get initial() {
        return this._initial;
    }

    set initial(initialState) {
        if (initialState != this._initial) {
            this._initial = initialState;
            this._prepareRendering();
        }
    }
    
    get final() {
        return this._final;
    }

    set final(finalState) {
        if (finalState != this._final) {
            this._final = finalState;
            this._prepareRendering();
        }
    }
    
}

