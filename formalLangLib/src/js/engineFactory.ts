import { AutomatonEngine } from "./automatonEngine";
import { FAEngine } from "./FAEngine";

export class EngineFactory {

    static newEngine(specification: string): AutomatonEngine {
        if (specification == 'automatonFA') {
            return new FAEngine();
        } else {
            return new FAEngine();
        }
    }
}