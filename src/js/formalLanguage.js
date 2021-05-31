/**
 * FormalLanguage
 * 
 * A description of a formal language. Descriptions take the form of
 * 1) an automaton, 
 * 2) a grammar (with a sample derivation), or 
 * 3) a regular expression.
 */
class FormalLanguage {
    constructor(canvas) {
        this._canvas = canvas;
    }

    /**
     * May be "automaton", "grammar", or "regexp".
     * 
     * @returns a string describing the representation style
     */
    representation() {
        return "unspecified";
    }

    clear() {

    }

    toJSon() {
        return '"representation": "' + this.representation() + '"\n';
    }

    fromJSon(jsonObj) {
        return this;
    }

}

