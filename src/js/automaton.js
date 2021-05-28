


/**
 * Automaton: a collection of states and transitions.
 * 
 *
 */

class Automaton {
    constructor(canvas) {
        this.states = [];
        this.transitions = [];
        this._canvas = canvas;
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


}
