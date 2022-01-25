import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
import { AutomatonEngine } from './automatonEngine';
import { FormalLanguage, TestResult, ValidationResult } from './formalLanguage';




/**
 * FAEngine
 * 
 * An engine for Finite Automata
 * 
 */
export
    class FAEngine extends AutomatonEngine {
    constructor() {
        super("automatonFA");
    }

    name(): string {
        return 'Finite Automaton';
    }

    canBeCheckedForEquivalence(): boolean {
        return true;
    }


    equivalent(fa1: Automaton, fa2: Automaton): boolean {
        if (fa2.specification != fa1.specification)
            return false;

        let alphabet = this.getAlphabet(fa1, {});
        alphabet = this.getAlphabet(fa2, alphabet);
        if (Object.keys(alphabet).length == 0)
            return true;

        let toBeProcessed = [];
        let seen = {} as any;  // set of strings
        let snap1 = this.initialSnapshot(fa1, '');
        let snap2 = this.initialSnapshot(fa2, '');
        seen[this.signatureOf(snap1, snap2)] = 1;
        if (this.inAcceptedState(snap1) != this.inAcceptedState(snap2))
            return false;
        for (let input of Object.keys(alphabet)) {
            let snap1a = this.forceInput(snap1, input);
            let snap2a = this.forceInput(snap2, input);
            toBeProcessed.push({ fa1: snap1a, fa2: snap2a });
        }

        while (toBeProcessed.length > 0) {
            let current = toBeProcessed[toBeProcessed.length-1];
            toBeProcessed.pop();
            let snap1 = this.step(fa1, current.fa1);
            let snap2 = this.step(fa2, current.fa2);
            let signature = this.signatureOf(snap1, snap2); 
            if (!(signature in seen)) {
                if (this.inAcceptedState(snap1) != this.inAcceptedState(snap2))
                    return false;
                seen[signature] = 1;
                for (let input of Object.keys(alphabet)) {
                    let snap1a = this.forceInput(snap1, input);
                    let snap2a = this.forceInput(snap2, input);
                    toBeProcessed.push({ fa1: snap1a, fa2: snap2a });
                }
            }
        }
        return true;
    }

    forceInput(snap0: Snapshot, input: string): Snapshot {
        let snap = snap0.clone();
        snap.input[0] = input;
        snap.numCharsProcessed[0] = 0;
        snap0.selectedStates.forEach((value, key) => {snap.selectedStates.set(key, value)});
        return snap;
    }

    signatureOf(snap1: Snapshot, snap2: Snapshot): string {
        return this.signatureOf1(snap1) + "\t\t" + this.signatureOf1(snap2);
    }
    signatureOf1(snap: Snapshot): string {
        let sig = '';
        let first = true;
        snap.selectedStates.forEach(
            (value, key) => {
                if (!first)
                    sig += "\t";
                first = false;
                sig += key.label;
            }
        );
        return sig;
    }

    getAlphabet(fa: Automaton, baseSet: any): any {
        for (let arrow of fa.transitions) {
            let transitions = arrow.label.split('\n');
            for (let input of transitions) {
                if (input.length == 1 && input != '~') {
                    baseSet[input] = 1;
                } else if (input.length == 2 && input.charAt(0) == '!') {
                    baseSet[input.charAt(1)] = 1;
                }
            }
        }
        return baseSet;
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
        if (transition.length > 2 && transition.charAt(transition.length - 2) == '}') {
            storage = transition.substr(transition.length - 2);
            result = transition.substr(0, transition.length - 2);
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
                return FAEngine.charSet;
            } else {
                return transition;
            }
        } else if (transition.length == 2 && transition.charAt(0) == '!') {
            let result = FAEngine.charSet.replace(transition.charAt(1), '');
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
            '<ul><li>Each transition must contain a single alphanumeric character, or @ to denote the empty string ('
            + FormalLanguage.epsilon + ').</li>' +
            '<li>Shortcuts are also available:' +
            ' <ul><li>!x means "every character except x",</li> <li>~ means "any character".</li></ul></ul>'
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
        let next = new Snapshot(current.input[0]);
        next.variables = current.variables;
        next.numCharsProcessed[0] = current.numCharsProcessed[0] + 1;
        let processed = (current.input[0]).substring(0, next.numCharsProcessed[0]);
        let trigger = current.input[0].substring(current.numCharsProcessed[0], current.numCharsProcessed[0] + 1);
        for (let arrow of au.transitions) {
            let description = current.selectedStates.get(arrow.from);
            if (typeof description === typeof '') {
                let transitions = arrow.label.split('\n');
                for (let transition of transitions) {
                    transition = this.replaceVariablesIn(transition, current.variables);
                    let follow = false;
                    if (transition.length == 1) {
                        follow = (transition == trigger) || (transition == '~');
                    } else if (transition.length == 2 && transition.charAt(0) == '!') {
                        let notChar = transition.charAt(1);
                        follow = (notChar != trigger);
                    } else if (transition.length > 2) {
                        let acceptableTriggers = this.getTriggersFor(transition);
                        if (acceptableTriggers.indexOf(trigger) >= 0) {
                            follow = true;
                            if (transition.charAt(transition.length - 2) == '}') {
                                next.variables[transition.charAt(transition.length - 1)] = trigger;
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
            current.input[0] == null ||
            current.numCharsProcessed[0] >= current.input[0].length;
    }

    accepted(current: Snapshot): boolean {
        if (current.numCharsProcessed[0] >= current.input[0].length) {
            return this.inAcceptedState(current);
        } else {
            return false;
        }
    }

    inAcceptedState(current: Snapshot): boolean {
        let inFinalState = false;
        current.selectedStates.forEach(function (value, currentState) {
            inFinalState = inFinalState || currentState.final;
        });
        return inFinalState;
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


