
// Initialize Firebase
var config = {
apiKey: "AIzaSyAoPBO6KsujNPQYP71DmLamOYs-L8yTNLk",
authDomain: "trainschedule-e8334.firebaseapp.com",
databaseURL: "https://trainschedule-e8334.firebaseio.com",
projectId: "trainschedule-e8334",
storageBucket: "",
messagingSenderId: "76674777642"
};

firebase.initializeApp(config);

//create a variable to reference the database
var database = firebase.database();

function formValidation()
{
    // Get the value of the input field with id="numb"
    var inputData = [$("#name-input").val().trim(), $("#role-input").val().trim(), $("#startDate-input").val().trim(), $("#monthlyRate").val().trim()];

    var validated = [];
    var completeValidation = false;

    //preliminary check to make sure there is a value in each field, as thehy are required
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
    }


    //next, check to make sure that the start date is correctly formatted and that the monthly rate is a number
    if (validated[0] && validated[1] === true)
    {
        //check to make sure start date is formatted MM/DD/YYYY
        if (moment(validated[2], 'MM/DD/YYYY', true).isvalid)
        {
            validated[2] = true;
        }
        else
        {
            validated[2] = false;
        }

        //check to make sure monthly rate is a number
        // If monthly rate is Not a Number or less than one
        if (isNaN(inputData[3]) || inputData[3] < 1)
        {
            validatd[3] = false;    
        } 
        else {
            //monthly rate is a number
            validated[3] = true;
        }
    }

    //if all user data has been validated
    if (validated[0] && validated [1] && validated[2] & validated[3] == true)
    {
        completeValidation = true;
    }
    //if the start date or monthly rate are not in valid formats or data types
    else
    {
        completeValidation = false;
        alert("Please make sure your Start Date is in the format of MM/DD/YYYY and your monthly rate is a number.")
    }

    return(completeValidation);
}

$("#submit").click(function(event)
{
    event.preventDefault();

    //capture values provided by user
    var name = $("#name-input").val().trim();
    var role = $("#role-input").val().trim();
    var startDate = $("#startDate-input").val().trim();
    var monthlyRate = $("#monthlyRate").val().trim();

    //push validated user values to database
    database.ref().push(
        {
            name: name,
            role: role,
            startDate: startDate,
            monthlyRate: monthlyRate,
            dateAdded: firebase.database.ServerValue, TIMESTAMP
        });

});

database.ref().on("child_added", function(childSnapshot)
{
    //some kind of operation here        
},
function (errorObject) 
{
        console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot)
{
    console.log(snapshot.key);
    var showName = snapshot.val().name;
    var showRole = snapshot.val().role;
    var showDate = snapshot.val().startDate;
    var showRate = snapshot.val().monthlyRate;

    $("#displayTable").append("<tr><td>"+showName+"</td><td>"+showRole+"</td><td>"+showDate+"</td><td>"+showRate+"</td></tr>");
});