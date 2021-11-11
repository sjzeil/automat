import { FormalLanguage } from './formalLanguage';
import { TestResult } from './formalLanguage';
import { ValidationResult } from './formalLanguage';



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

    canBeCheckedForEquivalence() {
        return false;
    }

    producesOutput() {
        return false;
    }

    equivalentTo(other: FormalLanguage) {
        return false;
    }

    test(sample: string): TestResult {
        let regexpForm = this.regexp.replaceAll('+', '|');
        regexpForm = regexpForm.replaceAll('@', '={0}');
        let re = new RegExp('^' + regexpForm + '$');
        let result = re.test(sample);
        return new TestResult(result, "");
    }

    validate(): ValidationResult {
        let re = new RegExp('^[A-Za-z0-9_()*+@]*$');
        let result = re.test(this.regexp);
        let errors = "";
        if (!result) {
            errors = "Invalid character in regular expression."
        } else {
            try {
                let re2 = new RegExp(this.regexp);
            } catch (err) {
                errors = "Syntax error in regular expression."
            }
        }
        return new ValidationResult("", errors);
    }

}