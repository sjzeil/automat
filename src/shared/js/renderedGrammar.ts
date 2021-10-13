import { fabric } from 'fabric';
import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { Rendering, RenderedElement } from './renderedElement';
import { ParseTreeNode } from './parseTreeNodes';
import { LanguageRendering } from './renderedLanguage';
import { Grammar } from './grammar';


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
    tree: ParseTreeNode;
}

/**
 * Grammar: a collection of productions and a sample derivation/parse tree.
 * 
 */

export class GrammarRendering extends LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string, problem: string) {
        super(canvas, user, problem);
        this.derivations = [];
        this.language = new Grammar(user, problem);
        this.root = null;
        this.summary = new fabric.Text('hello', { left: 10, top: 2, fontSize: 16 });
        this.derivation = new fabric.Text('goodbye', { left: 100, top: 2, fontSize: 16 });
        this.canvas.add(this.summary);
        this.canvas.add(this.derivation);
    }

    language: Grammar;
    derivations: Derivation[];
    root: ParseTreeNode | null;
    summary: fabric.Text;
    derivation: fabric.Text;

    static ProducesChar = "\u2192";
    static DerivesChar = "\u21D2";
    static Epsilon = "\u03B5";


    addProduction(prod: Production) {
        let pos = this.language.productions.indexOf(prod);
        this.language.addProduction(prod);
        //if (pos < 0) {
            this.derivations = [];
            this.language.derivations = [];
            this.addDerivation(-1, -1, new ParseTreeNode(this.language.startingSymbol, this.canvas, {}));
        //}
        this.treeLayout();
    }

    removeProduction(prod: Production) {
        this.language.removeProduction(prod);
    }

    clear() {
        this.language.clear();
        this.derivations = [];
    }

    addDerivation(symbolNum: number, productionNum: number, leaf: ParseTreeNode) {
        this.language.addDerivation(symbolNum, productionNum);
        let derivation;
        if (this.derivations.length > 0) {
            let prior = this.derivations[this.derivations.length - 1];
            let treeRoot = this.root as ParseTreeNode;
            let leftPart = prior.expansion.substring(0, symbolNum);
            let leftmost = !(/[A-Z]/.test(leftPart));
            let rightPart = prior.expansion.substring(symbolNum + 1);
            let rightmost = !(/[A-Z]/.test(rightPart));
            derivation = {
                expandedSymbol: symbolNum,
                selectedProduction: productionNum,
                expansion: leftPart
                    + ((productionNum >= 0) ?this.language.productions[productionNum].rhs: "")
                    + rightPart,
                tree: leaf,
                leftmost: prior.leftmost && leftmost,
                rightmost: prior.rightmost && rightmost,
            };
            if (this.language.productions[productionNum].rhs.length > 0) {
                let i;
                for (i = 0; i < this.language.productions[productionNum].rhs.length; ++i) {
                    let symbol = this.language.productions[productionNum].rhs.substring(i, i + 1);
                    let child = new ParseTreeNode(symbol, this.canvas, {});
                    leaf.children.push(child);
                    child.parent = leaf;
                }
            } else {
                let child = new ParseTreeNode(' ', this.canvas, {});
                leaf.children.push(child);
                child.parent = leaf;
            }


        } else {
            derivation = {
                expandedSymbol: -1,
                selectedProduction: -1,
                expansion: leaf.label,
                tree: leaf,
                leftmost: true,
                rightmost: true,
            };
            this.root = derivation.tree;
        }
        this.derivations.push(derivation);

        this.treeLayout();
    }


    retractDerivation() {
        this.language.retractDerivation();
        let derivation;
        if (this.derivations.length > 1) {
            let finalStep = this.derivations.pop() as Derivation;
            let treeRoot = this.root as ParseTreeNode;
            let i;
            if (this.canvas) {
                for (let child of finalStep.tree.children) {
                    this.canvas.remove(child.rendering as fabric.Object);
                }
                for (let connector of finalStep.tree.connectors) {
                    this.canvas.remove(connector);
                }
            }
            finalStep.tree.children = [];
            finalStep.tree.connectors = [];
            this.treeLayout();
        }
    }


    productionSummary() {
        let result = "";
        for (const production of this.language.productions) {
            let productionString = production.lhs + ' ' + Grammar.ProducesChar + ' ' + production.rhs;
            if (result != "") {
                result += "\n";
            }
            result += productionString;
        }
        return result;
    }

    _doLayout(tree: ParseTreeNode, x: number, y: number, hOffset: number, vOffset: number) {
        let wTotal = 0;
        for (const child of tree.children) {
            let w = this._doLayout(child, x + wTotal, y + vOffset, hOffset, vOffset);
            wTotal += w;
        }
        wTotal = Math.max(wTotal, hOffset);
        const theRendering = tree.rendering as any;
        theRendering.top = y;
        theRendering.left = Math.max(0, x + wTotal / 2 - hOffset / 2);
        theRendering.setCoords();
        tree.addConnectors();
        return Math.max(wTotal, hOffset);
    }

    treeLayout() {
        if (this.root != null) {
            let renderedNode = this.root.rendering as any;
            if (renderedNode != null) {
                this.summary.set("text", this.productionSummary());
                this.derivation.set("text", this.fullDerivation() + '\n' + this.derivationProperties());
                this.derivation.set("left", this.summary.get("width")! + 50);
                let horizontalOffset = 3 * renderedNode.width / 2;
                let verticalOffset = 3 * renderedNode.height / 2;
                let treeY = Math.max(this.summary.get("height")!, this.derivation.get("height")!);
                this._doLayout(this.root, 20, treeY + 10, horizontalOffset, verticalOffset);
            }
        }
    }

    resetDerivations() {
        this.canvas.clear();
        this.canvas.add(this.summary);
        this.canvas.add(this.derivation);
        this.root = null;
        this.derivations = [];
        this.language.derivations = [];
        this.language.startingSymbol = (this.language.productions.length > 0) ? this.language.productions[0].lhs : 'S';
        this.addDerivation(-1, -1, new ParseTreeNode(this.language.startingSymbol, this.canvas, {}));
        this.treeLayout();
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
        this.language.saveJSon(jsonObj);
    }

    fromJSon(jsonObj: any) {
        this.clear();
        super.fromJSon(jsonObj);
        this.derivations = [];
        this.language.derivations = [];
        for (let step of jsonObj.derivation) {
            if (this.derivations.length == 0) {
                this.addDerivation(step.symbol, step.production, new ParseTreeNode(this.language.startingSymbol, this.canvas, {}));
            } else {
                let root = this.root as ParseTreeNode;
                let leaves = root.leaves(false);
                this.addDerivation(step.symbol, step.production, leaves[step.symbol]);
            }
        }
    }

}