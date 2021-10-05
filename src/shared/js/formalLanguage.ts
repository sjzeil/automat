import { fabric } from 'fabric';

/**
 * FormalLanguage
 * 
 * A description of a formal language. Descriptions take the form of
 * 1) an automaton, 
 * 2) a grammar (with a sample derivation), or 
 * 3) a regular expression.
 */
export
class FormalLanguage {
    constructor(canvas: fabric.Canvas | null, user: string) {
        this._canvas = canvas;
        this.specification = "unspecified";
        this.createdBy = user;
        this.unlocked = true;
    }

    _canvas: fabric.Canvas | null;
    specification: string;
    createdBy: string;
    unlocked: boolean;

    clear() {

    }

    toJSon() {
        return '"specification": "' + this.specification + '"\n' +
               '"createdBy": "' + this.createdBy + '"\n' 
    }

    fromJSon(jsonObj: any) {
        this.createdBy = jsonObj.createdBy;
    }


}

