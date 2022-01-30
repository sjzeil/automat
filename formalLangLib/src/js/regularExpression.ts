import { Automaton } from './automaton';
import { FAEngine } from './FAEngine';
import { FormalLanguage } from './formalLanguage';
import { TestResult } from './formalLanguage';
import { ValidationResult } from './formalLanguage';
import { LanguageFactory } from './languageFactory';
import { AutomatonState } from './states';


interface ParseResult {
    matched: number; // number of characters matched
    start: AutomatonState;
    finish: AutomatonState;
}

/**
 * RegularExpression: a regular expression over alphanumerics and '_' with parentheses and operators * and +, and epsilon
 *                    as the empty string (typed as '@').
 * 
 */

export class RegularExpression extends FormalLanguage {
    constructor(user: string, problem: string) {
        super(user, problem);
        this.regexp = "";
        this.specification = LanguageFactory.REspec;
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
        return true;
    }

    producesOutput() {
        return false;
    }

    equivalentTo(other: FormalLanguage) {
        if (other.specification != this.specification) {
            return false;
        }
        let nfa1 = this.parse(this.regexp);
        let nfa2 = this.parse((other as RegularExpression).regexp);
        return nfa1.equivalentTo(nfa2);
    }


    parse(regexp: string): Automaton {
        let fa = new Automaton("Instructor", "", new FAEngine());
        try {
            let r = this.parseR(regexp, fa);
            // Did we parse the entire string?
            if (r.matched == regexp.length) {
                r.start.initial = true;
                r.finish.final = true;
            }
            return fa;
        } catch (e) {
            return fa;  // automaton will have no initial state
        }
    }


    parseR(regexp: string, fa: Automaton): ParseResult {
        // R -> T + R | T
        let t = this.parseT(regexp, fa);
        let remainder = regexp.substring(t.matched);
        if (remainder.length > 0 && remainder.charAt(0) == '+') {
            let r = this.parseR(remainder.substring(1), fa);
            let newStart = fa.addState() as AutomatonState;
            let newFinish = fa.addState() as AutomatonState;
            fa.addTransition(newStart?.label as string, t.start.label, '@');
            fa.addTransition(newStart?.label as string, r.start.label, '@');
            fa.addTransition(t.finish.label, newFinish.label, '@');
            fa.addTransition(r.finish.label, newFinish.label, '@');

            let response = {matched: t.matched + 1 + r.matched, start: newStart, finish: newFinish};
            return response;
        } else {
            return t;
        }
    }

    parseT(regexp: string, fa: Automaton): ParseResult {
        // T -> ST | S
        let s = this.parseS(regexp, fa);
        let remainder = regexp.substring(s.matched);
        if (remainder.length > 0) {
            let next = remainder.charAt(0);
            if (next.match(/[0-9A-Za-z@(]/)) {
                let t = this.parseT(remainder, fa);
                fa.addTransition(s.finish.label, t.start.label, '@');
                return {matched: s.matched + t.matched, start: s.start, finish: t.finish};
            }
        }
        return s;
    }


    parseS(regexp: string, fa: Automaton): ParseResult {
        // S -> U* | U
        let u = this.parseU(regexp, fa);
        let remainder = regexp.substring(u.matched);
        if (remainder.length > 0 && remainder.charAt(0) == '*') {
            fa.addTransition(u.finish.label, u.start.label, '@');
            return {matched: u.matched+1, start: u.start, finish: u.start};
        } else {
            return u;
        }
    }

    parseU(regexp: string, fa: Automaton): ParseResult {
        // U -> alphanumeric | @ | (R)
        if (regexp.length == 0) {
            throw "Parse error";
        }
        let next = regexp.charAt(0);
        if (next.match(/[0-9A-Za-z]/)) {
            let newStart = fa.addState() as AutomatonState;
            let newFinish = fa.addState() as AutomatonState;
            fa.addTransition(newStart.label, newFinish.label, next);
            return {matched: 1, start: newStart, finish: newFinish};
        } else if (next == '@') {
            let newNode = fa.addState() as AutomatonState;
            return {matched: 1, start: newNode, finish: newNode};
        } else if (next = '(') {
            let r = this.parseR(regexp.substring(1), fa);
            let remainder = regexp.substring(1+r.matched);
            if (remainder.length > 0 && remainder.charAt(0) == ')') {
                return {matched:r.matched+2, start: r.start, finish: r.finish};
            } else {
                throw "Parse error at " + remainder;
            }
        } else {
            throw "Parse error at " + regexp;
        }
    }

    test(sample: string): TestResult {
        let regexpForm = this.regexp.replace(/[+]/g, '|');
        regexpForm = regexpForm.replace(/@/g, '@{0}');
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
                let re2 = new RegExp(this.regexp.replace(/\+/g, '|'));
            } catch (err) {
                errors = "Syntax error in regular expression."
            }
        }
        return new ValidationResult("", errors);
    }

}