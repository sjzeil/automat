import { fabric } from 'fabric';
import { FormalLanguage } from './formalLanguage';
import LZUTF8 from 'lzutf8';


/**
 * RenderedLanguage
 * 
 * A formal language that is capable of display in an HTML canvas. 
 */
export
class LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string, problem: string) {
        this.canvas = canvas;
        this.language = new FormalLanguage(user, problem);
    }

    language: FormalLanguage;
    canvas: fabric.Canvas;


    clear() {

    }

    saveJSon(jsonObj: any) {
        this.language.saveJSon(jsonObj);
    }

    fromJSon(jsonObj: any) {
        this.language.fromJSon(jsonObj);
    }

    encodeLanguage() {
        let jsonObj = {};
        this.saveJSon(jsonObj);
        let json = JSON.stringify(jsonObj);
        let encoded = LZUTF8.compress(json, { outputEncoding: "Base64" });
        console.log("json length: " + json.length + "  encoded length: " + encoded.length);
        return encoded;
    }

}

