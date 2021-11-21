import { Grammar, Production } from '../js/grammar';
import { expect } from 'chai';
import { describe, it } from 'mocha';

function addProductions (gr: Grammar, prod: string[]) {
    prod.forEach(
        p => {
            let parts = p.split('=');
            gr.addProduction({
                lhs: parts[0], 
                rhs: parts[1]
            });
        }
    );
}

describe('Grammar', function () {
    context('producesOutput', function () {
        it('should return false', function () {
            let gr = new Grammar("Instructor", "");
            expect(gr.producesOutput()).to.be.false;
        });
    });
    context('validation', function () {
        let gr = new Grammar('Instructor', '');
        let productions = [
            'S=SA',
            'S=',
            'A=a'
        ];
        addProductions(gr, productions);
        it('should say this is valid', function() {
            expect(gr.validate().errors).is.equal("");
        });
    });
    context('invalid LHS', function () {
        let gr = new Grammar('Instructor', '');
        let productions = [
            'SA=A',
            'S=',
            'A=a'
        ];
        addProductions(gr, productions);
        it('should say this is invalid', function() {
            expect(gr.validate().errors).is.not.equal("");
        });
    });
    context('invalid LHS', function () {
        let gr = new Grammar('Instructor', '');
        let productions = [
            'S=SA',
            'S=',
            'b=a'
        ];
        addProductions(gr, productions);
        it('should say this is invalid', function() {
            expect(gr.validate().errors).is.not.equal("");
        });
    });
    context('invalid RHS', function () {
        let gr = new Grammar('Instructor', '');
        let productions = [
            'S=AS',
            'S=\n',
            'A=a'
        ];
        addProductions(gr, productions);
        it('should say this is invalid', function() {
            expect(gr.validate().errors).is.not.equal("");
        });
    });
    context('matching', function () {
    });
});