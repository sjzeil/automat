import { fabric } from 'fabric';
import { RenderedElement, Rendering } from './renderedElement';


export interface PTNodeOptions extends fabric.ICircleOptions {
	label?: string;
	selected?: boolean;
}

/**
 * PTNodeRendering: displayed as a short string within a circle
 *
 */
export
	var PTNodeRendering = fabric.util.createClass(fabric.Group, {

		type: 'ParseTreeNode',

		initialize: function (options: PTNodeOptions) {
			options || (options = {});
			this.set('label', options.label || ' ');
			this.set('selected', options.selected || false);
			this.set('hasControls', false);

			this.set('text', new fabric.Text(
				this.label,
				{
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
			radius += PTNodeRendering.rimOffSet;
			if (this.final) {
				radius += PTNodeRendering.rimOffSet;
			}

			this.set('circle', new fabric.Circle({
				radius: radius,
				fill: ((this.selected) ? PTNodeRendering.selectedColor : PTNodeRendering.unselectedColor),
				stroke: '#000000',
				originX: 'center',
				originY: 'center'
			}));

			this.callSuper('initialize', [this.circle, this.text], options);
		},

		toObject: function () {
			return fabric.util.object.extend(this.callSuper('toObject'), {
				label: this.get('label'),
			});
		},


		select: function (yesNo: boolean) {
			this.fill = yesNo ? PTNodeRendering.selectedColor : PTNodeRendering.unselectedColor;
		},


		_render: function (ctx: CanvasRenderingContext2D) {
			this.callSuper('_render', ctx);
			alert("in _render");
			if (this.final) {
				var radius = this.width / 2;
				var x = this.left + radius;
				var y = this.top + radius;
				ctx.beginPath();
				ctx.arc(x, y, radius - PTNodeRendering.rimOffSet, 0, 2 * Math.PI);
				ctx.strokeStyle = 'black';
				ctx.stroke();
			}
		}
	});

PTNodeRendering.selectedColor = '#88FF88';
PTNodeRendering.unselectedColor = '#88FFFF';
PTNodeRendering.rimOffSet = 5;
PTNodeRendering.initMarkerSize = 3 * PTNodeRendering.rimOffSet;

interface LeafSearch {
	remaining: string;
	found: ParseTreeNode | null;
}


/**
 * A renderable node within a parse tree
 */
export
	class ParseTreeNode extends RenderedElement {

	constructor(label: string, canvas: fabric.Canvas | null, renderingOptions: PTNodeOptions) {
		super(canvas);
		this._label = label;
		this._selected = false;
		this.parent = null;
		this.children = [];
		this.connectors = [];
		this._prepareRendering(renderingOptions);
	}

	_label: string;
	_selected: boolean;
	parent: ParseTreeNode | null;
	children: ParseTreeNode[];
	connectors: fabric.Line[];


	leafAfter(partialDerivation: string): LeafSearch {
		if (partialDerivation == "") {
			return { remaining: "", found: this } as LeafSearch;
		} else if (this.children.length == 0) {
			if (this._label != partialDerivation.substring(0, 1)) {
				console.log("Mismatch in leafAfter. '" + this._label + "' does not match '" + partialDerivation + "'");
			}
			return { remaining: partialDerivation.substring(1), found: null } as LeafSearch;
		} else {
			let i;
			let result = { remaining: partialDerivation, found: null } as LeafSearch;
			for (i = 0; i < this.children.length; ++i) {
				result = this.children[i].leafAfter(result.remaining);
				if (result.found) {
					return result;
				}
			}
			return result;
		}
	}

	_leaves(leafList: ParseTreeNode[], includeEmptyLeaves: boolean) {
		if (this.children.length == 0) {
			if (includeEmptyLeaves || this.label != ' ') {
				leafList.push(this);
			}
		} else {
			for (let child of this.children) {
				child._leaves(leafList, includeEmptyLeaves);
			}
		}
	}

	leaves(includeEmptyLeaves: boolean): ParseTreeNode[] {
		let leafList = [] as ParseTreeNode[];
		this._leaves(leafList, includeEmptyLeaves);
		return leafList;
	}

	clearSelections() {
		this.selected = false;
		for (const child of this.children) {
			child.clearSelections();
		}
	}

	addConnectors() {
		if (this.canvas) {
			for (let connector of this.connectors) {
				this.canvas.remove(connector);
			}
			this.connectors = [];
			for (let i = 0; i < this.children.length; ++i) {
				let parentRendering = this.rendering as any;
				let childRendering = this.children[i].rendering as any;
				let x0 = parentRendering.left + parentRendering.width / 2;
				let y0 = parentRendering.top + parentRendering.width / 2;

				let x1 = childRendering.left + childRendering.width / 2;
				let y1 = childRendering.top + childRendering.width / 2;


				let dx = x1 - x0;
				let dy = y1 - y0;
				let angle = Math.atan2(dy, dx);

				let exitAngle = angle;
				let exitX = x0 + (parentRendering.width / 2) * Math.cos(exitAngle);
				let exitY = y0 + (parentRendering.width / 2) * Math.sin(exitAngle);

				let entryAngle = angle + Math.PI;
				let entryX = x1 + (childRendering.width / 2) * Math.cos(entryAngle);
				let entryY = y1 + (childRendering.width / 2) * Math.sin(entryAngle);

				let connector = new fabric.Line([exitX, exitY, entryX, entryY], {
					fill: 'black',
					stroke: 'clack',
					strokeWidth: 1,
					selectable: false,
					evented: false,
				});
				this.connectors.push(connector);
				this.canvas.add(connector);
			}
		}
	}

	_prepareRendering(renderingOptions: PTNodeOptions) {
		let options = (renderingOptions) ? renderingOptions : {};

		let left = ('left' in options) ? options.left : ((this.rendering) ? this.rendering.left : Math.floor(Math.random() * 100.0));
		let top = ('top' in options) ? options.top : ((this.rendering) ? this.rendering.top : Math.floor(Math.random() * 100.0));

		let rendering = new PTNodeRendering({
			label: this.label,
			selected: this.selected,
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
			this._prepareRendering({});
		}
	}


	get selected() {
		return this._selected;
	}

	set selected(selectionState) {
		if (selectionState != this._selected) {
			this._selected = selectionState;
			this._prepareRendering({});
		}
	}


}

