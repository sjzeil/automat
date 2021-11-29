import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Automaton } from '../../../formalLangLib/src/js/automaton';
import { AutomatonState } from '../../../formalLangLib/src/js/states';
import { AutomatonTransition } from '../../../formalLangLib/src/js/transitions';
import { StateEditor } from './stateEditor';
import { TransitionEditor } from './transitionEditor';
import { fabric } from 'fabric';
import { LanguageRendering } from './renderings/renderedLanguage';
import { AutomatonRendering } from './renderings/renderedAutomaton';
import { AutomatonStateRendering } from './renderings/stateRendering';
import { TransitionRendering } from './renderings/renderedTransitions';




interface AutomatonEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: LanguageRendering;
}

interface AutomatonEditorState {
    status: string;
    selected1: fabric.Object | null;
    selected2: fabric.Object | null;
}


export
    class AutomatonEditor extends React.Component<AutomatonEditorProps, AutomatonEditorState> {

    /**
     * Editor for an automaton
     * @param props editor properties
     */
    constructor(props: AutomatonEditorProps) {
        super(props);
        console.log("AutomatonEditor constructed");

        this.state = {
            status: "new",
            selected1: null,
            selected2: null,
        };
        this.parent = props.parent;
        this.addState = this.addState.bind(this);
        this.addTransition = this.addTransition.bind(this);
        this.startTest = this.startTest.bind(this);
        this.clicked = this.clicked.bind(this);
        this.selected = this.selected.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
    }

    parent: FormalLanguageEditor;
    
    componentDidMount() {
        console.log("AutomatonEditor mounted");
    }

    componentDidUpdate() {
        console.log("AutomatonEditor updated");
        if (this.state.status == "addingState" && this.props.parent.state.clicked != null) {
            let a = this.props.parent.rendering as AutomatonRendering;
            let loc = this.props.parent.state.clicked as MouseLoc;
            let newState = a.addState(loc.x, loc.y);
            if (newState) {
                this.parent.setState({
                    clicked: null,
                    editing: newState._rendering,
                });
                this.setState({
                    status: "state",
                });
            }
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
                let a = this.props.parent.rendering as AutomatonRendering;
                let loc = this.props.parent.state.clicked as MouseLoc;
                let sourceState = this.state.selected1 as any;
                let destState = this.props.parent.state.editing as any;
                let newTransition = a.addTransition(sourceState.label, destState.label, "?");
                if (newTransition) {
                    this.parent.setState({
                        clicked: null,
                        editing: newTransition._rendering,
                    });
                    this.setState({
                        status: "transition",
                        selected1: null,
                        selected2: null,
                    });
                }
            }

        } else if (this.state.status == "state") {
            console.log("updated Automaton editor in state mode");
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "Transition") {
                this.setState({
                    status: "transition",
                });
            }
        } else if (this.state.status == "transition") {
            console.log("updated Automaton editor in transition mode");
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "State") {
                this.setState({
                    status: "state",
                });
            } else if (selectedItem != null && selectedItem.type == "Transition") {
                if (this.props.selected != this.props.parent.state.editing) {
                    this.props.parent.setState({

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
    }

    componentWillUnmount() {
        console.log("AutomatonEditor unmounting");
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        console.log("AutomatonEditor rendering");

        let mainEditor = this.parent;
        let editorDetail;
        if (this.state.status == "new") {
            editorDetail = <span></span>;
        } else if (this.state.status == "addingState" && this.props.parent.state.clicked == null) {
            editorDetail = (<p>Click to position the new state.</p>);
        } else if (this.state.status == "addingTransition") {

            if (this.state.selected1 == null) {
                editorDetail = (<div>
                    Select the source state for the new transition.
                    <div>
                        <input type="button" value="Cancel" onClick={this.cancelAdd} />
                    </div>
                </div>);
            } else if (this.state.selected1 != null && this.state.selected2 == null) {
                editorDetail = (<div>
                    Select the destination state for the new transition.
                    <div>
                        <input type="button" value="Cancel" onClick={this.cancelAdd} />
                    </div>
                </div>);
            }
        } else if (this.state.status == "state") {
            let selectedRendering = this.props.parent.state.editing as any;
            let selectedState = selectedRendering.renderingOf as AutomatonStateRendering;
            editorDetail = <StateEditor parent={this} selected={selectedState} />;
        } else if (this.state.status == "transition") {
            let selectedRendering = this.props.parent.state.editing as any;
            let selected = selectedRendering.renderingOf as TransitionRendering;
            editorDetail = <TransitionEditor parent={this} selected={selected} />;
        } else {
            editorDetail = (<div>bad state {this.state.status}</div>);
        }
        return (
            <div className="editors">
                <div id="addAutomata" className="editorToolBar">
                    <input type="button" value="+State" onClick={this.addState} />
                    <input type="button" value="+Transition" onClick={this.addTransition}
                        disabled={/*this.automaton.states.length > 0*/false} />
                    <input type="button" value="Test" onClick={this.startTest}
                        disabled={/*this.automaton.states.length > 0*/true} />
                </div>
                {editorDetail}
            </div>
        );
    }

    addState() {
        this.setState(
            {
                status: "addingState",
                selected1: null,
                selected2: null,
            }
        );
        this.parent.setState({
            clicked: null,
        });
    }

    addTransition() {
        console.log("addTransition");
        this.props.parent.setState({
            editing: null,
        });
        this.setState(
            {
                status: "addingTransition",
                selected1: null,
                selected2: null,
            }
        );
    }

    cancelAdd() {
        this.setState(
            {
                status: "new",
                selected1: null,
                selected2: null,
            }
        );
    }

    startTest() {

    }

    selected(item: fabric.Object) {
        let itemObj = item as any;
        if (itemObj.type == "State") {
            if (this.state.status == "addingTransition") {
                if (this.state.selected1 == null) {
                    this.setState({
                        selected1: item,
                    });
                } else {
                    this.setState({
                        selected2: item,
                        status: "transition",
                    });
                }
            } else {
                this.setState(
                    {
                        status: "state",
                    }
                );
                this.props.parent.setState({
                    editing: itemObj,
                });
            }
        } else if (itemObj.type == "Transition") {
            this.setState(
                {
                    status: "transition",
                    //editing: itemO.renderingOf,
                }
            );
        }
    }

    clicked(x: number, y: number) {
        if (this.state.status == "addingState") {
            let automaton = this.parent.rendering as AutomatonRendering;
            let newState = automaton.addState(x, y);
            console.log("+set state click:")
            this.setState(
                {
                    status: "state",
                    //editing: newState,
                    selected1: null,
                    selected2: null,
                }
            );
            console.log("-set state click:");
        }
    }


}

