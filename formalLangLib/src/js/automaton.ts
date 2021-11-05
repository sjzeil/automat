import { FormalLanguage } from './formalLanguage';
import { AutomatonState } from "./states";
import { AutomatonTransition } from "./transitions";


/**
 * Automaton: a collection of states and transitions.
 * 
 */

export class Automaton extends FormalLanguage {
    constructor(createdBy: string, problem: string) {
        super(createdBy, problem);
        this.states = [];
        this.transitions = [];
        this.specification = "automaton";
    }

    states: AutomatonState[];
    transitions: AutomatonTransition[];

    /**
     * Add a state to the automaton. Label must be unique.
     * @param label optional label for state. If omitted, a unique numeric label is selected.
     * @returns the new state, or null if an existing state already has the given label 
     */
    addState(label?: string) {
        if (label == undefined) {
            let id = this.states.length;
            while (this.findState("" + id) != null) {
                ++id;
            }
            label = "" + id;
        }
        if (this.findState(label) == null) {
            let newState = new AutomatonState(label);
            this.states.push(newState);
            return newState;
        } else {
            return null;
        }
    }

    /**
     * Search the automaton for a state with this label.
     * @param label label to search for
     * @returns the state or null if no state with that label exists
     */
    findState(label: string) {
        let s;
        for (s of this.states) {
            if (s.label == label)
                return s;
        }
        return null;
    }

    /**
     * Remove a state (and all incoming and outgoing transitions) from the automaton.
     * @param state  the state to remove.
     */
    removeState(state: AutomatonState) {
        let tr;
        let preservedTransitions = [];
        for (tr of this.transitions) {
            if (tr.to != state && tr.from != state) {
                preservedTransitions.push(tr);
            }
        }
        this.transitions = preservedTransitions;
        let statePos = this.states.indexOf(state);
        if (statePos >= 0) {
            this.states.splice(statePos, 1);
        }
    }

    /**
     * Remove all states and transition from this automaton.
     */
    clear() {
        while (this.states.length > 0) {
            this.removeState(this.states[this.states.length - 1]);
        }
    }

    /**
     * Add a transition between two states.  If the transition already exists, the trigger
     * is added to that transition.
     * 
     * @param fromState 
     * @param toState 
     * @param trigger 
     * @returns the new or augmented transition.
     */
    addTransition(fromState: string, toState: string, trigger: string) {
        let from = this.findState(fromState);
        if (from == null) {
            return null;
        }
        let to = this.findState(toState);
        if (to == null) {
            return null;
        }

        let t = this.findTransition(from, to);
        if (t == null) {
            t = new AutomatonTransition(trigger, from, to);
            this.transitions.push(t);
        } else {
            t.label = t.label + "\n" + trigger;
        }
        return t;
    }

    /**
     * Remove a transition from the automaton.
     * @param transition the transition to remove
     */
    removeTransition(transition: AutomatonTransition) {
        this.transitions.splice(this.transitions.indexOf(transition), 1);
    }

    /**
     * Search the automaton for a transition between two states.
     * @param fromState the source state of the desired transition
     * @param toState the destination state of the desired transition
     * @returns the matching transition, or null if one does not exist.
     */
    findTransition(fromState: AutomatonState, toState: AutomatonState) {
        let tr;
        for (tr of this.transitions) {
            if (tr.to == toState && tr.from == fromState)
                return tr;
        }
        return null;
    }

    saveJSon(jsonObj: any) {
        super.saveJSon(jsonObj);
        let stateList = [];
        let state;
        for (state of this.states) {
            let stateObj = {
                label: state.label,
                initial: state.initial,
                final: state.final,
                x: state.x,
                y: state.y,
            };
            stateList.push(stateObj);
        }
        let transitionList = [];
        let transition;
        for (transition of this.transitions) {
            let transObj = {
                from: transition.from.label,
                to: transition.to.label,
                label: transition.label,
            };
            transitionList.push(transObj);
        }

        jsonObj.states = stateList;
        jsonObj.transitions = transitionList;
    }

    fromJSon(jsonObj: any) {
        this.clear();
        super.fromJSon(jsonObj);
        let state;
        for (state of jsonObj.states) {
            let newState = this.addState(state.label);
            if (newState) {
                newState.initial = state.initial;
                newState.final = state.final;
            }
        }
        let transition;
        for (transition of jsonObj.transitions) {
            let fromState = this.findState(transition.from);
            let toState = this.findState(transition.to);
            this.addTransition(transition.from, transition.to, transition.label);
        }
    }

}
