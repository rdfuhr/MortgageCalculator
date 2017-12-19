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
                                f : (x : number, data : any)=>number, // function whose root is to be found
                                data : any, // the data associated with the function
                                TOL : number, // tolerance for finding root
                                NMAX : number, // maximum number of iterations
                                ) : number // an approximation for the root
{
    var root : number = a - 1; // initialize to error code
    // check for invalid input and return if it is invalid
    if (sign(f(a, data))==sign(f(b, data)))
    {
        return root;
    }
    // Begin normal case in which for original a and b we have
    // sign(f(a, data)!=sign(f(b), data))
    var n : number = 1; // the iteration counter
    var c : number; // will be used as the midpoint of the current interval [a,b]
    while (n <= NMAX)
    {   // begin while (n <= NMAX)
        c = (a + b)/2.0; // the midpoint of the current interval [a,b]
        if ( (f(c, data)==0.0) || ( (b-a)/2.0 < TOL) )
        {
           root = c; // we have found a root, to within tolerance
           break; // get out of the while loop
        }
        n = n + 1;
        // Decide how to construct the next interval [a,b]
        if ( sign(f(c, data))==sign(f(a, data)) )
        {
           a = c;
        }
        else
        {
           b = c;
        }        
    }   //   end while (n <= NMAX)

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

enum SolveFor{Loan, Interest, Years, Payment}
var globalSolveFor : SolveFor;

enum MortgageParameters{Loan, Interest, Years, Payment, Time, ToInterest, ToPrincipal, RemainingPrincipal}

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
        i = findRootUsingBisection(a, b, initialLoanMinusLoanAsAFunctionOfMonthlyRate, this, TOL, NMAX);
        return i;
    }

    
}   //   end class Mortgage

function initialLoanMinusLoanAsAFunctionOfMonthlyRate(i : number, M : Mortgage) : number
{
    var j : number = i/1200; // note, we convert i to j and only use j below
    var L : number = M.initialLoan;
    var n : number = M.numberOfYears*12;
    var a : number = pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(j, n); // Note, we use the converted value j obtained from i
    var P : number = M.monthlyPayment;
    return L - P*a;
}

function UpdateGlobalSolveForBasedOnRadioButton()
{
    var possibleSolveFors : NodeListOf<HTMLElement> = document.getElementsByName('SolveFor');
    var n = possibleSolveFors.length
    for (let i : number = 0; i < n; i++)
    {
        var curItem : HTMLInputElement = <HTMLInputElement> possibleSolveFors[i];
        if (curItem.checked)
        {
            if (curItem.value=="Loan")
            {
                globalSolveFor = SolveFor.Loan;
                break;
            }
            else if (curItem.value=="Interest")
            {
                globalSolveFor = SolveFor.Interest;
                break;
            }
            else if (curItem.value=="Years")
            {
                globalSolveFor = SolveFor.Years;
                break;
            }
            else if (curItem.value=="Payment")
            {
                globalSolveFor = SolveFor.Payment;
                break;
            }
        }
    }
}

