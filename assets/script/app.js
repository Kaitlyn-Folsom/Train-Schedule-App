$(document).ready(function() {

    // Initialize Firebase      
    var config = {
        apiKey: "AIzaSyDr685JOWll33aWaLh6BA-HBlPN4ToWAhg",
        authDomain: "train-schedule-app-84e75.firebaseapp.com",
        databaseURL: "https://train-schedule-app-84e75.firebaseio.com",
        projectId: "train-schedule-app-84e75",
        storageBucket: "train-schedule-app-84e75.appspot.com",
        messagingSenderId: "876932149738"
    };

    //calling initialize app function to above config
    firebase.initializeApp(config);

    //VARIABLES =====================

    var database = firebase.database();

    var name = "";
    var dest = "";
    var time = "";
    var freq = "";

    $("#submitBtn").on("click", function(event) {

        event.preventDefault();

        // Grabbed values from input form
        name = $("#name-input").val().trim();
        dest = $("#dest-input").val().trim();
        time = $("#time-input").val().trim();
        freq = $("#freq-input").val().trim();

        console.log(name);
        console.log(dest);
        console.log(time);
        console.log(freq);

        // PUSH NEW ENTRY TO FIREBASE Databse
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
        });

        // Clears all of the text-boxes
        $("#name-input").val("");
        $("#dest-input").val("");
        $("#time-input").val("");
        $("#freq-input").val("");

    }); //End on click function

    //Function to add new row for each train input
    database.ref().on("child_added", function(childSnapshot) {

        // Log the value of the various properties
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().dest);
        console.log(childSnapshot.val().time);
        console.log(childSnapshot.val().freq);

        // Store everything into a variable.
        name = childSnapshot.val().name;
        dest = childSnapshot.val().dest;
        time = childSnapshot.val().time;
        freq = childSnapshot.val().freq;


        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
          console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
          console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % freq;
          console.log("REMAINDER " + tRemainder);

        // Minute Until Train
        var minutesAway = freq - tRemainder;
          console.log("MINUTES TILL TRAIN: " + minutesAway);

        // Next Train
        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");
          console.log("NEXT TRAIN: " + moment(nextTrain).format("hh:mm"));

        // Add each train's data into the table
        $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" +
            freq + "</td><td>" + nextTrain + "</td><td>" +
            minutesAway + "</td></tr>");

        // If any errors are experienced, log them to console.
        // Error Handling
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);

    }); //End childSnapshot function

}); //End document ready