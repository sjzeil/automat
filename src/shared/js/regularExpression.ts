import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpression extends FormalLanguage {
    constructor(canvas: fabric.Canvas) {
        super(canvas);
        this.regexp = "";
        this.specification = "regexp";
    }

    regexp: string;
    
    render() {
        let result = this.regexp.replace(/@/g, '\u03B5');
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