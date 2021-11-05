


/**
 * A state within an automaton
 */
export
 class AutomatonState  {

    constructor (label: string) {
        this.label = label;
        this.selected = false;
        this.initial = false;
        this.final = false;
        this.annotation = "";
        this.x = 100;
        this.y = 100;
    }

	label: string;
	selected: boolean;
	initial: boolean;
	final: boolean;
	annotation: string;
    x: number;
    y: number;

    
}

