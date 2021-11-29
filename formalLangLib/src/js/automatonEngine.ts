import { Automaton } from './automaton';
import { TestResult, ValidationResult } from './formalLanguage';




/**
 * AutomatonEngine
 * 
 * Provides the specializations that distinguish one type of automaton from another.
 * 
 */
export
abstract class AutomatonEngine {
    constructor(spec: string) {
        this.specification = spec;
    }

    specification: string;

    abstract canBeCheckedForEquivalence(): boolean;

    producesOutput() {
        return false;
    }

    abstract equivalent(automaton: Automaton, automaton2: Automaton): boolean; 


    abstract test (sample: string, automaton: Automaton): TestResult;

    abstract validate(automaton: Automaton): ValidationResult;

}

