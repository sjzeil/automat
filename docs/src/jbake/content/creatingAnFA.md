title=Creating and Editing an FA
type=page
manual=student
sequence=1
next=savingYourWork
prev=studentsManual
status=published
~~~~~~
## Creating a new FA

<img src='images/newLanguagesMenu.png' style='float: right;'/>

To create a new Finite Automaton, look for the list of possible formal language types and click on `Finite Automaton`.

You will see a split screen with a drawing area on the left and an editing area to the right.

![](images/newFALayout.png)

You can now build your new automaton by adding states and then adding transitions between them.

## Creating States

To create a new automaton state, click the `+State` button and then click in the drawing area to indicate where you would like the state to be placed. 

By default, states are give numeric labels, with the number increasing for each new state.

<img src='images/stateEdit.png' style='float: right;'/>

Once you have placed your state, you can use the controls in the editing area to:

* Change the state's label. 
* Mark the state as the initial state for the automaton.
* Mark the state as a final (a.k.a. accepting) state.
* Delete the state.


### Editing States

Click on any state in the drawing area to edit that state.

You can move a state in the drawing area by clicking on it and dragging it to a new position.

If the drawing area is getting too crowded:

* While holding down the Alt key, click and drag anywhere in the drawing area to shift the drawing area sideways or up-and-down.
* Use the mouse wheel while the mouse is positioned in the drawing area to zoom in and out.








## Creating Transitions

To create a new transition, click the `+Transition` button.

You will then be prompted to click (in the drawing area) on the source state for the transition and then to click on the destination state.   

> The destination and source states may be different states or the same state, whichever you need.

If there is no arrow connecting the two states, an arrow will be added and you will then be permitted to edit
transition rules defining transitions between those two states.

<img src='images/transitionEdit.png' style='float: right;'/>

The transition rules between two states are shown as a vertical stack of trigger characters, each indicating a single alphanumeric character that, if it appears in the input, would cause a transition from the source state to the destination state.

In the editing area to the right, you can see the same stack of characters. The controls allow you to manipulate this stack. You can:

* Add a new transition rule by typing a character in the `Transition:` box and clicking `Add`.
* Replace a new transition rule by selecting it in the stack, typing a character in the `Transition:` box and clicking `Replace`.
* Remove an existing transition rule by selecting it in the stack and clicking `Remove`.
* Move the selected character up and down in the stack. This is for esthetic purposes only -- it has no effect on the behavior of the automaton.

### Editing an Existing Transition

To select an existing transition for editing, click on the _text stack_ attached to the arrow.

### Special Rules in Transitions

The editor supports three special rules for transitions in finite automata:

1. The @ symbol can be typed to indicate <span>&epsilon;</span>, the empty string.
2. The ~ character can be used to indicate that any single alphanumeric character will be matched.
3. The ! character can be placed in front of an alphanumeric character to indicate that the transition will occur on any character _except_ that one. For example, `!0` would match any alphanumeric character except `0`.




