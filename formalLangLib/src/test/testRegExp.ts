import { RegularExpression } from '../js/regularExpression';
import { expect } from 'chai';
import { describe, it} from 'mocha';


describe('RegExp', function() {
  describe('producesOutput', function() {
    it('should return false', function() {
      let re = new RegularExpression("Instructor", "");
      expect (re.producesOutput()).to.be.false;
    });
  });
  describe('validation', function() {
    it('should say ab*(c+@)d is valid', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.validate().errors).to.equal('');
    });
    it('should say ab*(c|e)d is invalid', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c|e)d';
      expect (re.validate().errors).to.not.equal('');
    });
  });
  describe('matching', function() {
    it('should say ab*(c+@)d matches abbd', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('abbd').passed).to.be.true;
    });
    it('should say ab*(c+@)d matches acd', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('acd').passed).to.be.true;
    });
    it('should say ab*(c+@)d matches ad', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('ad').passed).to.be.true;
    });
    it('should say ab*(c+@)d does not match abdd', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('abdd').passed).to.be.false;
    });
    it('should say ab*(c+@)d does not match dab', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('dab').passed).to.be.false;
    });
    it('should say ab*(c+@)d does not match the empty string', function() {
      let re = new RegularExpression("Instructor", "");
      re.regexp = 'ab*(c+@)d';
      expect (re.test('').passed).to.be.false;
    });
});
});