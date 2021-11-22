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
    context('valid grammar', function () {
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
    context('split', function () {
        let gr = new Grammar('Instructor', '');
        let result = gr.splitAtFirstNonTermal('abQcd');
        it ('should be ab', function() {
            expect(result.left).to.equal('ab');
        });
        it ('should be Q', function() {
            expect(result.middle).to.equal('Q');
        });
        it ('should be cd', function() {
            expect(result.right).to.equal('cd');
        });
    });
    context('split2', function () {
        let gr = new Grammar('Instructor', '');
        let result = gr.splitAtFirstNonTermal('Qcd');
        it ('should be empty', function() {
            expect(result.left).to.equal('');
        });
        it ('should be Q', function() {
            expect(result.middle).to.equal('Q');
        });
        it ('should be cd', function() {
            expect(result.right).to.equal('cd');
        });
    });
    context('split3', function () {
        let gr = new Grammar('Instructor', '');
        let result = gr.splitAtFirstNonTermal('abQ');
        it ('should be ab', function() {
            expect(result.left).to.equal('ab');
        });
        it ('should be Q', function() {
            expect(result.middle).to.equal('Q');
        });
        it ('should be empty', function() {
            expect(result.right).to.equal('');
        });
    });
    context('mightDerive', function () {
        let gr = new Grammar('Instructor', '');
        it ('AAB might derive ab', function() {
            expect(gr.mightDerive('AAB', 'ab')).to.be.true;
        });
        it ('ABb might derive ab', function() {
            expect(gr.mightDerive('ABb', 'ab')).to.be.true;
        });
        it ('AbBaA connot derive ab', function() {
            expect(gr.mightDerive('AbBaA', 'ab')).to.be.false;
        });
});

    context('parsing', function () {
        let gr = new Grammar('Instructor', '');
        let productions = [
            'S=AB',
            'A=aA',
            'A=c',
            'B=bB',
            'B=b'
        ];
        addProductions(gr, productions);
        it('should accept aacbb', function() {
            expect(gr.test('aacbb').passed).to.be.true;
        });
        it('should reject bbaac', function() {
            expect(gr.test('bbaac').passed).to.be.false;
        });
    });
});