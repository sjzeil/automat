import { FormalLanguage } from './formalLanguage';
import { TestResult } from './formalLanguage';
import { ValidationResult } from './formalLanguage';
import { LanguageFactory } from './languageFactory';
import { Queue } from './queue';


export interface Production {
    lhs: string;
    rhs: string;
}

export interface Derivation {
    expandedSymbol: number;
    selectedProduction: number;
    expansion: string;
    leftmost: boolean;
    rightmost: boolean;
}

/**
 * Grammar: a collection of productions and a sample derivation/parse tree.
 * 
 */

export class Grammar extends FormalLanguage {
    static ParseLimit: number = 10000;

    constructor(user: string, problem: string) {
        super(user, problem);
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
        this.specification = LanguageFactory.CFGspec;
        this.parsable = null;
        this.nextAvailableNonTerminal = 0x3B1;  // alpha
    }

    productions: Production[];
    derivations: Derivation[];
    startingSymbol: string;
    nextAvailableNonTerminal: number;
    parsable: Grammar | null;

    static ProducesChar = "\u2192";
    static DerivesChar = "\u21D2";
    static Epsilon = FormalLanguage.epsilon;

    clone(): Grammar {
        let gr = new Grammar(this.createdBy, this.problemID);
        gr.startingSymbol = this.startingSymbol;
        for (let production of this.productions) {
            gr.addProduction(production);
        }
        return gr;
    }

    addProduction(prod: Production) {
        let pos = this.productions.findIndex(obj => (prod.lhs == obj.lhs) && (prod.rhs == obj.rhs));
        if (pos < 0) {
            this.productions.push({
                lhs: prod.lhs,
                rhs: prod.rhs
            });
            if (this.productions.length == 1 && this.productions[0].lhs.length == 1) {
                this.startingSymbol = this.productions[0].lhs;
            }
            this.derivations = [];
            this.addDerivation(-1, -1);
            this.parsable = null;
        }
    }

    removeProduction(prod: Production) {
        let prPos = this.productions.findIndex(obj => (prod.lhs == obj.lhs) && (prod.rhs == obj.rhs));
        if (prPos >= 0) {
            this.productions.splice(prPos, 1);
            this.derivations = [];
        }
        this.parsable = null;
    }

    clear() {
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
        this.parsable = null;
    }

    addDerivation(symbolNum: number, productionNum: number) {
        let derivation;
        if (this.derivations.length > 0) {
            let prior = this.derivations[this.derivations.length - 1];
            let leftPart = prior.expansion.substring(0, symbolNum);
            let leftmost = !(/[A-Z]/.test(leftPart));
            let rightPart = prior.expansion.substring(symbolNum + 1);
            let rightmost = !(/[A-Z]/.test(rightPart));
            derivation = {
                expandedSymbol: symbolNum,
                selectedProduction: productionNum,
                expansion: leftPart
                    + ((productionNum >= 0) ? this.productions[productionNum].rhs : "")
                    + rightPart,
                leftmost: prior.leftmost && leftmost,
                rightmost: prior.rightmost && rightmost,
            };

        } else {
            derivation = {
                expandedSymbol: -1,
                selectedProduction: -1,
                expansion: this.productions[0].lhs,
                leftmost: true,
                rightmost: true,
            };
        }
        this.derivations.push(derivation);
    }


    retractDerivation() {
        let derivation;
        if (this.derivations.length > 1) {
            this.derivations.pop();
        }
    }


    removeLeftRecursion() {
        let nonTerminals = this.collectNonTerminals();
        let self = this;
        for (let nonTerminal of nonTerminals) {
            let changed = true;
            while (changed) {
                changed = false;
                for (let p = 0; p < self.productions.length; ++p) {
                    let production = self.productions[p];
                    if (production.lhs == nonTerminal) {
                        if (production.rhs.length > 0 && self.isANonTerminal(production.rhs.charAt(0))) {
                            if (production.rhs.charAt(0) < nonTerminal) {
                                changed = true;
                                let nonTerminal2 = production.rhs.charAt(0);
                                let beta = production.rhs.substring(1);
                                let newProductions = [];
                                self.removeProduction(production);
                                for (let prod2 of self.productions) {
                                    if (prod2.lhs == nonTerminal2) {
                                        self.addProduction({
                                            lhs: nonTerminal,
                                            rhs: prod2.rhs + beta
                                        });
                                    }
                                }
                                p = self.productions.length;
                            }
                        }
                    }
                }
            }
            self.removeDirectLeftRecursionOn(nonTerminal);
        }
    }

