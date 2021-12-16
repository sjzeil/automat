import { PDAEngine } from '../js/PDAEngine';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';


function pda0n1n(): Automaton {
    let fa = new Automaton('Instructor', '', new PDAEngine());
    fa.addState('0');
    fa.addState('1');
    fa.addState('2');
    fa.states[0].initial = true;
    fa.states[2].final = true;
    fa.addTransition('0', '0', '0,X/XX');  // Accept 0^n1^n, n > 0
    fa.addTransition('0', '0', '0,Z/XZ');
    fa.addTransition('0', '1', '1,X/@');
    fa.addTransition('1', '1', '1,X/@');
    fa.addTransition('1', '2', '@,Z/Z');
    return fa;
}

function pdawwr(): Automaton {
    let fa = new Automaton('Instructor', '', new PDAEngine());
    fa.addState('0');
    fa.addState('1');
    fa.addState('2');
    fa.states[0].initial = true;
    fa.states[2].final = true;
    fa.addTransition('0', '0', '0,@/0');  // Accept ww_R
    fa.addTransition('0', '0', '1,@/1');
    fa.addTransition('0', '1', '@,@/@');
    fa.addTransition('1', '1', '0,0/@');
    fa.addTransition('1', '1', '1,1/@');
    fa.addTransition('1', '2', '@,Z/@');
    return fa;
}

function pdawwr_b(): Automaton {
    let fa = new Automaton('Instructor', '', new PDAEngine());
    fa.addState('0');
    fa.addState('1');
    fa.addState('2');
    fa.states[0].initial = true;
    fa.states[2].final = true;
    fa.addTransition('0', '0', '~,@/~');  // Accept ww_R
    fa.addTransition('0', '1', '@,@/@');
    fa.addTransition('1', '1', '~,~/@');
    fa.addTransition('1', '2', '@,Z/@');
    return fa;
}


describe('PDAEngine', function () {
    context('validate-empty-fa', function () {
        let fa = new Automaton('Instructor', '', new PDAEngine());
        let validation = fa.validate();
        it('should flag an error', function () {
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.be.not.equal('');
        });
    });
    context('validate-no-single-initial-state', function () {
        it('should flag an error for no initial state', function () {
            let fa = new Automaton('Instructor', '', new PDAEngine());
            fa.addState('0');
            fa.addState('1');
            let validation = fa.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag an error for multiple initial states', function () {
            let fa = new Automaton('Instructor', '', new PDAEngine());
            fa.addState('0');
            fa.addState('1');
            fa.states[0].initial = true;
            fa.states[1].initial = true;
            let validation = fa.validate();

            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
    });
    context('warnings-no-final-state', function () {
        it('should warn about no final state', function () {
            let fa = new Automaton('Instructor', '', new PDAEngine());
            fa.addState('0');
            fa.addState('1');
            fa.states[0].initial = true;
            let validation = fa.validate();
            expect(validation.warnings.indexOf('final')).to.be.greaterThanOrEqual(0);
            expect(validation.errors).to.equal('');
        });
        it('no warning about final states', function () {
            let fa = new Automaton('Instructor', '', new PDAEngine());
            fa.addState('0');
            fa.addState('1');
            fa.states[0].initial = true;
            fa.states[1].final = true;
            let validation = fa.validate();
            expect(validation.warnings.indexOf('final')).to.lessThan(0);
            expect(validation.errors).to.equal('');
        });
        it('valid state transitions 0n1n', function () {
            let pda = pda0n1n();
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('valid state transitions wwr', function () {
            let pda = pdawwr();
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('should flag invalid state transitions', function () {
            let pda = pda0n1n();
            pda.addTransition('0', '1', '2');
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('accept ! shortcut', function () {
            let pda = pda0n1n();
            pda.addTransition('0', '1', '!0,0/00');
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
            pda.addTransition('0', '1', '0,!0/00');
            validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('accept ~ shortcut', function () {
            let pda = pda0n1n();
            pda.addTransition('0', '1', '~,0/00');
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
            pda.addTransition('0', '1', '~,~/00');
            validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
            pda.addTransition('0', '1', '~,~/~0');
            validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('accept storage shortcut', function () {
            let pda = pda0n1n();
            pda.addTransition('0', '1', '0,1}W,0/00');
            let validation = pda.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });

    });


    context('initial snapshot 0n1n', function () {
        it('deterministic PDA starts with one selected state', function () {
            let fa = pda0n1n();
            let inputStr = '011011';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(0);
            expect(snapshot.inputPortrayal()).to.equal('|' + inputStr);
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(fa.states[0])).to.equal('Z');
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });
    });

    context('initial snapshot wwr', function () {
        it('nondeterministic PDA starts with multiple selected states', function () {
            let fa = pdawwr();
            let inputStr = '011011';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(0);
            expect(snapshot.inputPortrayal()).to.equal('|' + inputStr);
            expect(snapshot.selectedStates.size).to.equal(3);
            expect(snapshot.selectedStates.get(fa.states[0])).to.equal('Z');
            expect(snapshot.selectedStates.get(fa.states[1])).to.equal('Z');
            expect(snapshot.selectedStates.get(fa.states[2])).to.equal('');
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });
    });

    context('initial snapshot wwr B', function () {
        it('nondeterministic PDA starts with multiple selected states', function () {
            let fa = pdawwr_b();
            let inputStr = '011011';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(0);
            expect(snapshot.inputPortrayal()).to.equal('|' + inputStr);
            expect(snapshot.selectedStates.size).to.equal(3);
            expect(snapshot.selectedStates.get(fa.states[0])).to.equal('Z');
            expect(snapshot.selectedStates.get(fa.states[1])).to.equal('Z');
            expect(snapshot.selectedStates.get(fa.states[2])).to.equal('');
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });


    });

    context('snapshot transition', function () {
        it('PDA transition succeeds', function () {
            let pda = pda0n1n();
            let inputStr = '0011';
            let snapshot = pda.engine.initialSnapshot(pda, inputStr);
            snapshot = pda.engine.step(pda, snapshot);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(1);
            expect(snapshot.inputPortrayal()).to.equal('0|011');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(pda.states[0])).equal('0Z');
            expect(snapshot.selectedStates.get(pda.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(pda.states[2])).to.be.undefined;
            expect(pda.engine.stopped(snapshot)).to.be.false;
        });
        it('PDA transition fails', function () {
            let pda = pda0n1n();
            let inputStr = '1011';
            let snapshot = pda.engine.initialSnapshot(pda, inputStr);
            snapshot = pda.engine.step(pda, snapshot);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(1);
            expect(snapshot.inputPortrayal()).to.equal('1|011');
            expect(snapshot.selectedStates.size).to.equal(0);
            expect(snapshot.selectedStates.get(pda.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(pda.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(pda.states[2])).to.be.undefined;
            expect(pda.engine.stopped(snapshot)).to.be.true;
            expect(pda.engine.accepted(snapshot)).to.be.false;
        });


    });

});
