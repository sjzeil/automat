import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
import { AutomatonEngine } from './automatonEngine';
import { FormalLanguage, TestResult, ValidationResult } from './formalLanguage';




/**
 * FAEngine
 * 
 * An engine for Turing machines
 * 
 */
export
    class TMEngine extends AutomatonEngine {
    constructor() {
        super("automatonTM");
    }

    static executionLimit: number = 10000;

    name(): string {
        return 'Turing Machine';
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

        let isDeterministic = true;
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
                        let transitionTriggers = this.getTriggersFor(transition);
                        transitionTriggers = this.replaceVariablesIn(transitionTriggers, variableMapping);
                        for (let i = 0; i < transitionTriggers.length; ++i) {
                            let trigger = transitionTriggers.charAt(i);

                            if (transitionsInThisArrow.has(trigger)) {
                                return {
                                    warnings: '',
                                    errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                        ' has duplicate transitions on ' + trigger + '.'
                                }
                            }
                            transitionsInThisArrow.add(trigger);
                            if (trigger == '@' || transitionsSeen.has(trigger)) {
                                isDeterministic = false;
                            }
                            if (trigger != '@') {
                                transitionsSeen.add(trigger);
                            }
                        }
                        if (transition.length == 1) {
                            if (!transition.match(/^[@~0-9A-Za-z]$/)) {
                                return {
                                    warnings: warningStr,
                                    errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                        ' has an invalid transition: ' + transition
                                };
                            }
                        } else if (transition.length == 2) {
                            if (!transition.match(/^![0-9A-Za-z]$/)) {
                                return {
                                    warnings: warningStr,
                                    errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                        ' has an invalid transition: ' + transition
                                };
                            }
                        } else if (transition.length > 2) {
                            // Storage in the state limited to deterministic automata (TMs)
                            /*
                            if (!transition.match(/^[0-9A-Za-z](,[0-9A-Za-z])*(}[A-Za-z])?$/)) {
                                return {
                                    warnings: warningStr,
                                    errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                        ' has an invalid transition: ' + transition
                                };
                            }
                            */
                            return {
                                warnings: warningStr,
                                errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                    ' has an invalid transition: ' + transition
                            };
                        }
                    }
                }
            }
        }

        if (isDeterministic) {
            warningStr += "\nThis automaton is deterministic.";
        } else {
            warningStr += "\nThis automaton is nondeterministic.";
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
                return TMEngine.charSet;
            } else {
                return transition;
            }
        } else if (transition.length == 2 && transition.charAt(0) == '!') {
            let result = TMEngine.charSet.replace(transition.charAt(1), '');
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
        return '@/@,R';
    }

    transitionText(): string {
        return 'Each arrow may represent one or more transitions.<br/>' +
            'A transition has the form <i>input/output,direction</i>.<br/>'
            'For a single-tape TM,'
            '<ul><li>The input and the output must contain a single alphanumeric character or a shortcut denoting one character.</li>' +
            '<li>The direction must be "L", "R", or "S", denoting left, right, or stationary, respectively.</li>' +
            '</ul>' + 
            'Shortcuts:<ul>' +
            '<li>@ denotes the empty cell (' + FormalLanguage.box + ').</li>' +
            '<li>!x means "any character except x",</li>' +
            '<li>~ in the input means "any character". In hte output it means "same as the input character.</li>' +
            '<li>a,b,c}w in the inputs means accept any one character in the comma-separated list, storing the actual ' +
            ' matched character "in the state" in variable w.  All susbsequent uses of w will then retrieve the stored character.' +
            '</ul>';
    }

    initialSnapshot(au: Automaton, input: string): Snapshot {
        let snapshot = new Snapshot(input);
        for (let state of au.states) {
            if (state.initial) {
                snapshot.selectedStates.set(state, '');
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
                        let acceptableTriggers = this.getTriggersFor(transition);
                        if (acceptableTriggers.indexOf(trigger) >= 0) {
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


