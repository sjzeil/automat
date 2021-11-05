import { AutomatonState } from './states';


/**
 * A renderable transition within an automaton
 */
 export
 class AutomatonTransition {

    label: string;
    from: AutomatonState;
    to: AutomatonState;


    constructor (label: string, fromState: AutomatonState, toState: AutomatonState) {
        this.label = label;
        this.from = fromState;
        this.to = toState;
    }
   
}