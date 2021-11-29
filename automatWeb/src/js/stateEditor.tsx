import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { AutomatonEditor } from './automatonEditor';
import { Automaton } from '../../../formalLangLib/src/js/automaton';
import { AutomatonState } from '../../../formalLangLib/src/js/states';
import { AutomatonStateRendering } from './renderings/stateRendering';
import { AutomatonTransition } from '../../../formalLangLib/src/js/transitions';
import { fabric } from 'fabric';
import { AutomatonRendering } from './renderings/renderedAutomaton';


interface StateEditorProps {
    parent: AutomatonEditor;
    selected: AutomatonStateRendering;
}

interface StateEditorState {
    selected: AutomatonStateRendering;
    workingLabel: string;
    label: string;
    initial: boolean;
    final: boolean;
}

export class StateEditor extends React.Component<StateEditorProps, StateEditorState> {
    constructor(props: StateEditorProps) {
        super(props);
        console.log("StateEditor constructed");

        this.state = (
            {
                selected: props.selected,
                workingLabel: props.selected.label,
                label: props.selected.label,
                initial: props.selected.initial,
                final: props.selected.final,
            }
        );

        this.labelChanged = this.labelChanged.bind(this);
        this.initialChanged = this.initialChanged.bind(this);
        this.finalChanged = this.finalChanged.bind(this);
        this.fill = this.fill.bind(this);
        this.deleteState = this.deleteState.bind(this);
    }


    componentDidMount() {
        console.log("StateEditor mounted");
    }

    componentDidUpdate() {
        console.log("StateEditor updated");
        let selectedElement = this.props.parent.props.parent.state.editing;

        if (selectedElement == null) {
            this.props.parent.setState({
                status: "new",
            });
        } else {
            let selectedElement0 = selectedElement as any;
            let selectedRender = selectedElement0.renderingOf as AutomatonStateRendering;
            if (this.state.selected != selectedRender) {
                debugger;
                this.setState({
                    selected: selectedRender,
                    workingLabel: selectedRender.label,
                    label: selectedRender.label,
                    initial: selectedRender.initial,
                    final: selectedRender.final,
                });
            }

        }
    }

    componentWillUnmount() {
        console.log("StateEditor unmounted");
    }

    handleChange(event: any) {
        console.log("in event handler");
    }

    labelChanged(newLabel: string) {
        let state = this.props.selected;
        state.label = newLabel;
        this.setState({
            label: newLabel,
            workingLabel: newLabel,
        });
    }

    initialChanged(checked: boolean) {
        let state = this.props.selected;
        if (state.initial == this.state.initial) {
            state.initial = !this.state.initial;
        }
        this.setState({
            initial: checked,
        });
        this.props.parent.clearTest();
    }

    finalChanged(checked: boolean) {
        let state = this.props.selected;
        if (state.final == this.state.final) {
            state.final = !this.state.final;
        }
        this.setState({
            final: checked,
        });
        this.props.parent.clearTest();
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
                                <input type="text" id="state_label" value={this.state.workingLabel}
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
                    <input type="button" value="Delete" onClick={this.deleteState} />
                </div>
            </div>
        );
    }




    fill() {
        let state = this.props.selected;
        this.setState({
            workingLabel: state.label,
            label: state.label,
            initial: state.initial,
            final: state.final,
        });
    }

    deleteState() {
        let state = this.props.selected;
        let automaton = this.props.parent.parent.rendering as AutomatonRendering;
        debugger;
        automaton.removeState(state);
        this.props.parent.setState({
            status: "new",
        });
        this.props.parent.parent.setState({
            editing: null,
            clicked: null,
            status: "automaton",
        });
    }

}

