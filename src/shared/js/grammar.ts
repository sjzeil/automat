import { fabric } from 'fabric';
import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { Rendering, RenderedElement } from './renderedElement';
import { ParseTreeNode } from './parseTreeNodes';


export
    interface Production {
    lhs: string;
    rhs: string;
}

export
    interface Derivation {
    expandedSymbol: number;
    selectedProduction: number;
    expansion: string;
    tree: ParseTreeNode;
}

/**
 * Grammar: a collection of productions and a sample derivation/parse tree.
 * 
 */

export class Grammar extends FormalLanguage {
    constructor(canvas: fabric.Canvas) {
        super(canvas);
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
        this.specification = "grammar";
        this.root = null;
    }

    productions: Production[];
    derivations: Derivation[];
    startingSymbol: string;
    root: ParseTreeNode | null;

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
            let treeRoot = this.root as ParseTreeNode;
            derivation = {
                expandedSymbol: symbolNum,
                selectedProduction: productionNum,
                expansion: prior.expansion.substring(0, symbolNum)
                    + this.productions[productionNum].rhs
                    + prior.expansion.substring(symbolNum + 1),
                tree: treeRoot.leafAfter(prior.expansion.substring(0, symbolNum)
                        + this.productions[productionNum].rhs).found as ParseTreeNode,
            };
            if (this.productions[productionNum].rhs.length > 0) {
                let i;
                for (i = 0; i < this.productions[productionNum].rhs.length; ++i) {
                    let symbol = this.productions[productionNum].rhs.substring(i, i + 1);
                    let child = new ParseTreeNode(symbol, this._canvas, {});
                    prior.tree.children.push(child);
                }
            } else {
                let child = new ParseTreeNode(' ', this._canvas, {});
                prior.tree.children.push(child);
                child.parent = prior.tree;
            }
            

        } else {
            derivation = {
                expandedSymbol: -1,
                selectedProduction: -1,
                expansion: this.startingSymbol,
                tree: new ParseTreeNode(this.startingSymbol, this._canvas, {}),
            };
            this.root = derivation.tree;
        }
        this.derivations.push(derivation);

        this.treeLayout();
    }


    retractDerivation() {
        let derivation;
        if (this.derivations.length > 1) {
            let finalStep = this.derivations.pop() as Derivation;
            let treeRoot = this.root as ParseTreeNode;
            let i;
            for (i = 0; i < finalStep.tree.children.length; ++i) {
                let child = finalStep.tree.children[i];
                this._canvas.remove(child.rendering as fabric.Object);
            }
            finalStep.tree.children = [];
            this.treeLayout();
        }
    }




    treeLayout() {

    }

    resetDerivations() {
        this._canvas.clear();
        this.root = null;
        this.derivations = [];
        this.startingSymbol = (this.productions.length > 0) ? this.productions[0].lhs : 'S';
        this.addDerivation(-1, -1);
    }




    fullDerivation() {
        let d;
        let steps = [];
        for (d of this.derivations) {
            steps.push(d.expansion);
        }
        return steps.join(` ${Grammar.DerivesChar} `);
    }

}

