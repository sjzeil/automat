import { FormalLanguage } from './formalLanguage';


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
    constructor(user: string, problem: string) {
        super(user, problem);
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
        this.specification = "grammar";
    }

    productions: Production[];
    derivations: Derivation[];
    startingSymbol: string;

    static ProducesChar = "\u2192";
    static DerivesChar = "\u21D2";
    static Epsilon = "\u03B5";


    addProduction(prod: Production) {
        let pos = this.productions.indexOf(prod);
        if (pos < 0) {
            this.productions.push(prod);
            if (this.productions.length == 1 && this.productions[0].lhs.length == 1) {
                this.startingSymbol = this.productions[0].lhs;
            }
            this.derivations = [];
            this.addDerivation(-1, -1);
        }
    }

    removeProduction(prod: Production) {
        let prPos = this.productions.indexOf(prod);
        if (prPos >= 0) {
            this.productions.splice(prPos, 1);
            this.derivations = [];
        }
    }

    clear() {
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
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

}