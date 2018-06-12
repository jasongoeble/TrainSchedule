// Initialize Firebase
var config = {
apiKey: "AIzaSyAoPBO6KsujNPQYP71DmLamOYs-L8yTNLk",
authDomain: "trainschedule-e8334.firebaseapp.com",
databaseURL: "https://trainschedule-e8334.firebaseio.com",
projectId: "trainschedule-e8334",
storageBucket: "trainschedule-e8334.appspot.com",
messagingSenderId: "76674777642"
};

firebase.initializeApp(config);

//create a variable to reference the database
var database = firebase.database();

var completeValidation = false;
var inputErrorMessage = "Please enter values with correct formatting for your new train entry:";

//this validation function will only fire if the submit button is clicked, and uses the values directly from the input form
function formValidation()
{
    // Get the value of the input fields
    var inputData = [$("#trainName-input").val().trim(), $("#destination-input").val().trim(), $("#frequency-input").val().trim(), $("#firstTime-input").val().trim()];

    var validated = [];
    completeValidation = false;

    //preliminary check to make sure there is a value for train name
    if (inputData[0] == "")
    {
        validated.push(false);
        inputErrorMessage = inputErrorMessage+" Name ";
    }
    else
    {
        validated.push(true);
    }

    //preliminary check to make sure there is a value for destination
    if (inputData[1] == "")
    {
        inputErrorMessage = inputErrorMessage+" Destination ";
        validated.push(false);
    }
    else
    {
        validated.push(true);
    }

    //next, check to make sure that the frequency value is a number
    // If frequency is not a number or <1, update validated array position 2
    if (isNaN(inputData[2]) || inputData[2] < 1 || inputData[2] == "")
    {
        inputErrorMessage = inputErrorMessage+" Frequency ";
        validated.push(false);    
    } 
    else {
        //frequency is a number
        validated.push(true);
    }

    //moment.js will validate that the first train time input is valid
    if (moment(inputData[3],"HH:mm").isValid() && inputData[3] != "")
    {
        //update my validation tracking array that the time input is valid
        validated.push(true);
    }
    else
    {
        inputErrorMessage = inputErrorMessage+" First Arrival Time";
        validated.push(false);
    }
   

    //if all user data has been validated
    if (validated[0] && validated [1] && validated[2] & validated[3] == true)
    {
        completeValidation = true;
    }
    else
    {
        completeValidation = false;
    }

    return(completeValidation);
}

$("#add-train").click(function(event)
{
    event.preventDefault();

    //call the user input validation function
    //hopefully prevents the inclusion of garbage data from the database....gigo
    if (completeValidation === true)
    {
        //capture values provided by user into variables for push to database
        var trainName = $("#trainName-input").val().trim();
        var destination = $("#destination-input").val().trim();
        //these two variables require some manipulation to get both the right formatting and to permit derivation of additional information 
        var frequency = $("#frequency-input").val().trim();
        var firstArrival = $("#firstTime-input").val().trim();
        //push validated user values (post a little manipulation) to database
        database.ref().push(
            {
                trainName: trainName,
                destination: destination,
                frequency: frequency,
                firstArrival: firstArrival,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
    }
    //if there are errors in the input, no firebase insert occurs and the error message indicating problems is alerted to the screen
    else
    {
        alert(inputErrorMessage);
    }

    //clear the form fields for the user
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#firstTime-input").val("");

    //reset the validation indicator
    completeValidation = false;

    //reset the input error message
    inputErrorMessage = "Please enter values with correct formatting for your new train entry:";
});

database.ref().on("child_added", function(childSnapshot)
{
    //retrieve data from the database as a child object is added
    var showName = childSnapshot.val().trainName;
    var showDestination = childSnapshot.val().destination;
    var showFrequency = childSnapshot.val().frequency;

    //convert the first arrival time
    var firstTimeConv = moment(childSnapshot.val().firstArrival, "HH:mm").subtract(1,"years");
    //pull the current time and put it into military time
    var currentTime = moment();
    currentTime = moment(currentTime).format("hh:mm");
    //calculate the difference between the times
    var diffTime = moment().diff(moment(firstTimeConv), "minutes");
    //the remainder of the time
    var timeRemainder = diffTime % childSnapshot.val().frequency;
    //the minutes until the train arrives at the depot based upon the stated frequency
    var timeTillTrain = childSnapshot.val().frequency - timeRemainder;
    //formatted next arrival time of train
    var nextArrival = moment().add(timeTillTrain, "minutes");
    nextArrival = moment(nextArrival).format("hh:mm");

    var shownextArrival = nextArrival;
    var showminutesAway = timeTillTrain;

    //append the newly added child object attributes to the table for display to the user
    //because the table allows the data to perpetuate infinitiely, all data (regardless of user) will be visible to all visitors
    $("#displayTable").append("<tr><td>"+showName+"</td><td>"+showDestination+"</td><td>"+showFrequency+"</td><td>"+shownextArrival+"</td><td>"+showminutesAway+"</td></tr>");
    
},
function (errorObject) 
{
        console.log("Errors handled: " + errorObject.code);
});