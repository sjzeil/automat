import { Automaton } from './automaton';
import { AutomatonEngine } from './automatonEngine';
import { TestResult, ValidationResult } from './formalLanguage';




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

    canBeCheckedForEquivalence(): boolean
    {
        return false;  // TODO to change this later
    }


    equivalent(automaton: Automaton, automaton2: Automaton): boolean
    {
        return false;
    }


    test (sample: string, automaton: Automaton): TestResult
    {
        //TODO
        return {
            passed: false,
            output: ''
        };
    }

    validate(automaton: Automaton): ValidationResult
    {
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
        for (let state of automaton.states) {
            let transitionsSeen = new Set<string>();
            for (let arrow of automaton.transitions) {
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
                    if (transitionsInThisArrow.has(transition)) {
                        return {
                            warnings: '',
                            errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                            ' has duplicate transitions.'
                        }
                    }
                    transitionsInThisArrow.add(transition);
                    if (transition == '@' || transitionsSeen.has(transition)) {
                        isDeterministic = false;
                    }
                    if (transition != '@') {
                        transitionsSeen.add(transition);
                    }
                    if (transition.length != 1 || !transition.match(/^[@0-9A-Za-z]$/)) {
                        return {
                            warnings: warningStr,
                            errors: 'The arrow from ' + arrow.from.label + ' to ' + arrow.to.label +
                                ' has an invalid transition: ' + transition
                        };
    
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

    startingTransition(): string {
        return '@';
    }

    transitionText(): string 
    {
        return 'Each arrow may represent one or more transitions.\n' +
         'Each transition must contain a single alphanumeric character, or @ to denote the empty string (\u03B5).' 
    }

}

