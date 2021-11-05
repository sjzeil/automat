import { FormalLanguage } from './formalLanguage';



/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpression extends FormalLanguage {
    constructor(user: string, problem: string) {
        super(user, problem);
        this.regexp = "";
        this.specification = "regexp";
    }

    regexp: string;


    saveJSon(jsonObj: any) {
        super.saveJSon(jsonObj);
        jsonObj.regexp = this.regexp;
    }

    fromJSon(jsonObj: any) {
        super.fromJSon(jsonObj);
        this.regexp = jsonObj.regexp;
    }

}