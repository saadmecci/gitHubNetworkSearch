$(document).ready(function () {

	var config = {
	    apiKey: "AIzaSyBcgtk5PwiGsep3vRZLZyjSMFBQI0SWfWc",
	    authDomain: "project1-8e7c0.firebaseapp.com",
	    databaseURL: "https://project1-8e7c0.firebaseio.com",
	    projectId: "project1-8e7c0",
	    storageBucket: "project1-8e7c0.appspot.com",
	    messagingSenderId: "1085632833712"
  	};

  	firebase.initializeApp(config);

  	var database = firebase.database();

  	var gitHubToken = "";

  	database.ref().on("value", function (tokenPull) {

  		gitHubToken = tokenPull.val().gitHubToken;
  		
  	});
	
	$("#userSearchButton").on("click", function (event) {

		event.preventDefault();

		var userInput = $("#userInput").val().trim();


		var queryURL = "https://api.github.com/users/" + userInput + "/followers?access_token=" + gitHubToken;

		
		console.log(queryURL);


		$.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {

        	for (var i = 0; i < response.length; i++) {

        		var followers = response[i].login;

        		console.log(followers);

        		var treeData = {"name" : userInput, "children" : [
        			{"name" : followers},
      			]};

      			var vis = d3.select(".userNetwork").append("svg:svg")
	        .attr("width", 700)
	        .attr("height", 500)
	        .append("svg:g")
	        .attr("transform", "translate(40, 0)");

	     	var tree = d3.layout.tree().size([300,150]);

	      	var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

	      	var nodes = tree.nodes(treeData);
	      	var link = vis.selectAll("pathlink").data(tree.links(nodes)).enter().append("svg:path").attr("class", "link").attr("d", diagonal);

	      	var node = vis.selectAll("g.node").data(nodes).enter().append("svg:g").attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	      	node.append("svg:text").attr("dx", function(d) { return d.children ? 40 : 50; }).attr("dy", 3).attr("text-anchor", function(d) { return d.children ? "end" : "start"; }).text(function(d) { return d.name; });

	      	node.append("svg:circle").attr("r", 4.5);


        	};
		});

	});

});


