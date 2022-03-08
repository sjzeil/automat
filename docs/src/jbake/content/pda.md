title=Pushdown Automata
type=page
manual=student
sequence=A
next=pdaTesting
prev=derivations
status=published
~~~~~~
## Creating a new Automaton

<img src='images/newLanguagesMenu.png' style='float: right;'/>

To create a new pushdown automaton, look for the list of possible formal language types and click on `Push-Down Automaton`.

You will see a split screen with a drawing area on the left and an editing area to the right.

## Creating & Editing States

The procedure for creating and editing states is the same as for [finite automata](creatinganAFA.html).


## Creating & Editing Transitions


<img src='images/pdaTransition.png' style='float: right;'/>

The procedure for creating and editing states is very similar to  the procedure for [finite automata](creatinganAFA.html).

The difference is the format of the label. Each transition label has the form

_input_`,`_top_/_push_

where

* _input_ is a single input character, which may be any alphanumeric except 'Z'. By tradition, only numbers and lower-case numbers are used for the input.
* _top_ is the character to be matched on the top of the stack. These may be any alphanumeric character.
* _push_ is the _string_ of characters to be pushed onto the top of the stack after _top_ has been removed.

Shortcuts are also available:
            
* `@` denotes the empty string.
* `!x`, in the _input_ or _top_, means "any character except x".
*  ~ means "any character" when occurring in the _input_, and 
     means "same as the input character" in the _top_ or the _push_ strings.



