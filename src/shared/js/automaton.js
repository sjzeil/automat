
/**
 * Automaton: a collection of states and transitions.
 * 
 *
 */

class Automaton extends FormalLanguage {
    constructor(canvas) {
        super(canvas);
        this.states = [];
        this.transitions = [];
    }

    representation() {
        return "automaton";
    }

    automatonType() {
        return "FiniteAutomaton";
    }

    addState(x, y, label) {
        if (label == undefined) {
            let id = this.states.length;
            while (this.findState(""+id) != null) {
                ++id;
            }
            label = "" + id;
        }
        let newState = new AutomatonState(label, this._canvas, 
            {
                left: x,
                top: y
            });
        this.states.push(newState);
        return newState;
    }

    findState (label) {
        let s;
        for (s of this.states) {
            if (s.label == label)
                return s;
        }
        return null;
    }

    removeState (state) {
        let tr;
        let preservedTransitions = [];
        for (tr of this.transitions) {
            if (tr.to != state && tr.from != state) {
                preservedTransitions.push(tr);
            } else {
                let trRenderer = tr.getRendering();
                this._canvas.remove(trRenderer);
            }
        }
        this.transitions = preservedTransitions;
        let statePos = this.states.indexOf(state);
        if (statePos >= 0) {
            this.states.splice(statePos, 1);
            this._canvas.remove(state.getRendering());
        }
    }

    clear () {
        while (this.states.length > 0) {
            this.removeState(this.states[this.states.length-1]);
        }
    }

    addTransition (fromState, toState, trigger) {
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
            t = new AutomatonTransition(trigger, from, to, this._canvas);
            let tReverse = this.findTransition(to, from);
            if (tReverse != null) {
                tReverse.curved = true;
                t.curved = true;
            }
            this.transitions.push(t);
        } else {
            t.label = t.label + "\n" + trigger;
        }
        return t;
    }

    removeTransition(transition)
    {
        let trRenderer = transition.getRendering();
        this._canvas.remove(trRenderer);
        this.transitions.splice(this.transitions.indexOf(transition), 1);
    }

    findTransition (fromState, toState) {
        let tr;
        for (tr of this.transitions) {
            if (tr.to == toState && tr.from == fromState)
                return tr;
        }
        return null;
    }

    toJSon() {
        let stateList = [];
        let state;
        for (state of this.states) {
            let stateObj = {
                label: state.label,
                left: state._rendering.left,
                top: state._rendering.top,
                initial: state.initial,
                final: state.final,
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

        let object = {
            representation: this.representation(),
            automatonType: this.automatonType(),
            states: stateList,
            transitions: transitionList,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj) {
        this.clear();
        let state;
        for (state of jsonObj.states) {
            let newState = this.addState(state.left, state.top, state.label);
            newState.initial = state.initial;
            newState.final = state.final;
        }
        let transition;
        for (transition of jsonObj.transitions) {
            let fromState = this.findState(transition.from);
            let toState = this.findState(transition.to);
            this.addTransition(transition.from, transition.to, transition.label);
        }
    }

}
