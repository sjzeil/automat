import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { fabric } from 'fabric';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpression extends FormalLanguage {
    constructor(canvas: fabric.Canvas, user: string) {
        super(canvas, user);
        this.regexp = "";
        this.specification = "regexp";
        this.rendering = new fabric.Text("", {left: 10, top: 10, fontSize:16, fontWeight: 'bold'});
        canvas.add(this.rendering);
    }

    regexp: string;
    rendering: fabric.Text;
    
    render() {
        let result = this.regexp.replace(/@/g, '\u03B5');
        this.rendering.set('text', result);
        this._canvas.clear();
        this._canvas.add(this.rendering);
        return result;
    }

    toJSon() {

        let object = {
            specification: this.specification,
            regexp: this.regexp,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        this.regexp = jsonObj.regexp;
    }

}