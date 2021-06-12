import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { AutomatonEditor } from './automatonEditor';
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

export class StateEditor extends React.Component<StateEditorProps, StateEditorState> {
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
            this.props.parent.setState({
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