function UpdateTextInputFieldsBasedOnRadioButton()
{
    var txtInputLoan : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputLoan");
    var txtInputInterest : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputInterest");
    var txtInputYears : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputYears");
    var txtInputPayment : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputPayment");
    txtInputLoan.disabled = false;
    txtInputInterest.disabled = false;
    txtInputYears.disabled = false;
    txtInputPayment.disabled = false;
    txtInputLoan.style.fontStyle = "normal";
    txtInputInterest.style.fontStyle = "normal";
    txtInputYears.style.fontStyle = "normal";
    txtInputPayment.style.fontStyle = "normal";
    txtInputLoan.style.fontWeight = "normal";
    txtInputInterest.style.fontWeight = "normal";
    txtInputYears.style.fontWeight = "normal";
    txtInputPayment.style.fontWeight = "normal";
    txtInputLoan.style.color = "black";
    txtInputInterest.style.color = "black";
    txtInputYears.style.color = "black";
    txtInputPayment.style.color = "black";
   
    const ToBeComputed : string = "To be computed";
    if (txtInputLoan.value==ToBeComputed) txtInputLoan.value = ""; 
    if (txtInputInterest.value==ToBeComputed) txtInputInterest.value = ""; 
    if (txtInputYears.value==ToBeComputed) txtInputYears.value = ""; 
    if (txtInputPayment.value==ToBeComputed) txtInputPayment.value = "";

    var btnComputeLoan : HTMLInputElement = <HTMLInputElement>document.getElementById("btnComputeLoan");
    var btnComputeInterest : HTMLInputElement = <HTMLInputElement>document.getElementById("btnComputeInterest");
    var btnComputeYears : HTMLInputElement = <HTMLInputElement>document.getElementById("btnComputeYears");
    var btnComputePayment : HTMLInputElement = <HTMLInputElement>document.getElementById("btnComputePayment"); 
    
    btnComputeLoan.disabled=true;
    btnComputeInterest.disabled=true;
    btnComputeYears.disabled=true;
    btnComputePayment.disabled=true;

    var possibleSolveFors : NodeListOf<HTMLElement> = document.getElementsByName('SolveFor');
    var n = possibleSolveFors.length
    for (let i : number = 0; i < n; i++)
    {
        var curItem : HTMLInputElement = <HTMLInputElement> possibleSolveFors[i];
        if (curItem.checked)
        {
            if (curItem.value=="Loan")
            {
                txtInputLoan.disabled = true;
                txtInputLoan.value = ToBeComputed;
                txtInputLoan.style.fontStyle = "italic";
                txtInputLoan.style.fontWeight = "bold";
                txtInputLoan.style.color = "blue";
                btnComputeLoan.disabled=false;
                break;
            }
            else if (curItem.value=="Interest")
            {
                txtInputInterest.disabled = true;
                txtInputInterest.value = ToBeComputed;
                txtInputInterest.style.fontStyle = "italic";
                txtInputInterest.style.fontWeight = "bold";
                txtInputInterest.style.color = "blue";
                btnComputeInterest.disabled=false;
                break;
            }
            else if (curItem.value=="Years")
            {
                txtInputYears.disabled = true;
                txtInputYears.value = ToBeComputed;
                txtInputYears.style.fontStyle = "italic";
                txtInputYears.style.fontWeight = "bold";
                txtInputYears.style.color = "blue";
                btnComputeYears.disabled=false;
                break;
            }
            else if (curItem.value=="Payment")
            {
                txtInputPayment.disabled = true;
                txtInputPayment.value = ToBeComputed;
                txtInputPayment.style.fontStyle = "italic";
                txtInputPayment.style.fontWeight = "bold";
                txtInputPayment.style.color = "blue";
                btnComputePayment.disabled=false;  
                break;
            }
        }
    }
}



function HandleSolveForRadioButtonChange()
{
    UpdateGlobalSolveForBasedOnRadioButton();
    UpdateTextInputFieldsBasedOnRadioButton();
}

function Compute()
{
    var txtInputLoan : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputLoan");
    var txtInputInterest : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputInterest");
    var txtInputYears : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputYears");
    var txtInputPayment : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputPayment");

    var strInitialLoan : string = txtInputLoan.value;
    var strAnnualInterestRateAsAPercent : string = txtInputInterest.value;
    var strNumberOfYears : string = txtInputYears.value;
    var strMonthlyPayment : string = txtInputPayment.value;

    var initialLoan : number = parseFloat(strInitialLoan);
    var annualInterestRateAsAPercent : number = parseFloat(strAnnualInterestRateAsAPercent);
    var numberOfYears : number = parseFloat(strNumberOfYears);
    var monthlyPayment : number = parseFloat(strMonthlyPayment);

    if (globalSolveFor!=SolveFor.Loan && isNaN(initialLoan))
    {
        alert("Please enter a number for the loan");
        return;
    }
    if (globalSolveFor!=SolveFor.Interest && isNaN(annualInterestRateAsAPercent))
    {
        alert("Please enter a number for the interest");
        return;
    }
    if (globalSolveFor!=SolveFor.Years && isNaN(numberOfYears))
    {
        alert("Please enter a number for the years");
        return;
    }
    if (globalSolveFor!=SolveFor.Payment && isNaN(monthlyPayment))
    {
        alert("Please enter a number for the payment");
        return;
    }
    if (globalSolveFor!=SolveFor.Loan && initialLoan<0.0)
    {
        alert("Please enter a non-negative number for the loan");
        return;
    }
    if (globalSolveFor!=SolveFor.Interest && annualInterestRateAsAPercent<0.0)
    {
        alert("Please enter a non-negative number for the interest");
        return;
    }
    if (globalSolveFor!=SolveFor.Years && numberOfYears<=0.0)
    {
        alert("Please enter a positive number for the years");
        return;
    }
    if (globalSolveFor!=SolveFor.Payment && monthlyPayment<=0.0)
    {
        alert("Please enter a positive number for the payment");
        return;
    }
    if (globalSolveFor==SolveFor.Years && monthlyPayment <= (annualInterestRateAsAPercent/1200.0)*initialLoan)   
    {
        alert("Monthly payment is too low to ever pay off the loan with given interest rate")
        return;
    }              

    if (globalSolveFor==SolveFor.Loan)
    {
        initialLoan = -1.0;
        let MyMortgage : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, numberOfYears, monthlyPayment);
        initialLoan = MyMortgage.computeInitialLoan();
        txtInputLoan.value = initialLoan.toFixed(2).toString();
    }
    else if (globalSolveFor==SolveFor.Interest)
    {
        annualInterestRateAsAPercent = -1.0;
        let MyMortgage : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, numberOfYears, monthlyPayment);
        if (numberOfYears*12.0*monthlyPayment < initialLoan)
        {
            txtInputInterest.value = "Monthly pmts too low";
            return;
        }
        else
        {
            let ridiculouslyHighInterestRate : number = 100.0/1200.0;
            let numberOfMonths : number = 12.0*numberOfYears;
            let a : number = pvOfOrdinaryAnnuityWithPeriodicInterestRateAndNumberOfPeriods(ridiculouslyHighInterestRate, numberOfMonths);
            let ridiculouslyHighMonthlyPayment: number = initialLoan/a;
            if (monthlyPayment > ridiculouslyHighMonthlyPayment)
            {
                txtInputInterest.value = "Monthly pmts too high";
                return;
            }
        }
        annualInterestRateAsAPercent = MyMortgage.computeAnnualInterestRateAsAPercent();
        txtInputInterest.value = annualInterestRateAsAPercent.toFixed(3).toString();
    }
    else if (globalSolveFor==SolveFor.Years)
    {
        numberOfYears = -1.0;
        let MyMortgage : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, numberOfYears, monthlyPayment);
        var numberOfMonths = MyMortgage.computeNumberOfMonths();
        numberOfYears = numberOfMonths/12.0;
        txtInputYears.value = roundUp(numberOfYears).toString();
    }
    else if (globalSolveFor==SolveFor.Payment)
    {
        monthlyPayment = -1.0;
        let MyMortgage : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, numberOfYears, monthlyPayment);
        monthlyPayment = MyMortgage.computeMonthlyPayment();
        txtInputPayment.value = roundUp(monthlyPayment).toString();
    }
}

