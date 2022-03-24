title=Turing Machines
type=page
manual=student
sequence=C
next=tmTesting
prev=pdaTesting
status=published
~~~~~~
## Creating a new Automaton

<img src='images/newLanguagesMenu.png' style='float: right;'/>

To create a new Turing machine, look for the list of possible formal language types and click on `Turing Machine`.

You will see a split screen with a drawing area on the left and an editing area to the right.

## Creating & Editing States

The procedure for creating and editing states is the same as for [finite automata](creatinganAFA.html).


## Creating & Editing Transitions


<img src='images/tmTransition.png' style='float: right;'/>

The procedure for creating and editing states is very similar to  the procedure for [finite automata](creatinganAFA.html).

The difference is the format of the label. Each transition label has the form

_input_/_output_`,`_direction_

where

* _input_ is a single input character to be matched from the tape. This may be any alphanumeric.
* _output_ is the character to be written to the tape, replacing the matched input. 
* _direction_ is one of 'L', 'R', or 'S', indicating that the tape head should shift one position to the Left, one position to the Right, or stay Stationary.

Shortcuts are also available:
            
* `@` denotes an empty cell.
* `!x`, in the _input_ or _top_, means "any character except x".
*  ~ means "any character" when occurring in the _input_, and 
     means "same as the input character" in the _top_ or the _push_ strings.
* `a,b, ...}v`, in the input, means to match any of the possible input characters on the left of the '}', storing the matched character in a "variable" 'v'.    
    * The variable name can be any alphabetic character not used in the TM alphabet.
    * Any subsequent mentions of that variable name in input or output of other transitions will be replaced by the stored character.



