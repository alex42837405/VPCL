# Language Construct Misconceptions

Language construct misconceptions have been one of the major causes of programming errors. Most of these errors can be categorized into two types.

## Type 1: Improper Translation

The programmer's improper translation of natural language expressions into computer programming language, such as the substitution of and for or, and while for if or vice versa.

Example of incorrect logic:

if (temp < 0 && temp > 100)
    print("system shut down");

This example is not correct since the temperature cannot be less than 0 and greater than 100 at the same time.

While instead of if:

while ((c = getchar()) != EOF)
    while (c != NEWLINE)
        nc++;

## Type 2: Arcane Notations

The programmer's misconception caused by arcane or arbitrary notations used in language design such as selection of operators, keywords, data types, etc.

C language assignment vs equality:

In the C language the operator == is used for the equality test while the operator = is used for assignment. When tested, any value in C, except zero, is considered to be true.

if (A = B)
    print("Both are equal");
else
    print("not equal");

The value of A will be false if B is zero; otherwise A will be true.

## Integer Division Issues

Due to the way integer division is handled in C, FORTRAN and other languages, the following Fahrenheit to Celsius formula, C = 5 / 9 * (F - 32), will be equal to zero (5 / 9 = 0).

## VPCL Solution

To eliminate some of the language construct misconceptions, VPCL provides assistance through a library of constructs with various examples related to common problems.