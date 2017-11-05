var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var app = express();
var del = require("del");
var fs = require("fs");
const path = require('path');

// var gcloud = require('gcloud')({
//   keyFilename: './smartGrocery.json',
//   projectId: 'smartgrocery-185102'
// });

var gcloud = require('google-cloud');
var vision = gcloud.vision({
  keyFilename: './smartGrocery-08992b9794eb.json',
  projectId: 'smartgrocery-185102'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var fileName = "./uploads";
var imageName;

app.post("/upload", multer({dest: "./uploads/"}).array("uploads[]", 12), function(req, res) {
    res.send(req.files);
    // deleteImage("./uploads");
    onUpload("./uploads");
});


function onUpload(folderPath){
	fs.readdir(folderPath, (err, files) => {
		if (err) throw err;
		for (const file of files) {
			console.log("file:sadasd " + file);
			imageName = file;
			var fileName = folderPath + '/' + imageName;
			console.log("FILENAME IS: " + fileName);
		}
	});
	// Performs text detection on the local file
	vision.textDetection({ source: { filename: fileName } })
  .then((results) => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach((text) => console.log(text));

  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
}


function deleteImage(folderPath) {
    // delete files inside folder but not the folder itself
    fs.readdir(folderPath, (err, files) => {
  		if (err) throw err;
		for (const file of files) {
    		fs.unlink(path.join(folderPath, file), err => {
      			if (err) throw err;
    		});
  		}
	});
};

var machineLearningCluster = {"0": {"Fresh": 5418.527559055121, 
	"Milk": 2336.0393700787477, 
	"Grocery": 2704.0551181102255, 
	"Frozen": 2616.4330708661414, 
	"Detergents_Paper": 661.5590551181126, 
	"Delicassen": 890.5826771653535}, 
"1": {"Fresh": 30713.358974358984, 
	"Milk": 5061.538461538461, 
	"Grocery": 5705.846153846154, 
	"Frozen": 4172.589743589743, 
	"Detergents_Paper": 1114.384615384616, 
	"Delicassen": 1832.4102564102554}, 
"2": {"Fresh": 4494.77142857142, 
	"Milk": 7668.04285714286, 
	"Grocery": 10390.185714285717, 
	"Frozen": 1341.07142857143, 
	"Detergents_Paper": 4514.342857142858, 
	"Delicassen": 1299.857142857143}, 
"3": {"Fresh": 5483.9999999999945, 
	"Milk": 13822.027027027034,
	"Grocery": 21082.675675675666, 
	"Frozen": 1890.2432432432424, 
	"Detergents_Paper": 9414.000000000004, 
	"Delicassen": 1745.1351351351354}, 
"4": {"Fresh": 16257.510416666657, 
	"Milk": 3062.3020833333358, 
	"Grocery": 4452.458333333336, 
	"Frozen": 3190.895833333333, 
	"Detergents_Paper": 1049.208333333332, 
	"Delicassen": 1258.6666666666667}
}

// Algorithm for classifying clusters
function findClosestCluster(vals){
	var lowestError = 10000000000;
	var lowest_error_cluster_index = 0;
	for (var cluster in machineLearningCluster){
		var error = 0;
		var loop = 0;
		for(var type in cluster){
			error = error + Math.abs(type.values() - vals[loop].values());
			loop++;
		}
		if(error < lowest_error){
			lowest_error = error;
			lowest_error_cluster_index = cluster;
		}
	}
}
    
    
   // #lowest error initialized to some high value
   //  lowest_error = 10000000000
    
   // # index initialized to 0, will be processed as function loops through more clusters
   //  lowest_error_cluster_index = 0
    
   // #looping through 5 clusters
   //  for cluster in range(5):
        
   //     #error initialized to 0 to start off
   //      error = 0
        
   //     # Looping through each cluster items to calculate error
   //      for key, value in cluster_means[cluster].items():
   //          # Update Error based on L1 distance
   //          error = error + abs(cluster_means[cluster][key] - vals[key])
            
   //     #update error if error is lower than current error
   //      if error < lowest_error:
   //          lowest_error = error
   //          lowest_error_cluster_index = cluster
            
   // #return the cluster with the lowest error, AKA classification of error
   //  return cluster_means[lowest_error_cluster_index]

var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});