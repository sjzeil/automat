import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Rendering } from './renderings/renderedElement';
import { Grammar } from '../../../formalLangLib/src/js/grammar';
import { ProductionEditor } from './productionEditor'
import { fabric } from 'fabric';
import { ParseTreeNode } from './renderings/parseTreeNodes'
import { LanguageRendering } from './renderings/renderedLanguage';
import { GrammarRendering } from './renderings/renderedGrammar';



interface GrammarEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: LanguageRendering;
}

interface GrammarEditorState {
    status: string;
    selectedProduction: number;
    selectedNode: ParseTreeNode | null;
    error: string;
    testInput: string;
    testResult: string;
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
            testInput: '',
            testResult: ''
        };
        this.parent = props.parent;
        this.addDerivationStep = this.addDerivationStep.bind(this);
        this.retractDerivationStep = this.retractDerivationStep.bind(this);
        this.startTest = this.startTest.bind(this);
        this.runTest = this.runTest.bind(this);
        this.testInputChanged = this.testInputChanged.bind(this);
        this.rendering = this.props.language as GrammarRendering;
        if (this.rendering.language.productions.length == 0) {
            this.rendering.addProduction({ lhs: "S", rhs: "" });
        }
    }

    parent: FormalLanguageEditor;
    rendering: GrammarRendering;

    componentDidMount() {
        console.log("GrammarEditor mounted");
    }

    componentDidUpdate() {
        console.log("GrammarEditor updated");
        if (this.rendering.root != null) {
            let baseSelected = this.props.selected as any;
            if (baseSelected && baseSelected.renderingOf !== this.state.selectedNode) {
                this.rendering.root.clearSelections();
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
                    this.parent.setState({
                        editing: null,
                    });
                } else {
                    this.setState({
                        selectedNode: null,
                        error: "Selected leaf does not contain a non-terminal symbol.",
                    });
                    this.parent.setState({
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
        let lastStep = this.rendering.derivations[this.rendering.derivations.length - 1];
        let derivationType = this.rendering.derivationProperties();
        let validation = this.props.language.language.validate();
        return (
            <React.Fragment>
                <div className="editors">
                    <ProductionEditor parent={this} selectedOption={this.state.selectedProduction} />
                </div>
                <div id="derivationEditor" className="editors">
                    <h2>Derivation</h2>
                    <div className="derivation">
                        {this.rendering.fullDerivation()}
                    </div>
                    <div className="wrapped">
                        {derivationType}
                    </div>
                    <div>
                        <input type="button" value="+step" id="add_derivationStep"
                            onClick={this.addDerivationStep} />
                        <input type="button" value="-step" id="retract_derivationStep"
                            onClick={this.retractDerivationStep} />
                    </div>
                    <div className="explanation">
                        To add a derivation step, select a non-terminal leaf
                        in the tree, select a production, and click <code>+step</code>.
                    </div>
                    <div className="errors">
                        {this.state.error}
                    </div>
                    <div className="testing">
                        <h2>Testing</h2>
                        <div>
                            Input text:
                            <input type="text" id="regexp_text_in" name="regexp_text_in" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): 
                                        void => this.testInputChanged(ev.target.value)}
                                    value={this.state.testInput}
                                    className="regexpIn"
                                    maxLength={100}
                                    />
                        </div>
                        <div>
                            <input type="button" value="Test" onClick={this.runTest}/>
                            <span> </span>
                            <span className="testResult">{this.state.testResult}</span>
                        </div>
                    </div>
                    <div className="warnings">
                        {validation.warnings}
                    </div>
                    <div className="errors">
                        {validation.errors}
                    </div>

                </div>
            </React.Fragment>
        );
    }



    addDerivationStep() {
        if (this.props.selected == null) {
            this.setState({
                error: "No parse tree node has been selected."
            });
            return;
        }
        if (this.state.selectedNode == null) {
            this.setState({
                error: "No parse tree node has been selected."
            });
            return;
        }
        if (this.state.selectedNode.children.length > 0) {
            this.setState({
                error: "Selected parse tree node is not a leaf."
            });
            return;
        }
        let sym = this.state.selectedNode.label;
        let prodPos = this.state.selectedProduction;
        if (sym != this.rendering.language.productions[prodPos].lhs) {
            this.setState({
                error: "Left-hand side of selected production does not match the selected parse tree node."
            });
            return;
        }
        if (this.rendering.root == null) {
            this.setState({
                error: "**Error: parse tree is empty."
            });
            return;
        }
        let leaves = this.rendering.root.leaves(false);
        let symbolPos = leaves.indexOf(this.state.selectedNode);
        if (symbolPos < 0) {
            this.setState({
                error: "**Error: unexpected mismatch in derivation."
            });
        }
        this.rendering.addDerivation(symbolPos, prodPos, this.state.selectedNode);
        if (this.rendering.root != null) {
            this.rendering.root.clearSelections();
        }
        this.setState({
            error: "",
            selectedNode: null,
        });
        this.parent.setState({
            editing: null,
        });
    }





    retractDerivationStep() {
        console.log("retract");
        if (this.rendering.root != null) {
            this.rendering.root.clearSelections();
        }
        this.rendering.retractDerivation();
        this.setState({
            error: "",
            selectedNode: null,
        });
        this.parent.setState({
            editing: null,
        });
    }


    startTest() {

    }


    testInputChanged(newInput: string) {
        this.setState({
            testInput: newInput,
        });
    }

    runTest() {
        let result = this.rendering.language.test(this.state.testInput);
        let announcement = this.state.testInput + " was ";
        if (result.passed) {
            announcement = announcement + "accepted."
        } else {
            announcement = announcement + "rejected."
        }
        this.setState ({
            testResult: announcement,
        });
    }



}

