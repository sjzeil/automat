import { FAEngine } from '../js/FAEngine';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';


function sampleDFA(): Automaton {
    let fa = new Automaton('Instructor', '', new FAEngine());
    fa.addState('0');
    fa.addState('1');
    fa.addState('2');
    fa.states[0].initial = true;
    fa.states[2].final = true;
    fa.addTransition('0', '0', '0');  // Accept strings ending in 2 or more 1's
    fa.addTransition('0', '1', '1');
    fa.addTransition('1', '2', '1');
    fa.addTransition('2', '2', '1');
    fa.addTransition('1', '0', '0');
    fa.addTransition('2', '0', '0');
    return fa;
}

function sampleNFA(): Automaton {
    let fa = new Automaton('Instructor', '', new FAEngine());
    fa.addState('0');
    fa.addState('1');
    fa.addState('2');
    fa.addState('3');
    fa.addState('4');
    fa.addState('5');
    fa.addState('6');
    fa.states[0].initial = true;
    fa.states[3].final = true;
    fa.states[6].final = true;
    fa.addTransition('0', '1', '@');  // Accept non-empty strings containing all zeros or all ones
    fa.addTransition('0', '2', '@');
    fa.addTransition('1', '3', '1');
    fa.addTransition('2', '4', '0');
    fa.addTransition('3', '3', '1');
    fa.addTransition('4', '4', '0');
    fa.addTransition('1', '5', '1');
    fa.addTransition('4', '6', '@');
    fa.addTransition('6', '4', '@');
    return fa;
}


describe('FAEngine', function () {
    context('validate-empty-fa', function () {
        let fa = new Automaton('Instructor', '', new FAEngine());
        let validation = fa.validate();
        it('should flag an error', function () {
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.be.not.equal('');
        });
    });
    context('validate-no-single-initial-state', function () {
        it('should flag an error for no initial state', function () {
            let fa = new Automaton('Instructor', '', new FAEngine());
            fa.addState('0');
            fa.addState('1');
            let validation = fa.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag an error for multiple initial states', function () {
            let fa = new Automaton('Instructor', '', new FAEngine());
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
            let fa = new Automaton('Instructor', '', new FAEngine());
            fa.addState('0');
            fa.addState('1');
            fa.states[0].initial = true;
            let validation = fa.validate();
            expect(validation.warnings.indexOf('final')).to.be.greaterThanOrEqual(0);
            expect(validation.errors).to.equal('');
        });
        it('no warning about final states', function () {
            let fa = new Automaton('Instructor', '', new FAEngine());
            fa.addState('0');
            fa.addState('1');
            fa.states[0].initial = true;
            fa.states[1].final = true;
            let validation = fa.validate();
            expect(validation.warnings.indexOf('final')).to.lessThan(0);
            expect(validation.errors).to.equal('');
        });
    });


    context('initial snapshot', function () {
        it('deterministic FA starts with one selected state', function () {
            let fa = sampleDFA();
            let inputStr = '011011';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(0);
            expect(snapshot.inputPortrayal()).to.equal('|' + inputStr);
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(fa.states[0])).to.equal('');
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });
        it('nondeterministic FA starts with multiple selected states', function () {
            let fa = sampleNFA();
            let inputStr = '000';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(0);
            expect(snapshot.inputPortrayal()).to.equal('|' + inputStr);
            expect(snapshot.selectedStates.size).to.equal(3);
            expect(snapshot.selectedStates.get(fa.states[0])).to.equal('');
            expect(snapshot.selectedStates.get(fa.states[1])).to.equal('');
            expect(snapshot.selectedStates.get(fa.states[2])).to.equal('');
            expect(snapshot.selectedStates.get(fa.states[3])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[4])).to.be.undefined;
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });
    });


    context('snapshot transition', function () {
        it('DFA transition succeeds', function () {
            let fa = sampleDFA();
            let inputStr = '111011';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            snapshot = fa.engine.step(fa, snapshot);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(1);
            expect(snapshot.inputPortrayal()).to.equal('1|11011');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(fa.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[1])).equal('1');
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(fa.engine.stopped(snapshot)).to.be.false;
        });
        it('DFA transition fails', function () {
            let fa = sampleDFA();
            let inputStr = 'abc';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            snapshot = fa.engine.step(fa, snapshot);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(1);
            expect(snapshot.inputPortrayal()).to.equal('a|bc');
            expect(snapshot.selectedStates.size).to.equal(0);
            expect(snapshot.selectedStates.get(fa.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(fa.engine.stopped(snapshot)).to.be.true;
            expect(fa.engine.accepted(snapshot)).to.be.false;
        });

        it('DFA transition to accept', function () {
            let fa = sampleDFA();
            let inputStr = '11';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            snapshot = fa.engine.step(fa, snapshot);
            snapshot = fa.engine.step(fa, snapshot);
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(2);
            expect(snapshot.inputPortrayal()).to.equal('11|');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(fa.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).equal('11');
            expect(fa.engine.stopped(snapshot)).to.be.true;
            expect(fa.engine.accepted(snapshot)).to.be.true;
        });



        it('nondeterministic FA transition to multiple 0s', function () {
            let fa = sampleNFA();
            let inputStr = '000';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            while (!fa.engine.stopped(snapshot)) {
                expect(fa.engine.accepted(snapshot)).to.be.false;
                snapshot = fa.engine.step(fa, snapshot);
            }
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(inputStr.length);
            expect(snapshot.inputPortrayal()).to.equal(inputStr + '|');
            expect(snapshot.selectedStates.size).to.equal(2);
            expect(snapshot.selectedStates.get(fa.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[3])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[4])).to.equal(inputStr);
            expect(snapshot.selectedStates.get(fa.states[5])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[6])).to.equal(inputStr);
            expect(fa.engine.accepted(snapshot)).to.be.true;
        });


        it('nondeterministic FA transition to multiple 1s', function () {
            let fa = sampleNFA();
            let inputStr = '111';
            let snapshot = fa.engine.initialSnapshot(fa, inputStr);
            snapshot = fa.engine.step(fa, snapshot);
            expect(fa.engine.stopped(snapshot)).to.be.false;
            expect(snapshot.input).to.equal(inputStr);
            expect(snapshot.numCharsProcessed).to.equal(1);
            expect(snapshot.inputPortrayal()).to.equal('1|11');
            expect(snapshot.selectedStates.size).to.equal(2);
            expect(snapshot.selectedStates.get(fa.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[1])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[2])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[3])).to.equal('1');
            expect(snapshot.selectedStates.get(fa.states[4])).to.be.undefined;
            expect(snapshot.selectedStates.get(fa.states[5])).to.equal('1');
            expect(snapshot.selectedStates.get(fa.states[6])).to.be.undefined;
            expect(fa.engine.accepted(snapshot)).to.be.false;
        });

    });


    context('FA execution', function () {
        it('nondeterministic FA accepts', function () {
            let fa = sampleNFA();
            let inputStr = '000';
            expect(fa.test('000').passed).to.be.true;
            expect(fa.test('11').passed).to.be.true;
            expect(fa.test('01').passed).to.be.false;
            expect(fa.test('110').passed).to.be.false;
        });
    });


});