    collectNonTerminals(): string[] {
        let result = new Set<string>();
        for (let production of this.productions) {
            result.add(production.lhs);
        }
        return Array.from(result).sort();
    }



    removeDirectLeftRecursion() {
        this.removeReflexiveProductions()
        let changed = true;
        while (changed) {
            changed = false;
            let k = this.findDirectLeftRecursion();
            if (k >= 0) {
                changed = true;
                this.removeDirectLeftRecursionOn(this.productions[k].lhs);
            }
        }
    }
    removeDirectLeftRecursionOn(nonTerminal: string) {
        let newProductions = [];
        let recursiveProductions = [];
        let nonrecursiveProductions = [];
        for (let production of this.productions) {
            if (production.lhs != nonTerminal) {
                newProductions.push(production);
            } else if ((production.rhs.length > 0) && (production.rhs.charAt(0) == nonTerminal)) {
                recursiveProductions.push(production);
            } else {
                nonrecursiveProductions.push(production);
            }
        }
        if (recursiveProductions.length > 0) {
            let newNonTerminal = this.generateNewNonTerminal();
            for (let prod of nonrecursiveProductions) {
                newProductions.push({
                    lhs: nonTerminal,
                    rhs: prod.rhs + newNonTerminal
                });
            }
            for (let prod of recursiveProductions) {
                newProductions.push({
                    lhs: newNonTerminal,
                    rhs: prod.rhs.substring(1) + newNonTerminal
                });
            }
            newProductions.push({
                lhs: newNonTerminal,
                rhs: ''
            });
        } else {
            for (let prod of nonrecursiveProductions) {
                newProductions.push({
                    lhs: prod.lhs,
                    rhs: prod.rhs
                });
            }
        }
        this.productions = newProductions;
    }

    generateNewNonTerminal(): string {
        let result = String.fromCodePoint(this.nextAvailableNonTerminal);
        ++this.nextAvailableNonTerminal;
        return result;
    }

    findDirectLeftRecursion(): number {
        for (let k = 0; k < this.productions.length; ++k) {
            if (this.productions[k].rhs.charAt(0) == this.productions[k].lhs)
                return k;
        }
        return -1;
    }

    productionSummary() {
        let result = "";
        for (const production of this.productions) {
            let productionString = production.lhs + ' ' + Grammar.ProducesChar + ' ' + production.rhs;
            if (result != "") {
                result += "\n";
            }
            result += productionString;
        }
        return result;
    }


    resetDerivations() {
        this.derivations = [];
        this.startingSymbol = (this.productions.length > 0) ? this.productions[0].lhs : 'S';
        this.addDerivation(-1, -1);
    }




    fullDerivation() {
        let counter = 0;
        let result = "";
        let d;
        for (d of this.derivations) {
            if (counter > 0) {
                result += ' ' + Grammar.DerivesChar + ' ';
            }
            result += d.expansion;
            if (counter % 4 == 3) {
                result += '\n';
            }
            ++counter;
        }
        return result;
    }

    derivationProperties() {
        let lastStep = this.derivations[this.derivations.length - 1];
        let derivationType = "";
        if (lastStep.leftmost && lastStep.rightmost) {
            derivationType = "leftmost and rightmost"
        } else if (lastStep.leftmost) {
            derivationType = "leftmost"
        }
        else if (lastStep.rightmost) {
            derivationType = "rightmost"
        } else {
            derivationType = "neither leftmost nor rightmost"
        }
        let derivationStatus = "completed";
        if (lastStep.expansion.toLowerCase() != lastStep.expansion) { // has at least one nonTerminal A..Z 
            derivationStatus = "incomplete";
        }
        return "Derivation is " + derivationStatus + ", " + derivationType + ".";
    }


    saveJSon(jsonObj: any) {
        super.saveJSon(jsonObj);
        let productionList = [];
        for (let production of this.productions) {
            productionList.push(production);
        }
        jsonObj.productions = productionList;
        let derivationList = [];
        for (let step of this.derivations) {
            let stepObj = {
                symbol: step.expandedSymbol,
                production: step.selectedProduction,
            };
            derivationList.push(stepObj);
        }
        jsonObj.derivation = derivationList;
    }

