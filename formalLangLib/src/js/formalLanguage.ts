import LZUTF8 from "lzutf8";

export
class SampleResults {
    constructor() {
        this.acceptedPassed = [];
        this.acceptedFailed = [];
        this.expected = [];
        this.actual = [];
        this.rejected = [];
    }

    acceptedPassed: string[]; // accepted input, output is correct
    acceptedFailed: string[]; // accepted input, output incorrect
    expected: string[];       // expected output value for acceptedFailed case
    actual: string[];         // actual output value for acceptedFailed case
    rejected: string[];       // rejected input
}

export
class TestResult {
    constructor(passed: boolean, output: string | null) {
        this.passed = passed;
        this.output = output;
    }

    passed: boolean;
    output: string | null;
}

export 
class ValidationResult {
    constructor(warnings: string, errors: string) {
        this.warnings = warnings;
        this.errors = errors;
    }

    warnings: string;
    errors: string;
}

/**
 * FormalLanguage
 * 
 * A description of a formal language. Descriptions take the form of
 * 1) an automaton, 
 * 2) a grammar (with a sample derivation), or 
 * 3) a regular expression.
 */
export
class FormalLanguage {
    constructor(user: string, problem: string) {
        this.specification = "unspecified";
        this.createdBy = user;
        this.unlock = "";
        this.problemID = problem;
    }

    specification: string;
    createdBy: string;
    problemID: string;
    unlock: string;

    static epsilon: string = '\u03F5';
    static box: string = '\u25FB';
    static selected: string = '\u2302';

    clear() {

    }

    saveJSon(jsonObj: any) {
        jsonObj.specification = this.specification;
        jsonObj.createdBy = this.createdBy;
        jsonObj.problemID = this.problemID;
        jsonObj.unlock = this.unlock;
    }

    fromJSon(jsonObj: any) {
        this.createdBy = jsonObj.createdBy;
        this.problemID = jsonObj.problemID;
        this.unlock = jsonObj.unlock;
    }

    encodeLanguage() {
          let jsonObj = {};
          this.saveJSon(jsonObj);
          let json = JSON.stringify(jsonObj);
          let encoded = LZUTF8.compress(json, { outputEncoding: "Base64" });
          return encoded;
      }
    
    canBeCheckedForEquivalence() {
          return true;
    }

    producesOutput() {
        return true;
    }

    equivalentTo(other: FormalLanguage) {
        return false;
    }

    testOnSamplesWithOutput (samples: string[], expected: string[]): SampleResults {
        let results = new SampleResults();
        for (let i = 0; i < samples.length; ++i) {
            let testResult = this.test(samples[i]);
            if (testResult.passed) {
                if (this.producesOutput() && i <= expected.length ) {
                    if (expected[i] === testResult.output) {
                        results.acceptedPassed.push(samples[i]);
                    } else {
                        results.acceptedFailed.push(samples[i])
                        results.expected.push(expected[i]);
                        let actualOut = testResult.output as string;
                        results.actual.push(actualOut);
                    }
                } else {
                    results.acceptedPassed.push(samples[i]);
                }
            } else {
                results.rejected.push(samples[i]);
            }
        }
        return results;
    }


    testOnSamples (samples: string[]): SampleResults {
        let results = new SampleResults();
        for (let i = 0; i < samples.length; ++i) {
            let testResult = this.test(samples[i]);
            if (testResult.passed) {
                results.acceptedPassed.push(samples[i])
            } else {
                results.rejected.push(samples[i]);
            }
        }
        return results;
    }



    test (sample: string): TestResult {
        return new TestResult(sample.length % 2 == 0, "");
    }

    validate(): ValidationResult {
        return new ValidationResult("", "");
    }

}

