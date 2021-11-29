import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { Automaton } from '../../../formalLangLib/src/js/automaton';
import { AutomatonState } from '../../../formalLangLib/src/js/states';
import { AutomatonTransition } from '../../../formalLangLib/src/js/transitions';
import { StateEditor } from './stateEditor';
import { fabric } from 'fabric';
import { AutomatonEditor } from './automatonEditor';
import { TransitionRendering} from './renderings/renderedTransitions';
import { AutomatonRendering } from './renderings/renderedAutomaton';



interface TransitionEditorProps {
    parent: AutomatonEditor;
    selected: TransitionRendering;
}

interface TransitionEditorState {
    selected: TransitionRendering;
    workingLabel: string;
    label: string;
    selectedOption: number;
    partialLabel: string;
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
                workingLabel: props.selected.label,
                label: props.selected.label,
                selectedOption: 0,
                partialLabel: "",
            }
        );

        this.handleChange = this.handleChange.bind(this);
        this.labelChanged = this.labelChanged.bind(this);
        this.addTransitionOption = this.addTransitionOption.bind(this);
        this.replaceTransitionOption = this.replaceTransitionOption.bind(this);
        this.selectedTransitionOption = this.selectedTransitionOption.bind(this);
        this.upTransitionOption = this.upTransitionOption.bind(this);
        this.downTransitionOption = this.downTransitionOption.bind(this);
        this.removeTransitionOption = this.removeTransitionOption.bind(this);
        this.delete = this.delete.bind(this);
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
            let transition = this.props.selected;
            this.setState({
                workingLabel: transition.label,
                label: transition.label,
                selectedOption: 0,
                partialLabel: "",
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
        this.setState ({
            partialLabel: newLabel,
        });
    }


    render() {
        console.log("TransitionEditor rendering");
        
        let transitionsText = this.state.workingLabel.split("\n");
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
                <div>From {this.state.selected.from.label} to {this.state.selected.to.label}...</div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <span>Transition:</span>
                                <input type="text" id="transition_label" name="transition_label" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.labelChanged(ev.target.value)}
                                    value={this.state.partialLabel}
                                    />
                            </td>
                            <td>
                                <select id="transition_selection" size={4} 
                                    onChange={this.selectedTransitionOption}
                                    //onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.selectedTransitionOption(ev.target.value)}
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
                    <input type="button" value="Delete" onClick={this.delete} />
                    <input type="button" value="Cancel" onClick={this.fill} />
                </div>
            </div>
        );
    }

    selectedTransitionOption(event: any) {
        let target = event.target;
        let selectedNum: number;
        let transitionsText = this.state.workingLabel.split("\n");
        for (selectedNum = 0; selectedNum < target.length; ++selectedNum)
        {
            if (target[selectedNum].selected) {
                this.setState ({
                    selectedOption: selectedNum,
                    partialLabel: transitionsText[selectedNum],
                });
                break;
            }
        }
    }

    addTransitionOption() {
        let transition = this.props.selected;
        let transitionsText = this.state.label.split("\n");
        transition.label = this.state.label + "\n" + this.state.partialLabel;
        this.setState ({
            label: transition.label,
            workingLabel: transition.label,
        });
    }

    replaceTransitionOption() {
        let transition = this.props.selected;
        let transitionsText = this.state.label.split("\n");
        if (this.state.selectedOption >= 0 && this.state.selectedOption <= transitionsText.length) {
            transitionsText[this.state.selectedOption] = this.state.partialLabel;
            transition.label = transitionsText.join("\n");
            this.setState ({
                label: transition.label,
                workingLabel: transition.label,
            });
        }
    }

    removeTransitionOption() {
        let transition = this.props.selected;
        let transitionsText = this.state.label.split("\n");
        if (transitionsText.length > 1 && this.state.selectedOption >= 0 && this.state.selectedOption < transitionsText.length) {
            transitionsText.splice(this.state.selectedOption, 1);
            transition.label = transitionsText.join("\n");
            this.setState ({
                label: transition.label,
                workingLabel: transition.label,
            });
        }
    }

    downTransitionOption() {
        let transition = this.props.selected;
        let transitionsText = this.state.label.split("\n");
        if (transitionsText.length > 1 && this.state.selectedOption < transitionsText.length - 1) {
            let temp = transitionsText[this.state.selectedOption];
            transitionsText[this.state.selectedOption] = transitionsText[this.state.selectedOption+1];
            transitionsText[this.state.selectedOption+1] = temp;
            transition.label = transitionsText.join("\n");
            this.setState ({
                label: transition.label,
                workingLabel: transition.label,
            });
        }
    }

    upTransitionOption() {
        let transition = this.props.selected;
        let transitionsText = this.state.label.split("\n");
        if (transitionsText.length > 1 && this.state.selectedOption > 0) {
            let temp = transitionsText[this.state.selectedOption];
            transitionsText[this.state.selectedOption] = transitionsText[this.state.selectedOption-1];
            transitionsText[this.state.selectedOption-1] = temp;
            transition.label = transitionsText.join("\n");
            this.setState ({
                label: transition.label,
                workingLabel: transition.label,
            });
        }

    }

    delete() {
        let transition = this.props.selected;
        let automaton = this.props.parent.parent.rendering as AutomatonRendering;
        automaton.removeTransition(transition);
        this.props.parent.setState({
            status: "new",
        });
        this.props.parent.parent.setState({
            editing: null,
        });
    }

    fill() {
        let transition = this.props.selected;
        this.setState({
            label: transition.label,
            workingLabel: transition.label,
        });
    }


}

