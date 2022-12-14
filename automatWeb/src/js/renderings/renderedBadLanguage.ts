import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from '../../../../formalLangLib/src/js/formalLanguage';
import { fabric } from 'fabric';
import { LanguageRendering } from './renderedLanguage';
import { BadLanguage } from '../../../../formalLangLib/src/js/badLanguage';



/**
 * BadLanguage: an artificial language type used to display error messages that prevent a language from loading
 * 
 */

export class BadLanguageRendering extends LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string, message: string) {
        super(canvas, user);
        this.language = new BadLanguage(user, message);
        this.rendering = new fabric.Text("", { left: 10, top: 10, fontSize: 20, fontWeight: 'bold' });
        canvas.add(this.rendering);
    }

    language: BadLanguage;
    rendering: fabric.Text;

    render() {
            this.rendering.set('text', this.language.message);
            this.canvas.clear();
            this.canvas.add(this.rendering);
        return this.language.message;
    }

    saveJSon(jsonObj: any) {
        this.language.saveJSon(jsonObj);
    }

    fromJSon(jsonObj: any) {
        this.language.fromJSon(jsonObj);
    }

}