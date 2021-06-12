import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Automaton } from '../../shared/js/automaton';
import { AutomatonState } from '../../shared/js/states';
import { AutomatonTransition } from '../../shared/js/transitions';
import { fabric } from 'fabric';


interface StateEditorProps {
    parent: AutomatonEditor;
    selected: AutomatonState;
}

interface StateEditorState {
    selected: AutomatonState;
    label: string;
    initial: boolean;
    final: boolean;
}

class StateEditor extends React.Component<StateEditorProps, StateEditorState> {
    constructor(props: StateEditorProps) {
        super(props);
        console.log("StateEditor constructed");

        this.state = (
            {
                selected: props.selected,
                label: props.selected.label,
                initial: props.selected.initial,
                final: props.selected.final,
            }
        );

        this.labelChanged = this.labelChanged.bind(this);
        this.initialChanged = this.initialChanged.bind(this);
        this.finalChanged = this.finalChanged.bind(this);
        this.apply = this.apply.bind(this);
        this.fill = this.fill.bind(this);
        this.deleteState = this.deleteState.bind(this);
    }


    componentDidMount() {
        console.log("StateEditor mounted");
    }

    componentDidUpdate() {
        console.log("StateEditor updated");
        let selectedElement = this.props.parent.props.parent.state.editing;
        console.dir(selectedElement);
        console.dir(this.props.selected.rendering);

        if (selectedElement == null) {
            this.props.parent.setState ({
                status: "new",
            });
        } else if (this.props.selected.label != this.state.label) {
            let state = this.props.selected;
            this.setState({
                label: state.label,
                initial: state.initial,
                final: state.final,
            });
        }
    }

    componentWillUnmount() {
        console.log("StateEditor unmounted");
    }

    handleChange(event: any) {
        console.log("in event handler");
    }

    labelChanged(newLabel: string) {
        this.setState({
            label: newLabel,
        });
    }

    initialChanged(checked: boolean) {
        this.setState({
            initial: checked,
        });
    }

    finalChanged(checked: boolean) {
        this.setState({
            final: checked,
        });
    }


    render() {
        console.log("StateEditor rendering");
        return (
            <div id="stateEditor" className="editors">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Label:
                            </td>
                            <td>
                                <input type="text" id="state_label" value={this.state.label}
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.labelChanged(ev.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Initial?
                            </td>
                            <td>
                                <input type="checkbox" id="stateIsInitial" name="stateIsInitial" checked={this.state.initial}
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.initialChanged(ev.target.checked)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Final?
                            </td>
                            <td>
                                <input type="checkbox" id="stateIsFinal" name="stateIsFinal" checked={this.state.final}
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.finalChanged(ev.target.checked)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <input type="button" value="Apply" onClick={this.apply} />
                    <input type="button" value="Cancel" onClick={this.fill} />
                    <input type="button" value="Delete" onClick={this.deleteState} />
                </div>
            </div>
        );
    }



    apply() {
        let state = this.props.selected;
        if (state.label != this.state.label) {
            state.label = this.state.label;
        }
        if (state.initial != this.state.initial) {
            state.initial = this.state.initial;
        }
        if (state.final != this.state.final) {
            state.final = this.state.final;
        }
    }

    fill() {
        let state = this.props.selected;
        this.setState({
            label: state.label,
            initial: state.initial,
            final: state.final,
        });
    }

    deleteState() {

    }

}

interface TransitionEditorProps {
    parent: AutomatonEditor;
    selected: AutomatonTransition;
}

interface TransitionEditorState {
    selected: AutomatonTransition;
    label: string;
    from: AutomatonState;
    to: AutomatonState;
}

class TransitionEditor extends React.Component<TransitionEditorProps, TransitionEditorState> {
    constructor(props: TransitionEditorProps) {
        super(props);
    }

    render() {
        return <span></span>;
    }
}


interface AutomatonEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: FormalLanguage;
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
        this.automaton = new Automaton(this.parent.props.canvas);
    }

    parent: FormalLanguageEditor;
    automaton: Automaton;

    componentDidMount() {
        console.log("AutomatonEditor mounted");
    }

    componentDidUpdate() {
        console.log("AutomatonEditor updated");
        if (this.state.status == "addingState" && this.props.parent.state.clicked != null) {
            let a = this.props.parent.language as Automaton;
            let loc = this.props.parent.state.clicked as MouseLoc;
            let newState = a.addState(loc.x, loc.y);
            this.parent.setState({
                clicked: null,
                editing: newState.rendering,
            });
            this.setState({
                status: "state",
            });
        } else if (this.state.status == "state") {
            console.log("updated Automaton editor in state mode");
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
        } else if (this.state.status == "state") {
            let selectedRendering = this.props.parent.state.editing as any;
            let selectedState = selectedRendering.renderingOf as AutomatonState;
            editorDetail = <StateEditor parent={this} selected={selectedState} />;
        } else if (this.state.status == "transition") {
            let selectedRendering = this.props.parent.state.editing as any;
            let selected = selectedRendering.renderingOf as AutomatonTransition;
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
        console.log("addState");
        console.dir(this.state);
        this.setState(
            {
                status: "addingState",
                selected1: null,
                selected2: null,
            }
        );
    }

    addTransition() {
        console.log("addTransition");
    }

    startTest() {

    }

    selected(item: fabric.Object) {
        let itemO = item as any;
        if (itemO.type == "State") {
            console.log("+set state 1:");
            this.setState(
                {
                    status: "state",
                    //editing: item,
                }
            );
            console.log("-set state 1:");
        } else if (itemO.type == "Transition") {
            console.log("+set state 2:");
            this.setState(
                {
                    status: "transition",
                    //editing: itemO.renderingOf,
                }
            );
            console.log("-set state 2:");
        }
    }

    clicked(x: number, y: number) {
        if (this.state.status == "addingState") {
            let newState = this.automaton.addState(x, y);
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

