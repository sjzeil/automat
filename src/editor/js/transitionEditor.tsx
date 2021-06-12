import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Automaton } from '../../shared/js/automaton';
import { AutomatonState } from '../../shared/js/states';
import { AutomatonTransition } from '../../shared/js/transitions';
import { StateEditor } from './stateEditor';
import { fabric } from 'fabric';
import { AutomatonEditor } from './automatonEditor';



interface TransitionEditorProps {
    parent: AutomatonEditor;
    selected: AutomatonTransition;
}

interface TransitionEditorState {
    selected: AutomatonTransition;
    label: string;
    selectedOption: number;
}

interface optionListItem {
    id: number;
    value: string;
}



export class TransitionEditor extends React.Component<TransitionEditorProps, TransitionEditorState> {
    constructor(props: TransitionEditorProps) {
        super(props);
        console.log("TransitionEditor constructed");

        this.state = (
            {
                selected: props.selected,
                label: props.selected.label,
                selectedOption: 0,
            }
        );

        this.handleChange = this.handleChange.bind(this);
        this.labelChanged = this.labelChanged.bind(this);
        this.apply = this.apply.bind(this);
        this.fill = this.fill.bind(this);
    }


    componentDidMount() {
        console.log("TransitionEditor mounted");
    }

    componentDidUpdate() {
        console.log("TransitionEditor updated");
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
                //initial: state.initial,
                //final: state.final,
            });
        }
    }

    componentWillUnmount() {
        console.log("TransitionEditor unmounted");
    }

    handleChange(event: any) {
        console.log("in event handler");
    }

    labelChanged(newLabel: string) {
        this.setState({
            label: newLabel,
        });
    }


    render() {
        console.log("TransitionEditor rendering");
        
        let transitionsText = this.state.label.split("\n");
        let keyedTransitions: optionListItem[] = [];
        transitionsText.forEach((transitionLabel) => keyedTransitions.push({id: keyedTransitions.length, value: transitionLabel}));
        let optionSet = (<React.Fragment>
            {
                keyedTransitions.map((item) => (
                    <option key={"transition" + item.id} value={"transition" + item.id} 
                        >{item.value}</option>
                ))
            }
        </React.Fragment>);
        return (
            <div id="transitionEditor" className="editors">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <span>Transition:</span>
                                <input type="text" id="transition_label" name="transition_label" 
                                    onChange={this.handleChange}
                                    value={(this.state.selectedOption >= 0 && this.state.selectedOption < transitionsText.length) 
                                             ? transitionsText[this.state.selectedOption]: ""}
                                    />
                            </td>
                            <td>
                                <select id="transition_selection" size={4} onChange={this.selectedTransitionOption}
                                    value={"transition" + this.state.selectedOption}>
                                    {optionSet}
                                </select>
                            </td>
                            <td>
                                <input type="button" value="Add" id="add_transition_label" 
                                    onClick={this.addTransitionOption} /><br />
                                <input type="button" value="Replace" id="edit_transition_label" 
                                    onClick={this.replaceTransitionOption} /><br />
                                <input type="button" value="Remove" id="remove_transition_label" 
                                    onClick={this.removeTransitionOption} /><br />
                                <input type="button" value="Up" id="up_transition_label" 
                                    onClick={this.upTransitionOption} /><br />
                                <input type="button" value="Down" id="down_transition_label" 
                                    onClick={this.downTransitionOption} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <input type="button" value="Apply" onClick={this.apply} />
                    <input type="button" value="Cancel" onClick={this.fill} />
                </div>
            </div>
        );
    }

    selectedTransitionOption() {
        console.log("selected a transition");
        debugger;
    }

    addTransitionOption() {

    }

    replaceTransitionOption() {

    }

    removeTransitionOption() {

    }

    upTransitionOption() {

    }

    downTransitionOption() {

    }

    apply() {
        /*
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
        */
    }

    fill() {
        /*
        let state = this.props.selected;
        this.setState({
            label: state.label,
            initial: state.initial,
            final: state.final,
        });
        */
    }


}

