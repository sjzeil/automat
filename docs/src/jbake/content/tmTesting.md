title=Testing a Turing machine
type=page
manual=student
sequence=D
next=tmMulti
prev=tm
status=published
~~~~~~


Below the main editing area for your TM, you can see the testing area:


1. Type any alphanumeric string into the "Input text:" box, and click on Start.

2. Advance the execution one character at a time by using the `Step` button, or run it on the entire input string using `Finish`.

    <img src='images/tmTesting.png' style='float: right;'/>

3. In the drawing area, the currently active state will be highlighted, and a small marker will appear beneath it.
   
4. In the testing area, Below the input, you will see the tape(s)
associated with the current state. 

    * The current position of the tape head is indicated by bracketing the cell within `[ ]`.
    * Not shown is the infinite number of empty cells stretching off from either end of the portion of the tape being displayed.
        * However, if the tape head moves to either end of the range of non-empty cells, an empty cell will be shown on the appropriate side to amek clear the the TM head can move into that cell, if desired.

    For example, this TM, given the initial input 00011100, has replaced the first '0' with an 'x' and then moved the head right to the second character.
