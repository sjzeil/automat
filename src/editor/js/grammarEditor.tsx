import React from 'react';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
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
    selected2: fabric.Object | null;
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
            selected2: null,
        };
        this.parent = props.parent;
        this.addDerivationStep = this.addDerivationStep.bind(this);
        this.retractDerivationStep = this.retractDerivationStep.bind(this);
        this.startTest = this.startTest.bind(this);
        this.language = new Grammar(this.parent.props.canvas);
        this.language.addProduction({lhs: "S", rhs:""});
    }

    parent: FormalLanguageEditor;
    language: Grammar;

    componentDidMount() {
        console.log("GrammarEditor mounted");
    }

    componentDidUpdate() {
        console.log("GrammarEditor updated");
        /*
        if (this.state.status == "addingState" && this.props.parent.state.clicked != null) {
            let a = this.props.parent.language as Grammar;
            let loc = this.props.parent.state.clicked as MouseLoc;
            let newState = a.addState(loc.x, loc.y);
            this.parent.setState({
                clicked: null,
                editing: newState.rendering,
            });
            this.setState({
                status: "state",
            });
        } else if (this.state.status == "addingTransition" && this.props.parent.state.editing != null) {
            if (this.state.selected1 == null) {
                let rendering = this.props.parent.state.editing;
                this.props.parent.setState({
                    editing: null,
                });
                this.setState({
                    selected1: rendering,
                });
            } else if (this.state.selected2 == null) {
                let rendering = this.props.parent.state.editing;
                this.setState({
                    selected2: rendering,
                });
                let a = this.props.parent.language as Grammar;
                let loc = this.props.parent.state.clicked as MouseLoc;
                let sourceState = this.state.selected1 as any;
                let destState = this.props.parent.state.editing as any;
                let newTransition = a.addTransition(sourceState.label, destState.label, "?") as AutomatonTransition;
                this.parent.setState({
                    clicked: null,
                    editing: newTransition.rendering,
                });
                this.setState({
                    status: "transition",
                    selected1: null,
                    selected2: null,
                });
            }

        } else if (this.state.status == "state") {
            console.log("updated Grammar editor in state mode");
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "Transition") {
                this.setState({
                    status: "transition",
                });
            }
        } else if (this.state.status == "transition") {
            console.log("updated Grammar editor in transition mode");
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "State") {
                this.setState({
                    status: "state",
                });
            } else if (selectedItem != null && selectedItem.type == "Transition") {
                if (this.props.selected != this.props.parent.state.editing) {
                    this.props.parent.setState ({
                        
                    });
                }
            }
        } else if (this.state.status == "new") {
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "State") {
                this.setState({
                    status: "state",
                });
            } else if (selectedItem != null && selectedItem.type == "Transition") {
                this.setState({
                    status: "transition",
                });
            }
        }
        */
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
                    <ProductionEditor parent={this} />
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
                </div>
            </React.Fragment>
        );
    }

    

    addDerivationStep() {
        if (this.props.selected != null) {
            let selected = this.props.selected as any;
            let sym = selected.label;
            let symbolPos = this.language.derivations[this.language.derivations.length-1].expansion.indexOf(sym);
            if (symbolPos >= 0) {
                let prodPos = this.state.selectedProduction;
                this.language.addDerivation(symbolPos, prodPos);
            }
        }
    }





    retractDerivationStep() {
        console.log("retract");
        this.language.retractDerivation();
    }


    startTest() {

    }





}

