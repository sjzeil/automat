import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { fabric } from 'fabric';



/**
 * BadLanguage: an artificial language type used to display error messages that prevent a language from loading
 * 
 */

export class BadLanguage extends FormalLanguage {
    constructor(canvas: fabric.Canvas, user: string, message: string) {
        super(canvas, user);
        this.message = message;
        this.specification = "badLang";
        this.rendering = new fabric.Text("", {left: 10, top: 10, fontSize:20, fontWeight: 'bold'});
        canvas.add(this.rendering);
    }

    message: string;
    rendering: fabric.Text;
    
    render() {
        this.rendering.set('text', this.message);
        this._canvas.clear();
        this._canvas.add(this.rendering);
        return this.message;
    }

    toJSon() {

        let object = {
            specification: this.specification,
            message: this.message,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        this.message = jsonObj.message;
    }

}