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
        //TODO
        return {
            warnings: '',
            errors: ''
        };
    }

}

