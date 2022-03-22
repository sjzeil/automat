import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
import { AutomatonEngine } from './automatonEngine';
import { TestResult, ValidationResult } from './formalLanguage';
import { AutomatonState } from './states';


interface PDATransition {
    input: string;
    top: string;
    push: string;
}

/**
 * PDAEngine
 * 
 * An engine for Pushdown Automata
 * 
 */
export
    class PDAEngine extends AutomatonEngine {
    constructor() {
        super("automatonPDA");
    }

    name(): string {
        return 'Pushdown Automaton';
    }

    canBeCheckedForEquivalence(): boolean {
        return false;  // TODO to change this later
    }


    equivalent(automaton: Automaton, automaton2: Automaton): boolean {
        return false;
    }


    test(sample: string, automaton: Automaton): TestResult {
        let snapshot = this.initialSnapshot(automaton, sample);
        while (!this.stopped(snapshot)) {
            snapshot = this.step(automaton, snapshot);
        }
        return new TestResult(this.accepted(snapshot), "");
    }

    validate(automaton: Automaton): ValidationResult {
        if (automaton.states.length == 0) {
            return {
                warnings: '',
                errors: 'The automaton must have at least one state.'
            }
        }
        let initialStates = 0;
        let finalStates = 0;
        for (let state of automaton.states) {
            if (state.initial) {
                ++initialStates;
            }
            if (state.final) {
                ++finalStates;
            }
        }
        if (initialStates != 1) {
            return {
                warnings: '',
                errors: 'An automaton must have (exactly) one initial state.'
            }
        }
        let warningStr = '';
        let errorStr = '';
        if (finalStates == 0) {
            warningStr = 'Warning: no final states.'
        }

        let variableMapping = this.collectVariables(automaton);
        for (let state of automaton.states) {
            let transitionsSeen = new Set<string>();
            for (let arrow of automaton.transitions) {
                if (arrow.from == state) {
                    let transitions = arrow.label.split('\n');
                    if (transitions.length == 0) {
                        return {
                            warnings: warningStr,
                            errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                ' has no transitions.'
                        }
                    }
                    let transitionsInThisArrow = new Set<string>();
                    for (let transition of transitions) {
                        if (transition.match(/^.*\/.*\/.*$/)) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": should have only one '/'"
                            };
                        }
                        let slashPos = transition.indexOf('/');
                        if (slashPos < 0) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": does not have input and stack output separated by '/'"
                            };
                        }
                        let inputPart = transition.substring(0, slashPos);
                        let outputPart = transition.substring(slashPos + 1);
                        if (!outputPart.match(/^[0-9A-Za-z@~()\[\]=]*$/)) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": illegal character in stack output"
                            };
                        }

                        let commaPos = inputPart.lastIndexOf(',');
                        if (commaPos < 0) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": needs a ',' separating the input and stack top"
                            };
                        }
                        let input = inputPart.substring(0, commaPos);
                        let stackTop = inputPart.substring(commaPos + 1);
                        if ((!input.match(/^[0-9A-Ya-z@~()\[\]=]$/)) &&
                            (!input.match(/^![0-9A-Ya-z()\[\]=]$/))
                           ) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": invalid input description"
                            };
                        }
                        if ((!stackTop.match(/^[0-9A-Za-z@~()\[\]=]$/)) &&
                            (!stackTop.match(/^![0-9A-Za-z()\[\]=]$/))
                           ) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": invalid top of stack description"
                            };
                        }
                    }
                }
            }
        }


        return {
            warnings: warningStr,
            errors: errorStr
        };
    }

    replaceVariablesIn(transition: string, variableMapping: any): string {
        let storage = '';
        let result = transition;
        if (transition.length > 2 && transition.charAt(transition.length - 2) == '}') {
            storage = transition.substring(transition.length - 2);
            result = transition.substring(0, transition.length - 2);
        }
        for (let property in variableMapping) {
            let re = new RegExp(property, 'g');
            result = result.replace(re, variableMapping[property]);
        }
        return result + storage;
    }

    private collectVariables(automaton: Automaton): any {
        let result = {} as any;
        for (let arrow of automaton.transitions) {
            let transitions = arrow.label.split('\n');
            for (let transition of transitions) {
                if (transition.match(/^[0-9A-Za-z()\[\]=](,[0-9A-Za-z()\[\]=])*}[A-Za-z()\[\]=]$/)) {
                    let varName = transition.charAt(transition.length - 1);
                    let transitionTriggers = this.getTriggersFor(transition);
                    result[varName] = transitionTriggers;
                }
            }
        }
        return result;
    }

    private static charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz()[]=';

    private getTriggersFor(transition: string): string {
        if (transition.length == 1) {
            if (transition == '~') {
                return PDAEngine.charSet;
            } else {
                return transition;
            }
        } else if (transition.length == 2 && transition.charAt(0) == '!') {
            let result = PDAEngine.charSet.replace(transition.charAt(1), '');
            return result;
        } else if (transition.length > 2) {
            let k = transition.indexOf('}');
            if (k >= 0) {
                transition = transition.substring(0, k);
            }
            let result = '';
            for (let i = 0; i < transition.length; ++i) {
                if (transition.charAt(i) != ',') {
                    result += transition.charAt(i);
                }
            }
            return result;
        }
        return '';
    }

    startingTransition(): string {
        return '@,@/@';
    }

    transitionText(): string {
        return 'Each arrow may represent one or more transitions.<br/>' +
            'Each transition will have the form <i>input,top/push</i> where ' +
            '<ul><li><i>input</i> must contain a single alphanumeric character (not "Z"), a left or right parenthesis or bracket or an equal sign, @, or shortcut denoting an input.</li>' +
            '<li><i>top</i> must contain a single alphanumeric character (may include "Z"), a left or right parenthesis or bracket or an equal sign, @, or a shortcut denoting a character to be ' +
            ' matched and popped from the top of the stack.</li>' +
            '<li><i>push</i> contains a <i>string</i> of any of the characters allowed in the <i>top</i> position or @ denoting characters to be ' +
            ' pushed onto the stack. (Characters are pushed in the reverse order of presentation in the string.)</li>' +
            '</ul>Shortcuts are also available:' +
            ' <ul><li>!x, in the <i>input</i> or <i>top</i>, means "any character except x",</li>' +
            '<li>~ means "any character" when occurring in the <i>input</i>, and "same as the input character" in <i>top</i> or the <i>push</i> string.' +
            '</ul>'
    }

    initialSnapshot(au: Automaton, input: string): Snapshot {
        let snapshot = new Snapshot(input);
        for (let state of au.states) {
            if (state.initial) {
                snapshot.selectedStates.set(state, 'Z');
            }
        }
        this.computeEpsilonClosure(au, snapshot);
        return snapshot;
    }

    private computeEpsilonClosure(au: Automaton, snapshot: Snapshot) {
        let changed = true;
        while (changed) {
            changed = false;
            for (let arrow of au.transitions) {
                if (snapshot.isSelected(arrow.from)) {
                    let stacks = snapshot.getDescription(arrow.from);
                    for (let inStack of stacks) {
                        let transitions = arrow.label.split('\n');
                        for (let transitionDesc of transitions) {
                            let transition = this.parseTransition(transitionDesc);
                            if (transition.input == '@' && this.stackMatches(null, inStack, transition.top)) {
                                let outStack = this.updateStack(null, inStack, transition.top, transition.push, snapshot);
                                changed = this.addStackTo(outStack, snapshot, arrow.to) || changed;
                            }
                        }
                    }
                }
            }
        }
    }

    addStackTo(stack: string, snapshot: Snapshot, state: AutomatonState): boolean {
        let stacks = snapshot.getDescription(state);
        let found = false;
        for (let stack0 of stacks) {
            found = (stack == stack0);
            if (found) break;
        }
        if (found)
            return false;
        if (stacks.length == 0) {
            snapshot.selectedStates.set(state, stack);
        } else {
            stacks.push(stack);
            stacks.sort();
            snapshot.selectedStates.set(state, stacks.join('\n'));
        }
        return true;
    }

    stackMatches(inChar: string | null, inStack: string, top: string): boolean {
        if (top == '@')
            return true;
        if (inStack == '')
            return false; // should probably never happen
        if (top == '~' && inChar != null)
            return true;
        if (top.charAt(0) == '!') {
            if (top.substring(1) != inStack.substring(0,1))
                return true;
        }
        return (top == inStack.substring(0,1));
    }

    updateStack(inChar: string | null, inStack: string, top: string, push: string, snapshot: Snapshot): string {
        let output = ''; 
        if (top == '@') {
            output = inStack;
        } else {
            output = inStack.substring(1);
        }
        if (push == '@')
            return output;
        let push2 = push;
        if (inChar != null) {
            push2 = push.replace(/~/g, inChar);
        }
        push2 = this.replaceVariablesIn(push2, snapshot.variables);
        output = push2 + output;
        return output;
    }



    parseTransition(transitionDesc: string): PDATransition {
        let slashPos = transitionDesc.indexOf('/');
        if (slashPos < 0) {
            throw "malformed transition: " + transitionDesc;
        }
        let inputPart = transitionDesc.substring(0, slashPos);
        let outputPart = transitionDesc.substring(slashPos + 1);

        let commaPos = inputPart.lastIndexOf(',');
        if (commaPos < 0) {
            throw "malformed transition: " + transitionDesc;
        }
        let input = inputPart.substring(0, commaPos);
        let stackTop = inputPart.substring(commaPos + 1);
        return {
            input: input,
            top: stackTop,
            push: outputPart
        };
    }


    step(au: Automaton, current: Snapshot): Snapshot {
        let next = new Snapshot(current.input[0]);
        next.variables = current.variables;
        next.numCharsProcessed[0] = current.numCharsProcessed[0] + 1;
        let processed = (current.input[0]).substring(0, next.numCharsProcessed[0]);
        let trigger = current.input[0].substring(current.numCharsProcessed[0], current.numCharsProcessed[0] + 1);
        for (let arrow of au.transitions) {
            if (current.isSelected(arrow.from)) {
                let stacks = current.getDescription(arrow.from);
                for (let inStack of stacks) {
                    let transitions = arrow.label.split('\n');
                    for (let transitionDesc of transitions) {
                        let transition = this.parseTransition(transitionDesc);
                        transition.input = this.replaceVariablesIn(transition.input, current.variables);

                        let follow = false;
                        if (transition.input.length == 1) {
                            follow = (transition.input == trigger) || (transition.input == '~');
                        } else if (transition.input.length == 2 && transition.input.charAt(0) == '!') {
                            let notChar = transition.input.charAt(1);
                            follow = (notChar != trigger);
                        }
                        if (follow && this.stackMatches(trigger, inStack, transition.top)) {
                            let outStack = this.updateStack(trigger, inStack, transition.top, transition.push, next);
                            this.addStackTo(outStack, next, arrow.to);
                        }
                    }
                }
            }
        }
        this.computeEpsilonClosure(au, next);
        return next;
    }

    stopped(current: Snapshot): boolean {
        return current.selectedStates.size == 0 ||
            current.input == null ||
            current.numCharsProcessed[0] >= current.input[0].length;
    }

    accepted(current: Snapshot): boolean {
        if (current.numCharsProcessed[0] >= current.input[0].length) {
            let inFinalState = false;
            current.selectedStates.forEach(function (value, currentState) {
                inFinalState = inFinalState || currentState.final;
            });
            return inFinalState;
        } else {
            return false;
        }
    }

    inputPortrayal(snapshot: Snapshot): string {
        if (snapshot.input != null) {
            let leftPart = snapshot.input[0].substring(0, snapshot.numCharsProcessed[0]);
            let rightPart = snapshot.input[0].substring(snapshot.numCharsProcessed[0]);
            return leftPart + '|' + rightPart;
        } else {
            return '';
        }
    }


}


