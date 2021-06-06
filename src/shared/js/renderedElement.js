/**
 * RenderedElement: a component of an automaton that can be rendered on a canvas.
 *
 */

class RenderedElement {

    constructor(canvas) {
        this.canvas = canvas;
        this._rendering = null;
    }

    /**
     * Get the current rendering of this object.
     */
    get rendering()
    {
        return this._rendering;
    }

    getRendering()
    {
        return this._rendering;
    }

    /**
     * Replaces the current rendering in the canvas with a new one.
     */
    setRendering (newRendering, front)
    {
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
