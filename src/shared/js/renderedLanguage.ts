import { fabric } from 'fabric';
import { FormalLanguage } from './formalLanguage';

/**
 * RenderedLanguage
 * 
 * A formal language that is capable of display in an HTML canvas. 
 */
export
class LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string) {
        this.canvas = canvas;
        this.language = new FormalLanguage(user);
    }

    language: FormalLanguage;
    canvas: fabric.Canvas;


    clear() {

    }

    toJSon() {
        return this.language.toJSon();
    }

    fromJSon(jsonObj: any) {
        this.language.fromJSon(jsonObj);
    }


}

