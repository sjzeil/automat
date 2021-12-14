import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
import { AutomatonEngine } from './automatonEngine';
import { TestResult, ValidationResult } from './formalLanguage';




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
                        if (transition.match(/^.*;.*;.*$/)) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": should have only one ';'"
                            };
                        }
                        let semicolonPos = transition.indexOf(';');
                        if (semicolonPos < 0) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": does not have input and stack output separated by ';'"
                            };
                        }
                        let inputPart = transition.substring(0, semicolonPos);
                        let outputPart = transition.substring(semicolonPos+1);
                        if (!outputPart.match(/^[0-1A-Za-z@~]*$/)) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": illegal character in stack output"
                            };
                        }

                        let commaPos = inputPart.indexOf(',');
                        if (commaPos < 0) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": needs a ',' separating the input and stack top"
                            };
                        }
                        let input = inputPart.substring(0, commaPos);
                        let stackTop = inputPart.substring(commaPos+1);
                        if (!input.match(/^([A-Ya-z0-9@~])|()$/)) {

                        }
                        if (!input.match(/[0-9A-Ya-z@~](,[0-9A-Ya-z@~])*(}[A-Ya-z])?/)) {
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition + ": invalid input description"
                            };
                        }
                        if (!stackTop.match(/[0-9A-Za-z](,[0-9A-Za-z])*(}[A-Za-z])?/)) {
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
        if (transition.length > 2 && transition.charAt(transition.length-2) == '}') {
            storage = transition.substr(transition.length-2);
            result = transition.substr(0, transition.length-2);
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
                if (transition.match(/^[0-9A-Za-z](,[0-9A-Za-z])*}[A-Za-z]$/)) {
                    let varName = transition.charAt(transition.length - 1);
                    let transitionTriggers = this.getTriggersFor(transition);
                    result[varName] = transitionTriggers;
                }
            }
        }
        return result;
    }

    private static charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

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
        return '@';
    }

    transitionText(): string {
        return 'Each arrow may represent one or more transitions.<br/>' +
            'Each transition will have the form <i>input,top;push</i> where ' +
            '<ul><li><i>input</i> must contain a single alphanumeric character (not "Z") or shortcut denoting an input.</li>' + 
            '<li><i>top</i> must contain a single alphanumeric character (may include "Z") or shortcut denoting a character to be ' +
            ' matched and popped from the top of the stack.</li>' + 
            '<li><i>push</i> contains a string of alphanumeric characters  (may include "Z") or ~ denoting characters to be ' +
            ' pushed onto the stack. (Characters are oushed in the reverse order of presentation in the string.)</li>' + 
            '</ul>Shortcuts are also available:' +
            ' <ul><li>!x means "every character except x",</li>' +
            '<li>~ means "any character" when occuring in the <i>input</i>, and "same as the input character" in the <i>push</i> string.' +
            ' In the <i>top</li> string, ~ means "same as the input" if ~ appeared in the input, of "any character" ' +
            ' if ~ did not appear inthe input.</li> ' +
            '<li>a,b,c}w means that any of the characters to the left of the "}" can be accepted, but will be stored ' +
            'in a "variable" named "w".</li></ul>'
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
                let description = snapshot.selectedStates.get(arrow.from);
                if (typeof description === typeof '') {
                    let transitions = arrow.label.split('\n');
                    for (let transition of transitions) {
                        if (transition == '@') {
                            if (typeof snapshot.selectedStates.get(arrow.to) === typeof undefined) {
                                snapshot.selectedStates.set(arrow.to, description as string);
                                changed = true;
                                break;
                            }
                        }
                    }
                    if (changed) {
                        break;
                    }
                }
            }
        }
    }


    step(au: Automaton, current: Snapshot): Snapshot {
        let next = new Snapshot(current.input as string);
        next.variables = current.variables;
        next.numCharsProcessed = current.numCharsProcessed + 1;
        let processed = (current.input as string).substr(0, next.numCharsProcessed);
        let trigger = current.input?.substr(current.numCharsProcessed, 1) as string;
        for (let arrow of au.transitions) {
            let description = current.selectedStates.get(arrow.from);
            if (typeof description === typeof '') {
                let transitions = arrow.label.split('\n');
                for (let transition of transitions) {
                    transition = this.replaceVariablesIn(transition, current.variables);
                    let follow = false;
                    if (transition.length == 1) {
                        follow = (transition == trigger) || (transition == '~');
                    } else if (transition.length == 2 && transition.charAt(0) == '!')  {
                        let notChar = transition.charAt(1);
                        follow = (notChar != trigger);
                    } else if (transition.length > 2) {
                        let acceptabletriggers = this.getTriggersFor(transition);
                        if (acceptabletriggers.indexOf(trigger) >= 0) {
                            follow = true;
                            if (transition.charAt(transition.length-2) == '}') {
                                next.variables[transition.charAt(transition.length-1)] = trigger;
                            }
                        }
                    }
                    if (follow) {
                        next.selectedStates.set(arrow.to, processed);
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
            current.numCharsProcessed >= current.input.length;
    }

    accepted(current: Snapshot): boolean {
        if (current.numCharsProcessed >= (current.input as string).length) {
            let inFinalState = false;
            current.selectedStates.forEach(function (value, currentState) {
                inFinalState = inFinalState || currentState.final;
            });
            return inFinalState;
        } else {
            return false;
        }
    }


}


