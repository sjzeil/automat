import { Automaton } from './automaton';
import { Snapshot } from './snapshot';
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

    abstract name(): string;

    abstract canBeCheckedForEquivalence(): boolean;

    producesOutput() {
        return false;
    }

    abstract equivalent(automaton: Automaton, automaton2: Automaton): boolean; 


    abstract test (sample: string, automaton: Automaton): TestResult;

    abstract validate(automaton: Automaton): ValidationResult;

    abstract transitionText(): string;

    abstract startingTransition(): string;

    abstract initialSnapshot(au: Automaton, input: string): Snapshot;

    abstract step(au: Automaton, current: Snapshot): Snapshot;

    abstract stopped(current: Snapshot): boolean;

    abstract accepted(current: Snapshot): boolean;
}


