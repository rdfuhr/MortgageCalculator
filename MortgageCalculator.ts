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
    var n : number = 1; // the iteration counter
    var c : number; // will be used as the midpoint of the current interval [a,b]
    while (n <= NMAX)
    {   // begin while (n <= NMAX)
        c = (a + b)/2.0; // the midpoint of the current interval [a,b]
        if ( (f(c)==0.0) || ( (b-a)/2.0 < TOL) )
        {
           root = c; // we have found a root, to within tolerance
           break; // get out of the while loop
        }
    }   //   end while (n <= NMAX)
    n = n + 1; // increment the iteration counter

    // Decide how to construct the next interval [a,b]
    if ( sign(f(c))==sign(f(a)) )
    {
        a = c;
    }
    else
    {
        b = c;
    }
    
    return root;
}

function sign(t : number) : number
{
    var signVal : number;
    if (t < 0)
    {
        signVal = -1;
    }
    else
    if (t > 0)
    {
        signVal = 1;
    }
    else
    {
        signVal = 0;
    }
    return signVal;
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

    computeAnnualInterestRateAsAPercent() : number
    {
        var i : number = -1;
        const TOL : number = 0.000001;
        const NMAX : number = 100;
        var a : number = 0.0;
        var b : number = 100.0;
        i = findRootUsingBisection(a, b, this.initialLoanMinusLoanAsAFunctionOfMonthlyRate, TOL, NMAX);
        return i;
    }

    initialLoanMinusLoanAsAFunctionOfMonthlyRate(i : number) : number
    {
        var j : number = i/1200; // note, we convert i to j and only use j below
        var L : number = this.initialLoan;
        var n : number = this.numberOfYears*12;
        var a : number = pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(j, n); // Note, we use the converted value j obtained from i
        var P : number = this.monthlyPayment;
        return L - P*a;
    }


}   //   end class Mortgage

// http://www.moneychimp.com/calculator/mortgage_calculator.htm
// http://www.bankrate.com/calculators/mortgages/mortgage-calculator-b.aspx
// http://www.calculator.com/pantaserv/mortgage_s.calc
// https://www.elend.com/calculators/mortgage-loan-calculator/

function testComputeMonthlyPayment()
{
    document.writeln("<p>Entering testComputeMonthlyPayment()</p>");
    var initialLoan : number = 200000;
    var annualInterestRateAsAPercent : number = 3.5;
    var numberOfYears : number = 30.0;

    document.writeln("<p>initialLoan = " + initialLoan.toString() + "</p>");
    document.writeln("<p>annualInterestRateAsAPercent = " + annualInterestRateAsAPercent.toString() + "</p>");
    document.writeln("<p>numberOfYears = " + numberOfYears.toString() + "</p>");
    
   
    var M : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, numberOfYears, -1);
    var monthlyPayment : number = M.computeMonthlyPayment();

    document.writeln("<p>monthlyPayment = " + monthlyPayment.toString() + "</p>");
    
    document.writeln("<p>Leaving testComputeMonthlyPayment()</p>");
}

function testComputeInitialLoan()
{
    document.writeln("<p>Entering testComputeInitialLoan()</p>");
    
    var annualInterestRateAsAPercent : number = 3.5;
    var numberOfYears : number = 30.0;
    var monthlyPayment : number = 898.0893756176412; // we are putting it in very precisely
    
    document.writeln("<p>annualInterestRateAsAPercent = " + annualInterestRateAsAPercent.toString() + "</p>");
    document.writeln("<p>numberOfYears = " + numberOfYears.toString() + "</p>");
    document.writeln("<p>monthlyPayment = " + monthlyPayment.toString() + "</p>");
   
    var M : Mortgage = new Mortgage(-1, annualInterestRateAsAPercent, numberOfYears, monthlyPayment);
    var initialLoan : number = M.computeInitialLoan();

    document.writeln("<p>initialLoan = " + initialLoan.toString() + "</p>");
    
    document.writeln("<p>Leaving testComputeInitialLoan()</p>");
}


function doTests()
{
    document.writeln("<p>Entering doTests()</p>");
    testComputeMonthlyPayment();
    testComputeInitialLoan();
    document.writeln("<p>Leaving doTests()</p>");
}

//   End implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Mortgage.m
