import { fabric } from 'fabric';


export
    class Rendering extends fabric.Object {
    constructor(options: fabric.IObjectOptions) {
        super(options);
        this.renderingOf = null;
    }

    renderingOf: RenderedElement | null;
}

/**
 * RenderedElement: a component of an automaton that can be rendered on a canvas.
 *
 */

export
    class RenderedElement {

    constructor(canvas: fabric.Canvas | null) {
        this.canvas = canvas;
        this._rendering = null;
    }

    canvas: fabric.Canvas | null;
    _rendering: Rendering | null;

    /**
     * Get the current rendering of this object.
     */
    get rendering() {
        return this._rendering;
    }

    getRendering() {
        return this._rendering;
    }

    /**
     * Replaces the current rendering in the canvas with a new one.
     */
    setRendering(newRendering: Rendering, front: boolean) {
        if (this.canvas) {
            if (!Object.is(this.rendering, newRendering)) {
                if (this.rendering) {
                    this.canvas.remove(this.rendering);
                }
                if (newRendering) {
                    this._rendering = newRendering;
                    this.canvas.add(newRendering);
                    if (front) {
                        this.canvas.bringToFront(newRendering);
                    }
                    this._rendering.renderingOf = this;
                }
            }
        }
    }
}
