// <!-- Copyright (C) 2017 Richard David Fuhr - All rights reserved. -->
// <!-- richard.fuhr@gmail.com -->

// The code here is based on the Objective-C code in /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage
// We plan to put all of the corresponding TypeScript code into one file, at least initially.

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
function pvOfOrdinaryAnnuityWithPeriodicInterestRate(i : number, 
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
       pv = (1.0 - v_to_the_n)/i; // standard formual for present value of annuity 
    }  //   end normal case with positive interest rate

    return pv;
}                                                     