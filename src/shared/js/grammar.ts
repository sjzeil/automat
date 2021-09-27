import { fabric } from 'fabric';
import { JavascriptModulesPlugin } from 'webpack';
import { FormalLanguage } from './formalLanguage';
import { Rendering, RenderedElement } from './renderedElement';
import { ParseTreeNode } from './parseTreeNodes';


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

export class Grammar extends FormalLanguage {
    constructor(canvas: fabric.Canvas, user: string) {
        super(canvas, user);
        this.productions = [];
        this.derivations = [];
        this.startingSymbol = "";
        this.specification = "grammar";
        this.root = null;
        this.summary = new fabric.Text('hello', {left: 10, top: 2, fontSize: 16});
        this.derivation = new fabric.Text('goodbye', {left: 100, top: 2, fontSize: 16});
        this._canvas.add(this.summary);
        this._canvas.add(this.derivation);
    }

    productions: Production[];
    derivations: Derivation[];
    startingSymbol: string;
    root: ParseTreeNode | null;
    summary: fabric.Text;
    derivation: fabric.Text;

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
            this.addDerivation(-1, -1, new ParseTreeNode(this.startingSymbol, this._canvas, {}));
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

    addDerivation(symbolNum: number, productionNum: number, leaf: ParseTreeNode) {
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
                    + this.productions[productionNum].rhs
                    + rightPart,
                tree: leaf,
                leftmost: prior.leftmost && leftmost,
                rightmost: prior.rightmost && rightmost,
            };
            if (this.productions[productionNum].rhs.length > 0) {
                let i;
                for (i = 0; i < this.productions[productionNum].rhs.length; ++i) {
                    let symbol = this.productions[productionNum].rhs.substring(i, i + 1);
                    let child = new ParseTreeNode(symbol, this._canvas, {});
                    leaf.children.push(child);
                    child.parent = leaf;
                }
            } else {
                let child = new ParseTreeNode(' ', this._canvas, {});
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
        let derivation;
        if (this.derivations.length > 1) {
            let finalStep = this.derivations.pop() as Derivation;
            let treeRoot = this.root as ParseTreeNode;
            let i;
            for (let child of finalStep.tree.children) {
                this._canvas.remove(child.rendering as fabric.Object);
            }
            for (let connector of finalStep.tree.connectors) {
                this._canvas.remove(connector);
            }
            finalStep.tree.children = [];
            finalStep.tree.connectors = [];
            this.treeLayout();
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
                this._doLayout(this.root, 20, treeY+10, horizontalOffset, verticalOffset);
            }
        }
    }

    resetDerivations() {
        this._canvas.clear();
        this._canvas.add(this.summary);
        this._canvas.add(this.derivation);
        this.root = null;
        this.derivations = [];
        this.startingSymbol = (this.productions.length > 0) ? this.productions[0].lhs : 'S';
        this.addDerivation(-1, -1, new ParseTreeNode(this.startingSymbol, this._canvas, {}));
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


    toJSon() {
        let productionList = [];
        for (let production of this.productions) {
            productionList.push(production);
        }
        let derivationList = [];
        for (let step of this.derivations) {
            let stepObj = {
                symbol: step.expandedSymbol,
                production: step.selectedProduction,
            };
            derivationList.push(stepObj);
        }

        let object = {
            specification: this.specification,
            productions: productionList,
            derivation: derivationList,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        this.clear();
        this.productions = [];
        for (let prod of jsonObj.productions) {
            this.addProduction(prod);
        }
        this.derivations = [];
        this._canvas.clear();
        for (let step of jsonObj.derivation) {
            if (this.derivations.length == 0) {
                this.addDerivation(step.symbol, step.production, new ParseTreeNode(this.startingSymbol, this._canvas, {}));
            } else {
                let root = this.root as ParseTreeNode;
                let leaves = root.leaves(false);
                this.addDerivation(step.symbol, step.production, leaves[step.symbol]);
            }
        }
    }

}