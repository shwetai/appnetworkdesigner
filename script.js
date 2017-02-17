function loadD3() {
var linkpath = ("links.csv");
var nodepath = ("nodes.csv");

var width = 1000,
    height = 600;

var color = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


//Want to have different labels
// SETTING UP THE FORCE LAYOUT
  var force = d3.layout.force()
  //using width/height from above, but size is mainly det'd by linkDistance and charge
    .size([width, height])
    // how far between nodes
    .linkDistance(250)
    // changes how close nodes will get to each other. Neg is farther apart.
    .charge(-400);


d3.csv("nodes.csv", function(nodes) {

  var nodelookup = {};
  var nodecollector = {};

   count = 0;
// we want to create a lookup table that will relate the links file and the nodes file
    nodes.forEach(function(row) {
    nodelookup[row.node] = count;

    nodecollector[row.node] = {name: row.node, group: row.group, img_location: row.img_location};
    //console.log(nodecollector)

    //console.log(row.node)
    //console.log(nodelookup)

    count++;
 });

//Get all the links out of of the csv in a way that will match up with the nodes

d3.csv(linkpath, function(linkchecker) {

  var linkcollector = {};
  indexsource = 0;
  indextarget = 0;
    count= 0;
    //console.log(nodelookup['celery'])
    linkchecker.forEach(function(link) {

	linkcollector[count] = {source: nodelookup[link.source], target: nodelookup[link.target], type: link.type };
    //console.log(linkcollector[count])
	count++
});

//console.log(linkcollector)
var nodes = d3.values(nodecollector);
var links = d3.values(linkcollector);

//console.log(nodes)
//console.log(links)

  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
     .enter().append("line")
     .attr("class", function(d) { return "link " + d.type; })

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("");

  // Create the node circles.
  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
    .call(force.drag);

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");

 //put in little circles to drag
  node.append("circle")
      .attr("r", 4.5)
    .attr("class", function(d) { return "node " + d.group; })
    .call(force.drag);

    node.append("svg:image")
      .attr("xlink:href", function(d) { return d.img_location; })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 100)
      .attr("height", 100)
      .on("mouseover", function(){return tooltip.style("visibility", "visible") + tooltip.text("");})
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .on("click", function(){return tooltip.style("visibility", "visible") + tooltip.text("");});;

//add the words
 node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });



//var zoom = d3.behavior.zoom()
//    .on("zoom", zoomed);
//
//var g = node.append("g")
//    .call(zoom);
//
//function zoomed() {
//  view.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
//}


//get it going!
 force
      .nodes(nodes)
      .links(links)
      .start();

  force.on("tick", function() {


    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

//I think that translate changes all of the x and ys at once instead of one by one?
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  })

  });
  });
  }

function unloadD3() {
        delete window.foo;
        delete window.cleanup;
        alert("cleanedup. typeof window.foo is " + (typeof window.foo));
}
