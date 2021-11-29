import { FAEngine } from '../js/FAEngine';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';


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

});