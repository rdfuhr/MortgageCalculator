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

function findRootUsingBisection(a : number, // lower bound of interval containing root
                                b : number, // upper bound of interval containing root
                                f : (x : number)=>number, // function whose root is to be found
                                TOL : number, // tolerance for finding root
                                NMAX : number, // maximum number of iterations
                                ) : number // an approximation for the root
{
    var root : number = a - 1; // initialize to error code
    return root;
}

//   End implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Utilities.m

// Begin implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Mortgage.m

class Mortgage
{   // Begin class Mortgage
    initialLoan : number;
    annualInterestRateAsAPercent : number;
    numberOfYears : number;
    monthlyPayment : number;

    constructor(initialLoan : number,
                annualInterestRateAsAPercent : number,
                numberOfYears : number,
                monthlyPayment : number)
    {
        this.initialLoan = initialLoan;
        this.annualInterestRateAsAPercent = annualInterestRateAsAPercent;
        this.numberOfYears = numberOfYears;
        this.monthlyPayment = monthlyPayment;
    }

    computeMonthlyPayment() : number
    {
        var L : number = this.initialLoan;
        var i : number = this.annualInterestRateAsAPercent/1200;
        var n : number = this.numberOfYears*12;
        var a : number = pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(i, n);
        var P : number = L/a;
        this.monthlyPayment = P;
        return P;
    }

    computeInitialLoan() : number
    {
        var i : number = this.annualInterestRateAsAPercent/1200;
        var n : number = this.numberOfYears*12;
        var P : number = this.monthlyPayment;
        var a : number = pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(i, n);
        var L : number = P*a;
        this.initialLoan = L;
        return L;
    }
    
    computeNumberOfMonths() : number
    {
        var i : number = this.annualInterestRateAsAPercent/1200;
        var P : number = this.monthlyPayment;
        var L : number = this.initialLoan;
        var B : number = L; // B is the outstanding balance, which initially is L
        var n : number = 0; // n is the number of payments, which initially is 0
        while (B > 0) // As long as B > 0 we have to make another monthly payment
        {
            // Apply one-month's interest to increase the outstanding balance
            B = B + i*B;

            // Subtract one monthly payment to decrease the outstanding balance
            B = B - P;

            // Increase the number of payments made by 1
            n = n + 1;
        }
        return n;
    }


}   //   end class Mortgage

//   End implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Mortgage.m