function ComputeLoan()
{
    Compute();
}

function ComputeInterest()
{
    Compute();
}

function ComputeYears()
{
    Compute();
}

function ComputePayment()
{
    Compute();
}

////////////////////////////////////////////////////////////////////////////////
// getDrawingCanvas
// Get the drawing canvas
//
// returns: the drawing canvas
////////////////////////////////////////////////////////////////////////////////
function getDrawingCanvas() : HTMLCanvasElement
{
   // var document : Document;
   var drawingCanvas : HTMLCanvasElement =
     <HTMLCanvasElement>document.getElementById('drawingCanvas');
   return drawingCanvas;
}

////////////////////////////////////////////////////////////////////////////////
// getDrawingContext
// Get the drawing context
//
// returns: the drawing context
////////////////////////////////////////////////////////////////////////////////
function getDrawingContext() : CanvasRenderingContext2D
{
  var drawingCanvas : HTMLCanvasElement = getDrawingCanvas();
  var drawingContext : CanvasRenderingContext2D = <CanvasRenderingContext2D> drawingCanvas.getContext('2d');
  return drawingContext;
}

function Graph()
{
    Compute();
    var txtInputLoan : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputLoan");
    var txtInputInterest : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputInterest");
    var txtInputYears : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputYears");
    var txtInputPayment : HTMLInputElement = <HTMLInputElement>document.getElementById("txtInputPayment");

    var strInitialLoan : string = txtInputLoan.value;
    var strAnnualInterestRateAsAPercent : string = txtInputInterest.value;
    var strNumberOfYears : string = txtInputYears.value;
    var strMonthlyPayment : string = txtInputPayment.value;

    var initialLoan : number = parseFloat(strInitialLoan);
    var annualInterestRateAsAPercent : number = parseFloat(strAnnualInterestRateAsAPercent);
    var numberOfYears : number = parseFloat(strNumberOfYears);
    var monthlyPayment : number = parseFloat(strMonthlyPayment);  
    
    var initialLoanValid : boolean = !(isNaN(initialLoan));
    var annualInterestRateAsAPercentValid : boolean = !(isNaN(annualInterestRateAsAPercent));
    var numberOfYearsValid : boolean = !(isNaN(numberOfYears));
    var monthlyPaymentValid : boolean = !(isNaN(monthlyPayment));

    var drawingCanvas : HTMLCanvasElement = getDrawingCanvas();
    var drawingContext : CanvasRenderingContext2D = getDrawingContext();
    drawingContext.save();
    var width : number = drawingCanvas.width;
    var height : number = drawingCanvas.height;
    drawingContext.clearRect(0.0, 0.0, width, height);

    drawingContext.translate(0.0, height);
    drawingContext.scale(1.0, -1.0);
    var numberOfMonths : number = 12*numberOfYears;
    var xScaleFac : number = width/numberOfMonths;
    var yScaleFac : number = height/initialLoan;  
    drawingContext.scale(xScaleFac, yScaleFac);

    drawingContext.lineWidth = 5.0*Math.min(1.0/yScaleFac, 1.0/xScaleFac); // this makes a big difference

    var xVal : number;
    var yVal : number;
    var monthlyInterestRate : number = annualInterestRateAsAPercent/1200.0;
    drawingContext.beginPath();

    var i : number;
    var remainingPrincipal = initialLoan;
    drawingContext.moveTo(0.0, initialLoan);    
    for (i = 1; i <= numberOfMonths; i++)
    {
        remainingPrincipal = remainingPrincipal*(1.0 + monthlyInterestRate);
        remainingPrincipal = remainingPrincipal - monthlyPayment;
        xVal = i;
        yVal = remainingPrincipal;
        drawingContext.lineTo(xVal, yVal);
    } 
    drawingContext.stroke();

    drawingContext.restore();
}

