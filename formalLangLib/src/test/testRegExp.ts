import { RegularExpression } from '../js/regularExpression';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Automaton } from '../js/automaton';
import { FAEngine } from '../js/FAEngine';


describe('RegExp', function () {
  describe('producesOutput', function () {
    it('should return false', function () {
      let re = new RegularExpression("Instructor", "");
      expect(re.producesOutput()).to.be.false;
    });
  });
  describe('validation', function () {
    it('should say ab*(c+@)d is valid', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.validate().errors).to.equal('');
    });
    it('should say ab*(c|e)d is invalid', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c|e)d';
      expect(re.validate().errors).to.not.equal('');
    });
    it('should say a*+b* is valid', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'a*+b*';
      expect(re.validate().errors).to.equal('');
    });
  });
  describe('matching', function () {
    it('should say ab*(c+@)d matches abbd', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('abbd').passed).to.be.true;
    });
    it('should say ab*(c+@)d matches acd', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('acd').passed).to.be.true;
    });
    it('should say ab*(c+@)d matches ad', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('ad').passed).to.be.true;
    });
    it('should say ab*(c+@)d does not match abdd', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('abdd').passed).to.be.false;
    });
    it('should say ab*(c+@)d does not match dab', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('dab').passed).to.be.false;
    });
    it('should say ab*(c+@)d does not match the empty string', function () {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect(re.test('').passed).to.be.false;
    });
  });
  describe('RE comparisons', function () {
    it('should say ab*c is equal to a(b+@)*c', function () {
      let re1 = new RegularExpression("Instructor", "");
      re1.regexp = 'ab*c';
      let re2 = new RegularExpression("Instructor", "");
      re2.regexp = 'a(b+@)*c';
      expect(re1.canBeCheckedForEquivalence()).to.be.true;
      expect(re1.equivalentTo(re2)).to.be.true;
      expect(re2.equivalentTo(re1)).to.be.true;
    });
    it('should say abb*c is not equal to a(b+@)*c', function () {
      let re1 = new RegularExpression("Instructor", "");
      re1.regexp = 'abb*c';
      let nfa1 = re1.parse(re1.regexp);
      expect (nfa1.test('abc').passed).to.be.true;
      expect (nfa1.test('ac').passed).to.be.false;
      let re2 = new RegularExpression("Instructor", "");
      re2.regexp ='a(b+@)*c';
      expect(re1.canBeCheckedForEquivalence()).to.be.true;
      expect(re1.equivalentTo(re2)).to.be.false;
      expect(re2.equivalentTo(re1)).to.be.false;
    });

    describe('RE parsing', function () {
      it('can parse concatenation', function () {
        let re = new RegularExpression("Instructor", "");
        re.regexp = "abc";
        let fa1 = re.parse(re.regexp);
        let fa2 = new Automaton("Instructor", "", new FAEngine());
        fa2.addState('0');
        fa2.addState('1');
        fa2.addState('2');
        fa2.addState('3');
        fa2.states[0].initial = true;
        fa2.states[3].final = true;
        fa2.addTransition('0', '1', 'a');
        fa2.addTransition('1', '2', 'b');
        fa2.addTransition('2', '3', 'c');
        expect(fa1.equivalentTo(fa2)).to.be.true;
      });
      it('can parse union', function () {
        let re = new RegularExpression("Instructor", "");
        re.regexp = "a+b";
        let fa1 = re.parse(re.regexp);
        let fa2 = new Automaton("Instructor", "", new FAEngine());
        fa2.addState('0');
        fa2.addState('1');
        fa2.addState('2');
        fa2.states[0].initial = true;
        fa2.states[1].final = true;
        fa2.states[2].final = true;
        fa2.addTransition('0', '1', 'a');
        fa2.addTransition('0', '2', 'b');
        expect(fa1.equivalentTo(fa2)).to.be.true;
      });
      it('can parse closure', function () {
        let re = new RegularExpression("Instructor", "");
        re.regexp = "(a+b)*";
        let fa1 = re.parse(re.regexp);
        let fa2 = new Automaton("Instructor", "", new FAEngine());
        fa2.addState('0');
        fa2.states[0].initial = true;
        fa2.states[0].final = true;
        fa2.addTransition('0', '0', 'a');
        fa2.addTransition('0', '0', 'b');
        expect(fa1.equivalentTo(fa2)).to.be.true;
      });
    });
 
  });

});