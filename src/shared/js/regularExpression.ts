import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { fabric } from 'fabric';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpression extends FormalLanguage {
    constructor(user: string) {
        super(user);
        this.regexp = "";
        this.specification = "regexp";
    }

    regexp: string;


    toJSon() {

        let object = {
            specification: this.specification,
            createdBy: this.createdBy,
            regexp: this.regexp,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        super.fromJSon(jsonObj);
        this.regexp = jsonObj.regexp;
    }

}