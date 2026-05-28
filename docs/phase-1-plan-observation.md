# Phase 1: Plan Observation

This phase of VPCL is an automatic animated process, illustrating the steps involved in programming from the initial specification of the problem to the final execution of the program with data.

## Activation

VPCL starts with a screen displaying the plan library shown as a bookshelf where every book is assigned to a plan for a programming task. In order to activate a plan in this phase, both the desired plan and the phase 1 button must be clicked one after the other using a mouse.

After the selection has been made, VPCL starts its journey. It demonstrates the plan composition of the problem where plan relationships can be seen. Embedded plans are further decomposed. When there is no further plan decomposition, the code for each of the plans is generated and displayed in the chosen programming language. Later, these plans are integrated one by one to form the complete program. After the program has been generated, animation of the program's execution is shown.

## Selection Sort Example

Phase 1 of VPCL choosing the selection sort of the sort plan from the plan library. This sort orders a series of numbers by finding the smallest number and placing it at the beginning (the sorted place). The same process is repeated with the rest of the numbers until all numbers are sorted.

### Plan Activation

Sort plan and phase 1 are highlighted from the plan library by clicking the mouse. A window is displayed with the following sorts currently available: Selection, Exchange, ExSel (combined exchange selection) and Insertion.

### Plan Decomposition

The Selection Sort is decomposed into the following plans:

1. Input plan - gets the data
2. Loop select smallest and exchange plan (LSSE) - finds the location of the smallest value and exchanges it
3. Output plan - prints the sorted output

Since LSSE consists of embedded plans, it is further decomposed into:
- Loop plan
- Select smallest plan
- Exchange plan

### Visual Execution Indicators

Three arrows known as indicators are used:

- Pass indicator (upper arrow): Points to the starting location of the unsorted data
- Smallest indicator (lower arrow): Points to the smallest number in the unsorted data
- Scan indicator (pointing hand): Shows the number being compared to the previous smallest value

The Pass indicator advances after the completion of each pass. All data to the left of the Pass indicator is sorted and shown as highlighted boxes.