function Help()
{
    alert("Help");
}

window.onload = HandleSolveForRadioButtonChange;

//***************************** TESTS ******************************/

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

function testComputeNumberOfMonths()
{
    document.writeln("<p>Entering testComputeNumberOfMonths()</p>");
    
    var initialLoan : number = 200000;
    var annualInterestRateAsAPercent : number = 3.5;
    var monthlyPayment : number = 898.09; // round up
    
    document.writeln("<p>initialLoan = " + initialLoan.toString() + "</p>");
    document.writeln("<p>annualInterestRateAsAPercent = " + annualInterestRateAsAPercent.toString() + "</p>");
    document.writeln("<p>monthlyPayment = " + monthlyPayment.toString() + "</p>");
   
    var M : Mortgage = new Mortgage(initialLoan, annualInterestRateAsAPercent, -1, monthlyPayment);
    var numberOfMonths : number = M.computeNumberOfMonths();

    document.writeln("<p>numberOfMonths = " + numberOfMonths.toString() + "</p>");
    
    document.writeln("<p>Leaving testComputeNumberOfMonths()</p>");
}

function testComputeAnnualInterestRateAsAPercent()
{
    document.writeln("<p>Entering testComputeAnnualInterestRateAsAPercent()</p>");
    
    var initialLoan : number = 200000;
    var numberOfYears : number = 30.0;
    var monthlyPayment : number = 898.0893756176412; // we are putting it in very precisely
    
    document.writeln("<p>initialLoan = " + initialLoan.toString() + "</p>");
    document.writeln("<p>numberOfYears = " + numberOfYears.toString() + "</p>");
    document.writeln("<p>monthlyPayment = " + monthlyPayment.toString() + "</p>");
   
    var M : Mortgage = new Mortgage(initialLoan, -1, numberOfYears, monthlyPayment);
    var annualInterestRateAsAPercent : number = M.computeAnnualInterestRateAsAPercent();

    document.writeln("<p>annualInterestRateAsAPercent = " + annualInterestRateAsAPercent.toString() + "</p>");
    
    document.writeln("<p>Leaving testComputeAnnualInterestRateAsAPercent()</p>");
}

function testFindRootUsingBisection()
{
    document.writeln("<p>Entering testFindRootUsingBisection()</p>");
    var a : number = 0.0;
    var b : number = 2.0;
    var TOL : number = 0.000001;
    var NMAX : number = 100;
    var root : number = findRootUsingBisection(a, b, xSquaredMinusTwo, null, TOL, NMAX)
    document.writeln("<p>root = " + root.toString());
    var error : number = Math.abs(root - Math.sqrt(2.0));
    document.writeln("<p>error = " + error.toString()); 
    root = findRootUsingBisection(a, b, xCubedMinusSix, null, TOL, NMAX)
    document.writeln("<p>root = " + root.toString());
    error = Math.abs(root - Math.pow(6.0, (1.0/3.0)));
    document.writeln("<p>error = " + error.toString()); 
    document.writeln("<p>Leaving testFindRootUsingBisection()</p>");  
}

function xSquaredMinusTwo(x : number) : number
{
    return x*x - 2.0;
}

function xCubedMinusSix(x : number) : number
{
    return x*x*x - 6.0;
}

function doTests()
{
    document.writeln("<p>Entering doTests()</p>");
    testComputeMonthlyPayment();
    testComputeInitialLoan();
    testComputeNumberOfMonths();
    testFindRootUsingBisection();
    testComputeAnnualInterestRateAsAPercent();
    document.writeln("<p>Leaving doTests()</p>");
}

//   End implementing counterparts for the code in the Objective-C file 
// /Users/richardfuhr/Documents/Sandbox/XcodeLearn/Mortgage/Mortgage/Mortgage.m
