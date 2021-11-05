import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from '../../../../formalLangLib/src/js/formalLanguage';
import { fabric } from 'fabric';
import { RegularExpression } from '../../../../formalLangLib/src/js/regularExpression';
import { LanguageRendering } from './renderedLanguage';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpressionRendering extends LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string, problem: string) {
        super(canvas, user, problem);
        this.language = new RegularExpression(user, problem);
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

    saveJSon(jsonObj: any) {
        this.language.saveJSon(jsonObj);
    }

    fromJSon(jsonObj: any) {
        super.fromJSon(jsonObj);
        this.language.fromJSon(jsonObj);
    }

}