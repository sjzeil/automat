import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';



/**
 * BadLanguage: an artificial language type used to display error messages that prevent a language from loading
 * 
 */

export class BadLanguage extends FormalLanguage {
    constructor(user: string, message: string) {
        super(user);
        this.message = message;
        this.specification = "badLang";
    }

    message: string;

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