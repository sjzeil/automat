import React from 'react';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Rendering } from '../../shared/js/renderedElement';
import { Grammar } from '../../shared/js/grammar';
import { ProductionEditor } from './productionEditor'
import { fabric } from 'fabric';
import { ParseTreeNode } from '../../shared/js/parseTreeNodes'




interface GrammarEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: FormalLanguage;
}

interface GrammarEditorState {
    status: string;
    selectedProduction: number;
    selectedNode: ParseTreeNode | null;
    error: string;
}


export
    class GrammarEditor extends React.Component<GrammarEditorProps, GrammarEditorState> {

    /**
     * Editor for a grammar
     * @param props editor properties
     */
    constructor(props: GrammarEditorProps) {
        super(props);
        console.log("GrammarEditor constructed");

        this.state = {
            status: "new",
            selectedProduction: 0,
            selectedNode: null,
            error: "",
        };
        this.parent = props.parent;
        this.addDerivationStep = this.addDerivationStep.bind(this);
        this.retractDerivationStep = this.retractDerivationStep.bind(this);
        this.startTest = this.startTest.bind(this);
        this.language = new Grammar(this.parent.props.canvas);
        this.language.addProduction({ lhs: "S", rhs: "" });
    }

    parent: FormalLanguageEditor;
    language: Grammar;

    componentDidMount() {
        console.log("GrammarEditor mounted");
    }

    componentDidUpdate() {
        console.log("GrammarEditor updated");
        if (this.language.root != null) {
            let baseSelected = this.props.selected as any;
            if (baseSelected && baseSelected.renderingOf !== this.state.selectedNode) {
                this.language.root.clearSelections();
                let nodeRendering = this.props.selected as Rendering;
                let tree = nodeRendering.renderingOf as ParseTreeNode;
                let symbol = tree.label;
                if (tree.children.length == 0 && /^[A-Z]$/.test(symbol)) {
                    tree.selected = true;
                    this.setState({
                        selectedNode: tree,
                        error: "",
                    });
                } else if (tree.children.length > 0) {
                    this.setState({
                        selectedNode: null,
                        error: "Can only select leaves of the parse tree.",
                    });
                    this.parent.setState ({
                        editing: null,
                    });
                } else {
                    this.setState({
                        selectedNode: null,
                        error: "Selected leaf does not contain a non-terminal symbol.",
                    });
                    this.parent.setState ({
                        editing: null,
                    });

                }
            }
        }
    }

    componentWillUnmount() {
        console.log("GrammarEditor unmounting");
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        console.log("GrammarEditor rendering");

        return (
            <React.Fragment>
                <div className="editors">
                    <ProductionEditor parent={this} selectedOption={this.state.selectedProduction}/>
                </div>
                <div id="derivationEditor" className="editors">
                    <h2>Derivation</h2>
                    <div>
                        <input type="button" value="+step" id="add_derivationStep"
                            onClick={this.addDerivationStep} />
                        <input type="button" value="-step" id="retract_derivationStep"
                            onClick={this.retractDerivationStep} />
                    </div>
                    <div className="derivation">
                        {this.language.fullDerivation()}
                    </div>
                    <div className="explanation">
                        To add a derivation step, select a non-terminal leaf
                        in the tree, select a production, and click <code>+step</code>.
                    </div>
                    <div className="errors">
                        {this.state.error}
                    </div>
                </div>
            </React.Fragment>
        );
    }



    addDerivationStep() {
        if (this.props.selected != null) {
            if (this.state.selectedNode != null) {
                let sym = this.state.selectedNode.label;
                let prodPos = this.state.selectedProduction;
                if (sym == this.language.productions[prodPos].lhs) {
                    let symbolPos = this.language.derivations[this.language.derivations.length - 1].expansion.indexOf(sym);
                    if (symbolPos >= 0) {
                        this.language.addDerivation(symbolPos, prodPos, this.state.selectedNode);
                    }
                    this.setState ({
                        error: "",
                    });
                } else {
                    this.setState({
                        error: "Left-hand side of selected production does not match the selected parse tree node."
                    });
                }
            } else {
                this.setState ({
                    error: "No parse tree node has been selected."
                });
            }
        } else {
            this.setState ({
                error: "No production selected.",
            });
        }
    }





    retractDerivationStep() {
        console.log("retract");
        this.language.retractDerivation();
    }


    startTest() {

    }





}

