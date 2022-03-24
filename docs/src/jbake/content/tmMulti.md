title=Multi-tape Turing Machines
type=page
manual=student
sequence=E
next=
prev=tmTesting
status=published
~~~~~~
## Creating and Editing Multi-tape TMs

<img src='images/tmMultitape.png' style='float: right;'/>

Multi-tape TMs are created and edited in the same manner as single-tape TMs.  Simply provide as many input characters, output characters, and directions as you have tapes.

* For example, in this TM, there is a transition from state 0 to state 0 when the input on tape 1 is '0' and the input on tape 2 is '<span>&epsilon;</span>'.  In that case, a '0' is written to tape 1, an 'a' is written to tape 2, and then both tape heads are shifter to the right.
* All transitions in a TM must indicate the same number of tapes.

## Testing a Multi-tape TM

<img src='images/tmTestingMultitape.png' style='float: right;'/>

Testing a multi-tape TM is similar to testing a single-tape TM. However, the testing area will display all of the tapes, each on a separate line.

