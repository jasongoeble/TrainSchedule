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

//this validation function will only fire if the submit button is clicked, and uses the values directly from the input form
/*function formValidation()
{
    // Get the value of the input fields
    var inputData = [$("#trainName-input").val().trim(), $("#destination-input").val().trim(), $("#frequency-input").val().trim(), $("#firstTime-input").val().trim()];
    console.log(inputData);

    var validated = [];
    var completeValidation = false;

    //preliminary check to make sure there is a value in each field, as they are all required
    for (i=0; i<inputData.length; i++)
    {
        if (inputData[i] == "")
        {
            alert("Please fill in all required fields");
            validated.push(false);
        }
        else
        {
            validated.push(true);
        }
        //by the end of this for loop, array validated should have 4 values
    }


    //next, check to make sure that the frequency value is a number
    //this will only run if the validated array reflects that there is a value for both trainName and destination
    if (validated[0] && validated[1] === true)
    {
        // If frequency is not a number or <1, update validated array position 2
        if (isNaN(inputData[2]) || inputData[2] < 1)
        {
            alert("Please input only numbers with a value of at least 1");
            validated[2] = false;    
        } 
        else {
            //frequency is a number
            validated[2] = true;
        }
    }

    //lastly, if train name, destination and frequency have all been validated move on to validate the first train time input
    if (validated[0] && validated[1] & validated[2] === true)
    {
        //moment.js will validate that the first train time input is valid
        if (moment(inputData[4],"HH:mm").isValid())
        {
            //update my validation tracking array that the time input is valid
            validated[3] = true;
        }
        else
        {
            alert("Please input a first train time in military format - HH:mm");
        }
    }
    else
    {

    }

    //if all user data has been validated
    if (validated[0] && validated [1] && validated[2] & validated[3] == true)
    {
        completeValidation = true;
    }
    else
    {
        completeValidation = false;
        alert("Please make sure your input data matches the stated requirements and also makes sense...Doug");
    }

    return(completeValidation);
}*/

$("#add-train").click(function(event)
{
    event.preventDefault();

    //call the user input validation function
    //hopefully prevents the inclusion of garbage data from the database....gigo
   // if (formValidation())
    //{

    //capture values provided by user into variables for push to database
    var trainName = $("#trainName-input").val().trim();
    console.log("Train Name: "+trainName);
    var destination = $("#destination-input").val().trim();
    console.log("Destination: "+destination);
    //these two variables require some manipulation to get both the right formatting and to permit derivation of additional information 
    var frequency = $("#frequency-input").val().trim();
    console.log("Frequency: "+frequency);
    var firstArrival = $("#firstArrival-input").val().trim();
    console.log("First Arrival: "+firstArrival);
    //convert the first arrival time
    var firstTimeConv = moment(firstArrival, "HH:mm").subtract(1,"years");
    console.log("First Time Conv: "+firstTimeConv);
    //pull the current time and put it into military time
    var currentTime = moment();
    console.log("Current Time: "+currentTime);
    currentTime = moment(currentTime).format("hh:mm");
    console.log("Current Time Formatted: "+currentTime);
    //calculate the difference between the times
    var diffTime = moment().diff(moment(firstTimeConv), "minutes");
    console.log("Time Difference: "+diffTime);
    //the remainder of the time
    var timeRemainder = diffTime % frequency;
    console.log("Remainder: "+timeRemainder);
    //the minutes until the train arrives at the depot based upon the stated frequency
    var timeTillTrain = frequency - timeRemainder;
    console.log("Time Until Train: "+timeTillTrain);
    //formatted next arrival time of train
    var nextArrival = moment().add(timeTillTrain, "minutes");
    console.log("Next Arrival: "+nextArrival);
    nextArrival = moment(nextArrival).format("hh:mm");
    console.log("Next Arrival formatted: "+nextArrival);
    //push validated user values (post a little manipulation) to database
    database.ref().push(
        {
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            firstArrival: firstArrival,
            nextArrival: nextArrival,
            minutesAway: timeTillTrain,
            dateAdded: firebase.database.ServerValue, TIMESTAMP
        });
    //}
   // else
    //{

    //}

    //clear the form fields for the user
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("firstArrival-input").val("");
});

/*database.ref().on("value", function(snapshot)
{
 
},
function(errorObject) 
{
    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);
});*/

database.ref().on("child_added", function(childSnapshot, prevChildKey)
{
       //retrieve data from the database as a child object is added
    var showName = childSnapshot.val().trainName;
    var showDestination = childSnapshot.val().destination;
    var showFrequency = childSnapshot.val().frequency;
    var shownextArrival = childSnapshot.val().nextArrival;
    var showminutesAway = childSnapshot.val().minutesAway;

    //append the newly added child object attributes to the table for display to the user
    //because the table allows the data to perpetuate infinitiely, all data (regardless of user) will be visible to all visitors
    $("#displayTable").append("<tr><td>"+showName+"</td><td>"+showDestination+"</td><td>"+showFrequency+"</td><td>"+shownextArrival+"</td><td>"+showminutesAway+"</td></tr>");
    
},
function (errorObject) 
{
        console.log("Errors handled: " + errorObject.code);
});

//database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot)
//{
//    console.log(snapshot.key);
//    var showName = childSnapshot.val().trainName;
//    var showDestination = childSnapshot.val().destination;
//    var showFrequency = childSnapshot.val().frequency;
//    var shownextArrival = childSnapshot.val().nextArrival;
//    var showminutesAway = childSnapshot.val().minutesAway;

    //$("#displayTable").append("<tr><td>"+showName+"</td><td>"+showDestination+"</td><td>"+showFrequency+"</td><td>"+shownextArrival+"</td><td>"+showminutesAway+"</td></tr>");
//});