import { fabric } from 'fabric';
import { RenderedElement } from './renderedElement';
import { AutomatonState } from './states';


export interface StateOptions extends fabric.ICircleOptions {
	label?: string;
	selected?: boolean;
	final?: boolean;
	initial?: boolean;
	annotation?: string;
}

/**
 * State: rendering of an automaton state, displayed as a short string within a circle
 *
 */
var State = fabric.util.createClass(fabric.Group, {

	type: 'State',

	initialize: function(options: StateOptions) {
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

		let annotationText = options.annotation || "";
		this.set('annotation', new fabric.Text(annotationText, 
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

	render: function(ctx: CanvasRenderingContext2D) {
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

	select: function(yesNo: boolean) {
		this.fill = yesNo ? State.selectedColor: State.unselectedColor;
	},

	changeLabel(newLabel: string) {
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

	_render: function(ctx: CanvasRenderingContext2D) {
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
export
 class AutomatonStateRendering extends RenderedElement {

    constructor (state: AutomatonState, canvas: fabric.Canvas, renderingOptions: StateOptions) {
        super(canvas);
        this._state = state;
		this._prepareRendering(renderingOptions);
    }

	_state: AutomatonState;

    _prepareRendering(renderingOptions: StateOptions)
    {
		let options = (renderingOptions) ? renderingOptions : {};
		let left = (options.left) ? options.left : ((this.rendering) ? this.rendering.left : 50);
		let top = (options.top) ? options.top : ((this.rendering) ? this.rendering.top : 50);
		
        let rendering = new State({
            label: this._state.label,
            selected: this._state.selected,
            initial: this._state.initial,
            final: this._state.final,
            annotation : this._state.annotation,
			left: left,
			top: top
        });
        this.setRendering(rendering, false);
    }

    get label() {
        return this._state.label;
    }

    set label(newLabel) {
        if (newLabel != this._state.label) {
			this._state.label = newLabel;
            this._prepareRendering({});
        }
    }

    get annotation() {
        return this._state.annotation;
    }

    set annotation(newAnnotation) {
        if (newAnnotation != this._state.annotation) {
            this._state.annotation = newAnnotation;
            this._prepareRendering({});
        }
    }

    get selected() {
        return this._state.selected;
    }

    set selected(selectionState) {
        if (selectionState != this._state.selected) {
            this._state.selected = selectionState;
            this._prepareRendering({});
        }
    }
    
    get initial() {
        return this._state.initial;
    }

    set initial(initialState) {
        if (initialState != this._state.initial) {
            this._state.initial = initialState;
            this._prepareRendering({});
        }
    }
    
    get final() {
        return this._state.final;
    }

    set final(finalState) {
        if (finalState != this._state.final) {
            this._state.final = finalState;
            this._prepareRendering({});
        }
    }
    
}

