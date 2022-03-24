import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Automaton } from '../../../formalLangLib/src/js/automaton';
import { AutomatonEngine } from '../../../formalLangLib/src/js/automatonEngine';
import { FAEngine } from '../../../formalLangLib/src/js/FAEngine';
import { AutomatonState } from '../../../formalLangLib/src/js/states';
import { AutomatonTransition } from '../../../formalLangLib/src/js/transitions';
import { StateEditor } from './stateEditor';
import { TransitionEditor } from './transitionEditor';
import { fabric } from 'fabric';
import { LanguageRendering } from './renderings/renderedLanguage';
import { AutomatonRendering } from './renderings/renderedAutomaton';
import { AutomatonStateRendering } from './renderings/stateRendering';
import { TransitionRendering } from './renderings/renderedTransitions';
import { Snapshot } from '../../../formalLangLib/src/js/snapshot';




interface AutomatonEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: LanguageRendering;
}

interface AutomatonEditorState {
    status: string;
    selected1: fabric.Object | null;
    selected2: fabric.Object | null;
    testInput: string;
    testResult: string;
    snapshot: Snapshot | null;
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
            testInput: '',
            testResult: '',
            snapshot: null,
        };
        this.parent = props.parent;
        this.addState = this.addState.bind(this);
        this.addTransition = this.addTransition.bind(this);
        this.startTest = this.startTest.bind(this);
        this.clicked = this.clicked.bind(this);
        this.selected = this.selected.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.testInputChanged = this.testInputChanged.bind(this);
        this.startTest = this.startTest.bind(this);
        this.stepTest = this.stepTest.bind(this);
        this.finishTest = this.finishTest.bind(this);
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
                    snapshot: null,
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
                let automaton = a.language as Automaton;
                let loc = this.props.parent.state.clicked as MouseLoc;
                let sourceState = this.state.selected1 as any;
                let destState = this.props.parent.state.editing as any;
                let newTransition = a.addTransition(sourceState.label, destState.label, automaton.engine.startingTransition());
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
                    snapshot: null,
                });
            }
        } else if (this.state.status == "transition") {
            console.log("updated Automaton editor in transition mode");
            let selectedItem = this.props.parent.state.editing;
            if (selectedItem != null && selectedItem.type == "State") {
                this.setState({
                    status: "state",
                    snapshot: null,
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
                    snapshot: null,
                });
            } else if (selectedItem != null && selectedItem.type == "Transition") {
                this.setState({
                    status: "transition",
                    snapshot: null,
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
        let a = this.props.parent.rendering as AutomatonRendering;
        let automaton = a.language as Automaton;
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
        let validation = this.props.language.language.validate();
        let processedInput = '';
        a.clearDecorations();
        let testResult = (<span></span>);
        if (this.state.snapshot != null) {
            processedInput = automaton.engine.inputPortrayal(this.state.snapshot);
            processedInput = processedInput.replaceAll('\n', '<br/>');
            processedInput = processedInput.replaceAll('@', FormalLanguage.epsilon);
            a.decorateStates(this.state.snapshot);
            if (automaton.engine.stopped(this.state.snapshot)) {
                if (automaton.engine.accepted(this.state.snapshot)) {
                    testResult = (<span className='accepted'>Accepted</span>);
                } else {
                    testResult = (<span className='rejected'>Rejected</span>);
                }
            }
        }
        return (
            <div className="editors">
                <div id="addAutomata" className="editorToolBar">
                    <h3>{automaton.engine.name()}</h3>
                    <div>
                        <input type="button" value="+State" onClick={this.addState} />
                        <span> </span>
                        <input type="button" value="+Transition" onClick={this.addTransition}
                            disabled={/*this.automaton.states.length > 0*/false} />
                    </div>
                </div>
                {editorDetail}
                <div className="testing">
                    <h3>Testing</h3>
                    <div>
                        Input text:
                        <input type="text" id="regexp_text_in" name="regexp_text_in"
                            onChange={(ev: React.ChangeEvent<HTMLInputElement>):
                                void => this.testInputChanged(ev.target.value)}
                            value={this.state.testInput}
                            className="regexpIn"
                            maxLength={100}
                        />
                        {testResult}
                    </div>
                    <div className='testInput'
                       dangerouslySetInnerHTML={{__html: processedInput} }>
                    </div>
                    <div>
                        <input type="button" value="Start" onClick={this.startTest}
                            disabled={validation.errors != ''} />
                        <span> </span>
                        <input type="button" value="Step" onClick={this.stepTest}
                            disabled={this.state.snapshot == null || automaton.engine.stopped(this.state.snapshot)} />
                        <span> </span>
                        <input type="button" value="Finish" onClick={this.finishTest}
                            disabled={this.state.snapshot == null || automaton.engine.stopped(this.state.snapshot)} />
                        <span> </span>
                        <span className="testResult">
                            {this.state.testResult }</span>
                    </div>
                </div>
                <div className="warnings">
                    {validation.warnings}
                </div>
                <div className="errors">
                    {validation.errors}
                </div>
            </div>
        );
    }

    addState() {
        this.setState(
            {
                status: "addingState",
                selected1: null,
                selected2: null,
                snapshot: null,
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
                snapshot: null,
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
        let faRendered = this.props.language as AutomatonRendering;
        let fa = faRendered.language as Automaton;
        let snapshot0 = fa.engine.initialSnapshot(fa, this.state.testInput);
        this.setState({
            snapshot: snapshot0,
            status: 'new'
        });
        this.parent.setState ({
            editing: null,
        });
    }

    stepTest() {
        let faRendered = this.props.language as AutomatonRendering;
        let fa = faRendered.language as Automaton;
        if (this.state.snapshot != null) {
            let snapshot0 = fa.engine.step(fa, this.state.snapshot);
            this.setState({
                snapshot: snapshot0
            });
        }
    }

    finishTest() {
        let faRendered = this.props.language as AutomatonRendering;
        let fa = faRendered.language as Automaton;
        if (this.state.snapshot != null) {
            let snapshot0 = this.state.snapshot;
            while (!fa.engine.stopped(snapshot0)) {
                snapshot0 = fa.engine.step(fa, snapshot0);
            }
            this.setState({
                snapshot: snapshot0
            });
        }
        //TODO
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
                        snapshot: null,
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
                    snapshot: null,
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
                    selected1: null,
                    selected2: null,
                }
            );
            console.log("-set state click:");
        }
    }

    testInputChanged(newInput: string) {
        this.setState({
            testInput: newInput,
        });
    }

    clearTest() {
        this.setState({
            snapshot: null,
        });
    }


}

