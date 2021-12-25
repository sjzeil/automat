import { TMEngine } from '../js/TMEngine';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';


function tmUpperCase(): Automaton {
    let tm = new Automaton('Instructor', '', new TMEngine());
    tm.addState('0');
    tm.addState('1');
    tm.states[0].initial = true;
    tm.states[1].final = true;
    tm.addTransition('0', '0', 'A/A,R');  // Convert strings over {a,b,A,B} to upper-case
    tm.addTransition('0', '0', 'B/B,R');
    tm.addTransition('0', '0', 'a/A,R');
    tm.addTransition('0', '0', 'b/B,R');
    tm.addTransition('0', '1', '@/@,R');
    return tm;
}

function tm_scs(): Automaton {
    let tm = new Automaton('Instructor', '', new TMEngine());
    tm.addState('0');
    tm.addState('1');
    tm.addState('2');
    tm.addState('3');
    tm.addState('4');
    tm.addState('5');
    tm.states[0].initial = true;
    tm.states[5].final = true;
    // Accept strings of the form scs where s is any string over {a,b}
    tm.addTransition('0', '1', 'a,b}w/@,R');
    tm.addTransition('1', '1', '!c/~,R');
    tm.addTransition('1', '2', 'c/c,R');
    tm.addTransition('2', '2', 'x/x,R');
    tm.addTransition('2', '3', 'w/x,L');
    tm.addTransition('3', '3', '!@/~,L');
    tm.addTransition('3', '0', '@/@,R');
    tm.addTransition('0', '4', 'c/@,R');
    tm.addTransition('4', '4', 'x/@,R');
    tm.addTransition('4', '5', '@/@,R');
    return tm;
}

function tmTwoTapes(): Automaton {
    let tm = new Automaton('Instructor', '', new TMEngine());
    tm.addState('0');
    tm.addState('1');
    tm.states[0].initial = true;
    tm.states[1].final = true;
    tm.addTransition('0', '0', 'A@/AA,RL');  // Convert strings over {a,b,A,B} to upper-case on one tape and reverse on 2nd
    tm.addTransition('0', '0', 'B@/BB,RL');
    tm.addTransition('0', '0', 'a@/Aa,RL');
    tm.addTransition('0', '0', 'b@/Bb,RL');
    tm.addTransition('0', '1', '@@/@@,SS');
    return tm;
}


