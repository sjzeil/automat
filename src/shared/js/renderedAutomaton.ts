import { fabric } from 'fabric';
import { FormalLanguage } from './formalLanguage';
import { AutomatonState } from "./states";
import { AutomatonTransition } from "./transitions";
import { AutomatonStateRendering } from './stateRendering';
import { TransitionRendering } from './renderedTransitions'
import { Rendering, RenderedElement } from './renderedElement';
import { LanguageRendering } from './renderedLanguage';
import { Automaton } from './automaton';


/**
 * Automaton: a collection of states and transitions.
 * 
 */

export class AutomatonRendering extends LanguageRendering {
    constructor(canvas: fabric.Canvas, user: string) {
        super(canvas, user);
        this.states = [];
        this.transitions = [];
        this.language = this.automaton = new Automaton(user);
    }

    states: AutomatonStateRendering[];
    transitions: TransitionRendering[];
    automaton: Automaton;


    addState(x: number, y: number, label?: string) {
        let newState = this.automaton.addState(label);
        if (newState) {
            let newStateRender = new AutomatonStateRendering(newState, this.canvas,
                {
                    left: x,
                    top: y
                });
            this.states.push(newStateRender);
            return newStateRender;
        } else {
            return null;
        }
    }

    findState(label: string) {
        let s;
        for (s of this.states) {
            if (s.label == label)
                return s;
        }
        return null;
    }

    removeState(state: AutomatonStateRendering) {
        let tr;
        let preservedTransitions = [];
        for (tr of this.transitions) {
            if (tr.to != state && tr.from != state) {
                preservedTransitions.push(tr);
            } else {
                let trRenderer = tr.getRendering() as Rendering;
                this.canvas?.remove(trRenderer);
            }
        }
        this.transitions = preservedTransitions;
        let statePos = this.states.indexOf(state);
        if (statePos >= 0) {
            this.states.splice(statePos, 1);
            this.canvas?.remove(state.getRendering() as Rendering);
        }
        this.automaton.removeState(state._state);
    }

    clear() {
        while (this.states.length > 0) {
            this.removeState(this.states[this.states.length - 1]);
        }
        this.automaton.clear();
    }

    addTransition(fromState: string, toState: string, trigger: string) {
        let from = this.findState(fromState);
        if (from == null) {
            return null;
        }
        let to = this.findState(toState);
        if (to == null) {
            return null;
        }

        let transition = this.automaton.addTransition(fromState, toState, trigger) as AutomatonTransition;

        let t = this.findTransition(from, to);
        if (t == null) {
            t = new TransitionRendering(transition, from, to, this.canvas);
            let tReverse = this.findTransition(to, from);
            if (tReverse != null) {
                tReverse.curved = true;
                t.curved = true;
            }
            this.transitions.push(t);
        }
        return t;
    }

    removeTransition(transition: TransitionRendering) {
        let trRenderer = transition.getRendering() as Rendering;
        this.canvas?.remove(trRenderer);
        this.transitions.splice(this.transitions.indexOf(transition), 1);
    }

    findTransition(fromState: AutomatonStateRendering, toState: AutomatonStateRendering) {
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
            let rendering = state._rendering as Rendering;
            let stateObj = {
                label: state.label,
                left: rendering.left,
                top: rendering.top,
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
            specification: this.automaton.specification,
            createdBy: this.automaton.createdBy,
            states: stateList,
            transitions: transitionList,
        };
        return JSON.stringify(object);
    }

    fromJSon(jsonObj: any) {
        this.clear();
        this.automaton.createdBy = jsonObj.createdBy;
        this.automaton.specification = jsonObj.specification;
        let state;
        for (state of jsonObj.states) {
            let newState = this.addState(state.left, state.top, state.label);
            if (newState) {
                newState.final = state.final;
                newState.initial = state.initial;
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
