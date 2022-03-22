import { Automaton } from './automaton';
import { AutomatonState } from './states';



/**
 * Snapshot
 * 
 * Describes the state of execution of an automaton.
 * 
 */
export
class Snapshot {
    constructor(input: string) {
        this.input = [input];
        this.numCharsProcessed = [0];
        this.selectedStates = new Map();
        this.variables = {};
        this.stepCounter = 0;
    }


    input: string[]; // Input to the automaton (tape for TMs)
    numCharsProcessed: number[]; // Portion of input that has been processed already
    selectedStates: Map<AutomatonState, string>;
    variables: any; // map from alphanumeric characters to alphanumeric characters
    stepCounter: number;


    setNumTapes(n: number)
    {
        while (this.input.length < n) {
            this.input.push('');
            this.numCharsProcessed.push(0);
        }
    }

    getNumTapes() {
        return this.input.length;
    }

    isSelected(state: AutomatonState): boolean {
        let value = this.selectedStates.get(state);
        return value !== undefined;
    }

    getDescription(state: AutomatonState): string[] {
        let desc = this.selectedStates.get(state);
        try {
            return (desc as string).split('\n');
        } catch {
            return [];
        }
    }

    clone(): Snapshot {
        let result = new Snapshot(this.input[0]);
        let numTapes = this.getNumTapes();
        result.setNumTapes(numTapes);
        result.variables = this.variables;
        for (let i = 0; i < numTapes; ++i) {
            result.input[i] = this.input[i];
            result.numCharsProcessed[i] = this.numCharsProcessed[i];
        }
        result.stepCounter = this.stepCounter;
        return result;
    }

}

