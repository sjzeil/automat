import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { fabric } from 'fabric';
import { RegularExpression } from './regularExpression';
import { LanguageRendering } from './renderedLanguage';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpressionRendering extends LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string) {
        super(canvas, user);
        this.language = new RegularExpression(user);
        this.rendering = new fabric.Text("", { left: 10, top: 10, fontSize: 16, fontWeight: 'bold' });
        canvas.add(this.rendering);
    }

    language: RegularExpression;
    rendering: fabric.Text;

    render() {
        let result = this.language.regexp.replace(/@/g, '\u03B5');
        if (this.canvas) {
            this.rendering.set('text', result);
            this.canvas.clear();
            this.canvas.add(this.rendering);
        }
        return result;
    }

    toJSon() {

        let object = {
            specification: this.language.specification,
            createdBy: this.language.createdBy,
            regexp: this.language.regexp,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        super.fromJSon(jsonObj);
        this.language.fromJSon(jsonObj);
    }

}