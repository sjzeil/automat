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
        this.input = input;
        this.numCharsProcessed = 0;
        this.selectedStates = new Map();
    }

    input: string | null; // Input to the automaton (null for TMs)
    numCharsProcessed: number; // Portion of input that has been processed already
    selectedStates: Map<AutomatonState, string>;


    inputPortrayal(): string {
        if (this.input != null) {
            let leftPart = this.input.substr(0, this.numCharsProcessed);
            let rightPart = this.input.substr(this.numCharsProcessed);
            return leftPart + '|' + rightPart;
        } else {
            return '';
        }
    }


}

