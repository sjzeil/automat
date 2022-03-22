import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
import { AutomatonEngine } from './automatonEngine';
import { FormalLanguage, TestResult, ValidationResult } from './formalLanguage';




/**
 * TMEngine
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

    producesOutput() {
        return true;
    }


    equivalent(automaton: Automaton, automaton2: Automaton): boolean {
        return false;
    }


    test(sample: string, automaton: Automaton): TestResult {
        let snapshot = this.initialSnapshot(automaton, sample);
        while (!this.stopped(snapshot)) {
            snapshot = this.step(automaton, snapshot);
        }
        return new TestResult(this.accepted(snapshot), this.trimTape(snapshot.input[0]));
    }

    trimTape (tape: string): string {
        let start = 0;
        while (start < tape.length && tape.charAt(start) == '@') {
            ++start;
        }
        let stop = tape.length;
        while (stop > start && tape.charAt(stop-1) == '@') {
            --stop;
        }
        return tape.slice(start, stop);
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
        let numTapes = -1;  
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
                        let inputs = [];
                        let outputs = [];
                        let movements = [];
                        try {
                            inputs = this.parseInputs(transition);
                            outputs = this.parseOutputs(transition);
                            movements = this.parseMovements(transition);
                        } catch (err) {
                            return {
                                warnings: '',
                                errors: err as string,
                            }
                        }
                        if (inputs.length == 0) {
                            return {
                                warnings: '',
                                errors: 'Illegal transiton: ' + transition + ' has no inputs.',
                            }
                        }
                        if (inputs.length != outputs.length) {
                            return {
                                warnings: '',
                                errors: 'Illegal transiton: ' + transition + ' - # of inputs does not match # of outputs.',
                            }
                        }
                        if (inputs.length != movements.length) {
                            return {
                                warnings: '',
                                errors: 'Illegal transiton: ' + transition + ' - # of inputs does not match # of movements.',
                            }
                        }
                        if (numTapes < 0)  {
                            numTapes = inputs.length;
                        } else if (inputs.length != numTapes) {
                            return {
                                warnings: '',
                                errors: 'Inconsistent transitions: ' + transition + ' uses a different number of tapes than at least one other transition.',
                            }
                        }
                        if (numTapes == 1) {
                            let transitionTriggers = this.getTriggersFor(inputs[0]);
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
                                if (transitionsSeen.has(trigger)) {
                                    return {
                                        warnings: '',
                                        errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                            ' has duplicate transitions on ' + trigger + '.'
                                    }
                                }
                                transitionsSeen.add(trigger);
                            }
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

    parseInputs(transition: string): string[] {
        let results = [] as string[];
        let parts = transition.split('/');
        if (parts.length < 2) {
            throw 'Transition "' + transition + '" has no "/" dividing the input and output sections.'
        }
        if (parts.length > 2) {
            throw 'Transition "' + transition + '" has multiple "/" dividers.'
        }
        let input = parts[0];
        this.parseInputsInto(input, transition, results);
        return results;
    }

    parseInputsInto(transitionInput: string, transition: string, results: string[]): string[] {
        if (transitionInput.length == 0) {
            return [];
        } else if (transitionInput.charAt(0) == '!') {
            if (transitionInput.match(/^![0-9A-Za-z@]/)) {
                results.push(transitionInput.substring(0,2));
                this.parseInputsInto(transitionInput.substring(2), transition, results);
            } else {
                throw 'Invalid input character in ' + transition + ' following a !'
            }
        } else if (transitionInput.match(/^[0-9A-Za-z@](,[0-9A-Za-z@])*}[A-Za-z]/)) {
            let pos = transitionInput.indexOf('}') + 2;
            results.push(transitionInput.substring(0,pos));
            this.parseInputsInto(transitionInput.substring(pos), transition, results);
        } else if (transitionInput.match(/^[0-9A-Za-z@~]/)) {
            results.push(transitionInput.substring(0,1));
            this.parseInputsInto(transitionInput.substring(1), transition, results);
        } else {
            throw 'Illegal character "' + transitionInput.charAt(0) + '" in transition ' + transition;
        }
        return results;
    }

    parseOutputs(transition: string): string[] {
        let parts = transition.split('/');
        if (parts.length < 2) {
            throw 'Transition "' + transition + '" has no "/" dividing the input and output sections.'
        }
        if (parts.length > 2) {
            throw 'Transition "' + transition + '" has multiple "/" dividers.'
        }
        let outputParts = parts[1].split(/,/);
        if (outputParts.length < 2) {
            throw 'Transition "' + transition + '" has no "," dividing the tape output and movement.'
        }
        if (outputParts.length > 2) {
            throw 'Transition "' + transition + '" has multiple "," dividers.'
        }
        let output = outputParts[0];
        if (output.match(/^[0-9A-Za-z@~]+$/)) {
            let results = [] as string[];
            for (let ch of output) {
                results.push(ch);
            }
            return results;
        } else {
            throw 'Illegal character in tape output of transition ' + transition;
        }
    }

    parseMovements(transition: string): string[] {
        let parts = transition.split('/');
        if (parts.length < 2) {
            throw 'Transition "' + transition + '" has no "/" dividing the input and output sections.'
        }
        if (parts.length > 2) {
            throw 'Transition "' + transition + '" has multiple "/" dividers.'
        }
        let outputParts = parts[1].split(/,/);
        if (outputParts.length < 2) {
            throw 'Transition "' + transition + '" has no "," dividing the tape output and movement.'
        }
        if (outputParts.length > 2) {
            throw 'Transition "' + transition + '" has multiple "," dividers.'
        }
        let movement = outputParts[1];
        if (movement.match(/^[LRS]+$/)) {
            let results = [] as string[];
            for (let ch of movement) {
                results.push(ch);
            }
            return results;
        } else {
            throw 'Illegal character in movement part of transition ' + transition;
        }
    }

    replaceVariablesIn(transition: string, variableMapping: any): string {
        let storage = '';
        let result = transition;
        if (transition.length > 2 && transition.charAt(transition.length-2) == '}') {
            storage = transition.substring(transition.length-2);
            result = transition.substring(0, transition.length-2);
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

    private static charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@';

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
        let trimmedInput = input.replace(/^@*/,'').replace(/@*$/,'');
        let snapshot = new Snapshot(trimmedInput);
        let transitions = au.transitions[0].label.split("\n");
        let movements = this.parseMovements(transitions[0]);
        let numTapes = movements.length;
        snapshot.setNumTapes(numTapes);
        for (let state of au.states) {
            if (state.initial) {
                snapshot.selectedStates.set(state, '');
            }
        }
        return snapshot;
    }


    step(au: Automaton, current: Snapshot): Snapshot {
        if (current.stepCounter < TMEngine.executionLimit) {
            for (let arrow of au.transitions) {
                if (current.isSelected(arrow.from)) {
                    let transitions = arrow.label.split('\n');
                    for (let transition of transitions) {
                        let OK = this.inputMatches(transition, current);
                        if (OK) {
                            let next = this.applyTransition(transition, current);
                            next.selectedStates.set(arrow.to, '');
                            ++next.stepCounter;
                            return next;
                        }
                    }
                }
            }
        }
        let failed = current.clone();
        return failed;
    }
    
    applyTransition(transition: string, current: Snapshot): Snapshot {
        let inputs = [];
        let outputs = [];
        let movements = [];
        let next = current.clone();
        inputs = this.parseInputs(transition);
        outputs = this.parseOutputs(transition);
        movements = this.parseMovements(transition);
        for (let tapeNum = 0; tapeNum < inputs.length; ++tapeNum) {
            let headPosition = current.numCharsProcessed[tapeNum];
            let tape = current.input[tapeNum];
            let tapeChar = '@';
            if (headPosition >= 0 && headPosition < tape.length) {
                tapeChar = tape.charAt(headPosition);
            }
            // Store variable if rule was a,b,c,}w
            let inputRule = inputs[tapeNum];
            if (inputRule.length > 2) {
                let pos = inputRule.indexOf('{');
                if (pos < 0) {
                    throw 'Illegal input rule encountered.';
                }
                next.variables.set(inputRule.substring(pos + 1), tapeChar);
            }
            // Write character to tape
            let tapeOutput = outputs[tapeNum];
            if (tapeOutput == '~') {
                tapeOutput = tapeChar;
            } else {
                tapeOutput = this.replaceVariablesIn(tapeOutput, next.variables);
            }
            this.writeToTape(tapeOutput, tapeNum, next);
            // Move
            this.shiftTapeHead(movements[tapeNum], tapeNum, next);
        }
        return next;
    }
    
    writeToTape(tapeOutput: string, tapeNum: number, snapshot: Snapshot) {
        let k = snapshot.numCharsProcessed[tapeNum];
        let tape = snapshot.input[tapeNum];
        if (tape != '') {
            while (k < 0) {
                tape = '@' + tape;
                ++k;
            }
            while (k > tape.length) {
                tape += '@';
            }
        } else {
            tape = '@';
        }
        tape = tape.substring(0, k) + tapeOutput + tape.substring(k + 1);
        snapshot.input[tapeNum] = tape;
        snapshot.numCharsProcessed[tapeNum] = k;
    }

    shiftTapeHead(direction: string, tapeNum: number, snapshot: Snapshot) {
        if (direction == 'L') {
            --snapshot.numCharsProcessed[tapeNum];
            if (snapshot.numCharsProcessed[tapeNum] < 0) {
                snapshot.input[tapeNum] = '@' + snapshot.input[tapeNum];
                snapshot.numCharsProcessed[tapeNum] = 0;
            }
        } else if (direction == 'R') {
            ++snapshot.numCharsProcessed[tapeNum];
            if (snapshot.numCharsProcessed[tapeNum] >= snapshot.input[tapeNum].length) {
                snapshot.input[tapeNum] += '@';
            }
        }
    }





    inputMatches(transition: string, current: Snapshot): boolean {
        let inputs = [];
        try {
            inputs = this.parseInputs(transition);
            let tapeNum = 0;
            for (let inputRule of inputs) {
                if (!this.checkTransitionInput(inputRule, current.input[tapeNum], 
                         current.numCharsProcessed[tapeNum], current.variables)) {
                    return false;
                }
                ++tapeNum;
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    private checkTransitionInput(inputRule: string, tape: string, headPosition: number, mapping: any): boolean {
        let tapeChar = '@';
        if (headPosition >= 0 && headPosition < tape.length) {
            tapeChar = tape.charAt(headPosition);
        }
        if (inputRule.length == 1) {
            if (inputRule == '~') {
                return true;
            }
            let inputRuleSub = this.replaceVariablesIn(inputRule, mapping);
            return inputRuleSub == tapeChar;
        } else if (inputRule.length == 2) {
            if (inputRule.charAt(0) != '!')
                return false;
            let inputRuleSub = this.replaceVariablesIn(inputRule, mapping);
            return inputRuleSub.charAt(1) != tapeChar;
        } else {
            let pos = inputRule.indexOf('{');
            if (pos < 0)
                return false;
            return inputRule.substring(0, pos).indexOf(tapeChar) >= 0;
        }
    }


    stopped(current: Snapshot): boolean {
        if (current.selectedStates.size == 0) {
            return true;
        } else {
            let inFinalState = false;
            current.selectedStates.forEach(function (value, currentState) {
                inFinalState = currentState.final;
            });
            return inFinalState;
        }
    }

    accepted(current: Snapshot): boolean {
        if (current.selectedStates.size > 0) {
            let inFinalState = false;
            current.selectedStates.forEach(function (value, currentState) {
                inFinalState = currentState.final;
            });
            return inFinalState;
        } else {
            return false;
        }            
    }


    inputPortrayal(snapshot: Snapshot): string {
        if (snapshot.input != null) {
            let tapes = snapshot.input;
            let result = '';

            for (let i = 0; i < tapes.length; ++i) {
                let tape = tapes[i];
                let leftPart = tape.substring(0, snapshot.numCharsProcessed[i]);
                while (leftPart.length > 0 && leftPart.charAt(0) == '@') {
                    leftPart = leftPart.substring(1);
                }
                if (leftPart.length == 0) {
                    leftPart = '@';
                }
                let rightPart = tape.substring(snapshot.numCharsProcessed[i]);
                while (rightPart.length > 0 && rightPart.charAt(rightPart.length-1) == '@') {
                    rightPart = rightPart.substring(0, rightPart.length-1);
                }
                if (rightPart.length == 0) {
                    rightPart = '@@';
                } else if (rightPart.length == 1) {
                    rightPart = rightPart + '@';
                }
                let symbolAtHead = rightPart.charAt(0);
                rightPart = rightPart.substring(1);
                if (result != '') {
                    result += "\n";
                }
                result += leftPart + '[' + symbolAtHead + ']' + rightPart;
            }
            return result;
        } else {
            return '';
        }
    }



}



