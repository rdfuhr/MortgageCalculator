// <!-- Copyright (C) 2017 Richard David Fuhr - All rights reserved. -->
// <!-- richard.fuhr@gmail.com -->

// The code here is based on the Objective-C code in /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage
// We plan to put all of the corresponding TypeScript code into one file, at least initially.

// Begin implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Utilities.m

////////////////////////////////////////////////////////////////////////////////
//
// This method returns the present value of an ordinary annuity with payments
// of 1.0 made at the end of each period for n periods assuming an interest
// rate of i per period.  Here i should be a number between 0 and (reasonably) 1.
// Thus, if the rate per period is 1% we would set i = 0.01
//
// See http://en.wikipedia.org/wiki/Actuarial_notation for more information
//
// In this article it is referred to as an "annuity-immediate".
//
// Input i - the interest rate, expressed as a number between (normally) 0 and 1
// Input n - the number of periods
//
// Returns - the present value of an ordinary annuity with payments of 1.0
// made at the end of each period for n periods assuming an interest rate
// of i per period.
//
////////////////////////////////////////////////////////////////////////////////
function pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(i : number, 
                                                                       n : number) : number
{
    var pv : number;
    
    if (i < 0.0)
    {   // special handling for negative interest rate
        pv = 0.0;
    }
    else 
    if (i==0.0)
    {   // special handling for zero interest rate
        pv = n;
    }
    else
    {  // begin normal case with positive interest rate
       var v : number = 1.0/(1 + i); // standard actuarial notation
       var v_to_the_n = Math.pow(v, n);
       pv = (1.0 - v_to_the_n)/i; // standard formula for present value of annuity 
    }  //   end normal case with positive interest rate

    return pv;
}   

////////////////////////////////////////////////////////////////////////////////
//
// This is a special-purpose method that takes a double and rounds it up to the
// next-highest .01 .  We could have probably done the same thing using
// the foundation method called NSDecimalNumber, and, in fact, maybe we will
// do that in a future release of this function.
//
// Input x - the number to be rounded up to the next-highest .01
//
// Returns - a number that is obtained when x is rounded up to the next-highest .01
//
////////////////////////////////////////////////////////////////////////////////
function roundUp(x : number) : number
{
    var y1 : number = 100.0*x;
    var y2 : number = Math.ceil(y1);
    var y3 = y2/100.0;
    return y3;
}

////////////////////////////////////////////////////////////////////////////////
//
// This function returns YES if the input string s consists of all blanks.
// It will also return YES if the input string is of length zero.
//
// Input s - the string to be analyzed
//
// Returns - true if s consists of all blank characters, false otherwise.
////////////////////////////////////////////////////////////////////////////////
function isBlankString(s : string) : boolean
{
    var isBlank : boolean = true;
    var length : number = s.length;
    var blankChar : string = " ";
    for (var i : number = 0; i < length; i++)
    {   // begin i-loop
        if (s.charAt[i] != blankChar)
        {
            isBlank = false;
            break;
        }
    }   //   end i-loop
    return isBlank;
}

//   End implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Utilities.m