describe('TMEngine', function () {
    context('validate-empty-tm', function () {
        let tm = new Automaton('Instructor', '', new TMEngine());
        let validation = tm.validate();
        it('should flag an error', function () {
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.be.not.equal('');
        });
    });
    context('validate-no-single-initial-state', function () {
        it('should flag an error for no initial state', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag an error for multiple initial states', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.states[0].initial = true;
            tm.states[1].initial = true;
            let validation = tm.validate();

            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
    });
    context('warnings-no-final-state', function () {
        it('should warn about no final state', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.states[0].initial = true;
            let validation = tm.validate();
            expect(validation.warnings.indexOf('final')).to.be.greaterThanOrEqual(0);
            expect(validation.errors).to.equal('');
        });
        it('no warning about final states', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.states[0].initial = true;
            tm.states[1].final = true;
            let validation = tm.validate();
            expect(validation.warnings.indexOf('final')).to.lessThan(0);
            expect(validation.errors).to.equal('');
        });
        it('valid state transitions UC', function () {
            let tm = tmUpperCase();
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('valid state transitions scs', function () {
            let tm = tm_scs();
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('valid multi-tape transitions', function () {
            let tm = tmTwoTapes();
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('inconsistent multi-tape numbers', function () {
            let tm = tmTwoTapes();
            tm.addTransition('0', '1', 'a/a,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('inconsistent multi-tape numbers 2', function () {
            let tm = tmTwoTapes();
            tm.addTransition('0', '1', 'aa/a,RS');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('inconsistent multi-tape numbers 3', function () {
            let tm = tmTwoTapes();
            tm.addTransition('0', '1', 'aa/aa,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag ill-formed state transitions 1', function () {
            let tm = tmUpperCase();
            tm.addTransition('0', '1', 'a,a,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag ill-formed state transitions 2', function () {
            let tm = tmUpperCase();
            tm.addTransition('0', '1', 'a/a;R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag ill-formed direction', function () {
            let tm = tmUpperCase();
            tm.addTransition('0', '1', 'a/a,A');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('should flag obvious non-determinism', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.states[0].initial = true;
            tm.addTransition('0', '1', 'a/a,L');
            tm.addTransition('0', '0', 'a/b,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.not.equal('');
        });
        it('accept ! shortcut', function () {
            let tm = tmUpperCase();
            tm.addTransition('1', '0', '!0/0,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('accept ~ shortcut', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.addState('2');
            tm.states[0].initial = true;
            tm.states[1].final = true;
            tm.addTransition('0', '1', '~/0,L');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
            tm.addTransition('1', '2', '!0/~,R');
            validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
            tm.addTransition('2', '1', '~/~,S');
            validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });
        it('accept storage shortcut', function () {
            let tm = tmUpperCase();
            tm.addTransition('0', '1', '0,1}W/~,R');
            let validation = tm.validate();
            expect(validation.warnings).to.equal('');
            expect(validation.errors).to.equal('');
        });

    });


    context('initial snapshot UC', function () {
        it('TM starts with one selected state', function () {
            let tm = tmUpperCase();
            let inputStr = 'aBb';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            expect(snapshot.input[0]).to.equal(inputStr);
            expect(snapshot.numCharsProcessed[0]).to.equal(0);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[a]Bb');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(tm.states[0])).to.equal('');
            expect(snapshot.selectedStates.get(tm.states[1])).to.be.undefined;
            expect(tm.engine.stopped(snapshot)).to.be.false;
        });
    });

    context('initial snapshot scs', function () {
        it('TM starts with one selected state', function () {
            let tm = tm_scs();
            let inputStr = '011011';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            expect(snapshot.input[0]).to.equal(inputStr);
            expect(snapshot.numCharsProcessed[0]).to.equal(0);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[0]11011');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(tm.states[0])).to.equal('');
            for (let i = 1; i < tm.states.length; ++i) {
                expect(snapshot.selectedStates.get(tm.states[i])).to.be.undefined;
            }
        });
    });


    context('trim input portrayal', function () {
        it('should leave only one @ at each end', function () {
            let tm = tm_scs();
            let snapshot = tm.engine.initialSnapshot(tm, '@@1@@');
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[1]@');
        });
    });

    context('empty input portrayal', function () {
        it('should show empty tape as @[@]@', function () {
            let tm = tm_scs();
            let snapshot = tm.engine.initialSnapshot(tm, '');
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[@]@');
        });
    });


    context('initial snapshot multitape', function () {
        it('TM starts with one selected state', function () {
            let tm = tmTwoTapes();
            let inputStr = 'aBb';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            expect(snapshot.input[0]).to.equal(inputStr);
            expect(snapshot.numCharsProcessed[0]).to.equal(0);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[a]Bb\n@[@]@');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(tm.states[0])).to.equal('');
            for (let i = 1; i < tm.states.length; ++i) {
                expect(snapshot.selectedStates.get(tm.states[i])).to.be.undefined;
            }
        });
    });


    context('snapshot transition', function () {
        it('TM transition succeeds', function () {
            let tm = tmUpperCase();
            let inputStr = 'aAb';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            snapshot = tm.engine.step(tm, snapshot);
            expect(snapshot.input[0]).to.equal('AAb');
            expect(snapshot.numCharsProcessed[0]).to.equal(1);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('A[A]b');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(tm.states[0])).equal('');
            expect(snapshot.selectedStates.get(tm.states[1])).to.be.undefined;
            expect(tm.engine.stopped(snapshot)).to.be.false;
        });
        it('TM transition fails', function () {
            let tm = tmUpperCase();
            let inputStr = '1011';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            snapshot = tm.engine.step(tm, snapshot);
            expect(snapshot.input[0]).to.equal(inputStr);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('@[1]011');
            expect(snapshot.selectedStates.size).to.equal(0);
            expect(snapshot.selectedStates.get(tm.states[0])).to.be.undefined;
            expect(snapshot.selectedStates.get(tm.states[1])).to.be.undefined;
            expect(tm.engine.stopped(snapshot)).to.be.true;
            expect(tm.engine.accepted(snapshot)).to.be.false;
        });
        it('multi-tape transition succeeds', function () {
            let tm = tmTwoTapes();
            let inputStr = 'aAb';
            let snapshot = tm.engine.initialSnapshot(tm, inputStr);
            snapshot = tm.engine.step(tm, snapshot);
            expect(snapshot.input[0]).to.equal('AAb');
            expect(snapshot.numCharsProcessed[0]).to.equal(1);
            expect(tm.engine.inputPortrayal(snapshot)).to.equal('A[A]b\n@[@]a');
            expect(snapshot.selectedStates.size).to.equal(1);
            expect(snapshot.selectedStates.get(tm.states[0])).equal('');
            expect(snapshot.selectedStates.get(tm.states[1])).to.be.undefined;
            expect(tm.engine.stopped(snapshot)).to.be.false;
        });
        it('TMs can time-out', function () {
            let tm = new Automaton('Instructor', '', new TMEngine());
            tm.addState('0');
            tm.addState('1');
            tm.states[0].initial = true;
            tm.states[1].final = true;
            tm.addTransition('0', '0', '~/~,S');
            let snapshot = tm.engine.initialSnapshot(tm, '0');
            expect(tm.engine.stopped(snapshot)).to.be.false;
            for (let i = 0; i < TMEngine.executionLimit; ++i) {
                snapshot = tm.engine.step(tm, snapshot);
                expect(tm.engine.stopped(snapshot)).to.be.false;
            }
            snapshot = tm.engine.step(tm, snapshot);
            expect(tm.engine.stopped(snapshot)).to.be.true;
        });


    });

});