    fromJSon(jsonObj: any) {
        this.clear();
        super.fromJSon(jsonObj);
        this.productions = [];
        for (let prod of jsonObj.productions) {
            this.addProduction(prod);
        }
        this.derivations = [];
        for (let step of jsonObj.derivation) {
            if (this.derivations.length == 0) {
                this.addDerivation(step.symbol, step.production);
            } else {
                this.addDerivation(step.symbol, step.production);
            }
        }
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
        if (this.parsable == null) {
            this.parsable = this.clone();
            this.parsable.removeLeftRecursion();
        }
        return this.parsable.parse(sample);
    }

    parse(sample: string): TestResult {
        //console.log('parsing: ' + sample);
        let counter = 0;
        let q = new Queue<string>();
        let examined = new Set();

        let initalStr = this.startingSymbol;
        q.push(initalStr);
        examined.add(initalStr);

        while (counter < Grammar.ParseLimit && !q.isEmpty()) {
            ++counter;
            let derivation = q.front() as string;
            q.pop();
            // console.log('Examining ' + derivation);
            let derivationParts = this.splitAtFirstNonTermal(derivation);
            for (const prod of this.productions) {
                if (prod.lhs == derivationParts.middle) {
                    let newDeriv = derivationParts.left + prod.rhs + derivationParts.right;
                    if (newDeriv == sample) {
                        // console.log("accepted")
                        return new TestResult(true, '');
                    } else if ((!examined.has(newDeriv)) && this.mightDerive(newDeriv, sample)) {
                        // console.log(' pushing ' + newDeriv);
                        q.push(newDeriv);
                        examined.add(newDeriv);
                    }
                }
            }
        }
        // console.log('rejected');
        return new TestResult(false, "");
    }

    mightDerive(newDeriv: string, sample: string) {
        let lastWasNonTerm = false;
        let reStr = '^';
        for (let i = 0; i < newDeriv.length; ++i) {
            let sym = newDeriv.charAt(i);
            if (this.isANonTerminal(sym)) {
                if (!lastWasNonTerm) {
                    reStr += '.*';
                    lastWasNonTerm = true;
                }
            } else {
                if (this.isAlphanumeric(sym)) {
                    reStr += sym;
                } else if (sym == ']') {
                    reStr += '\\]';
                } else {
                    reStr += '[' + sym + ']';
                }
                lastWasNonTerm = false;
            }
        }
        reStr += '$';
        let re = new RegExp(reStr);
        return re.test(sample);
    }

    isAlphanumeric(sym: string): boolean {
        let code = sym.charCodeAt(0);
        return ((code > 47 && code < 58) ||
            (code > 64 && code < 91) ||
            (code > 96 && code < 123));
    }

    splitAtFirstNonTermal(derivation: string) {
        let k = 0;
        for (; k < derivation.length; ++k) {
            if (this.isANonTerminal(derivation.charAt(k))) {
                return {
                    left: derivation.substring(0, k),
                    middle: derivation.charAt(k),
                    right: derivation.substring(k + 1)
                };
            }
        }
        return {
            left: derivation,
            middle: '',
            right: ''
        }
    }

    private isANonTerminal(symbol: string): boolean {
        if (symbol >= 'A' && symbol <= 'Z')
            return true;
        else
            return (symbol > '~');
    }

    validate(): ValidationResult {
        let errors = '';
        let re = new RegExp('^[A-Za-z0-9_()*+@]*$');
        this.productions.forEach((prod: Production) => {
            let productionString = prod.lhs + ' ' + Grammar.ProducesChar + ' ' + prod.rhs;
            if (prod.lhs.length != 1) {
                errors += productionString + ": Left-hand-side must have exactly one symbol.<br/>\n"
            } else if (prod.lhs < 'A' || prod.lhs > 'Z') {
                errors += productionString + ": Left-hand-side must be a non-terminal (upper-case letter).<br/>\n"
            } else if (!re.test(prod.rhs)) {
                errors += productionString + ": Illegal chacter on right-hand-side of the production.<br/>\n"
            }
        });
        return new ValidationResult("", errors);
    }

    removeReflexiveProductions() {
        let newProductions = [];
        for (let production of this.productions) {
            if (production.lhs != production.rhs) {
                newProductions.push(production);
            }
        }
        this.productions = newProductions;
    }

}

