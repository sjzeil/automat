/**
 * Automaton: a collection of states and transitions.
 * 
 *
 */

class Automaton {
    constructor() {
        this.states = [];
        this.transitions = [];
    }

    addState(label) {
        if (label == undefined) {
            let id = this.states.length;
            while (this.findState(""+id) != null) {
                ++id;
            }
            label = "" + id;
        }
        let newState = new State({label: label});
        this.states.push(newState);
        newState.left = 200 * Math.random();
        newState.top = 200 * Math.random();
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
            t = new Transition(from, to, {label: trigger});
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

    findTransition (fromState, toState) {
        let tr;
        for (tr of this.transitions) {
            if (tr.to == toState && tr.from == fromState)
                return tr;
        }
        return null;
    }

    render(canvas) {
        let s;
        for (s of this.states) {
            console.log("s: " + s);
            canvas.add(s);
        }
        let t;
        for (t of this.transitions) {
            canvas.add(t);
        }
    }



}
