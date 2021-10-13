import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';



/**
 * BadLanguage: an artificial language type used to display error messages that prevent a language from loading
 * 
 */

export class BadLanguage extends FormalLanguage {
    constructor(user: string, message: string) {
        super(user, "");
        this.message = message;
        this.specification = "badLang";
    }

    message: string;

    saveJSon(jsonObj: any) {

        jsonObj.message = this.message;
        super.saveJSon(jsonObj);
    }

    fromJSon(jsonObj: any) {
        this.message = jsonObj.message;
    }

}