// Dimensions of sunburst.

// from https://bl.ocks.org/kerryrodden/raw/7090426/
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 75, h: 30, s: 3, t: 10
};

function wordColor(word) {
    let color = '#' + String(word).hashCode();
    return color;
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#keywordsVis").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

initializeBreadcrumbTrail();

// Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);


var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function (d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function (d) { return d.x; })
    .endAngle(function (d) { return d.x + d.dx; })
    .innerRadius(function (d) { return Math.sqrt(d.y); })
    .outerRadius(function (d) { return Math.sqrt(d.y + d.dy); });

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
function updateSunburst(data, keywords) {
    var json = buildHierarchy(data, keywords);
    createVisualization(json);
};

function updateNetwork(nodes) {
    nodes.forEach(currentNode => {
        nodes.forEach(sibling => function (sibling) {
            var link = currentNode.links.find(link => link.node.keyword == sibling.keyword);
            if (link) {
                link.count = link.count + 1;
            }
            else {
                link = { node: sibling, count: 1 }
                currentNode.links.push(link);
            }
        }(sibling));

    });
}

function addKeywords(from, elements) {

    existingNodes = from.filter(f => elements.contains(f.keyword))
    newNodes = elements.map(e => function (e) {
        return { keyword: e, links: [] }
    }(e));

    relatedNodes = existingNodes.concat(newNodes)
    updateNetwork(relatedNodes)

    return from.concat(newNodes)
}
function getTopKeywords(data, limit = 10) {
    words = data.map(a => a.keywords)
    words = words.flat()
    var wordFreqs = words.reduce((p, name) => {
        if (!p.hasOwnProperty(name)) {
            p[name] = 0;
        }
        p[name]++;
        return p;
    }, {})

    var wordFreqsItems = Object.keys(wordFreqs).map(function (key) {
        return [key, wordFreqs[key]];
    });

    // Sort the array based on the second element
    wordFreqsItems.sort(function (first, second) {
        return second[1] - first[1];
    });

    return wordFreqsItems.slice(0, limit)
}

function _buildHierarchy(csv) {
    var root = { "name": "root", "children": [] };
    for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
            continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                    if (children[k]["name"] == nodeName) {
                        childNode = children[k];
                        foundChild = true;
                        break;
                    }
                }
                // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                    childNode = { "name": nodeName, "children": [] };
                    children.push(childNode);
                }
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = { "name": nodeName, "size": size };
                children.push(childNode);
            }
        }
    }
    return root;
};

function buildHierarchy(data, majorKeywords) {
    csv = []

    top1 = getTopKeywords(data)
    top1.forEach(node1 => {
        secondLevel = data.filter(d => d.keywords.contains(node1[0]))
        top2 = getTopKeywords(secondLevel)

        top2.forEach(node2 => {
            if (node1[0] != node2[0]) {
                thirdLevel = secondLevel.filter(d => d.keywords.contains(node2[0]))
                top3 = getTopKeywords(thirdLevel)
                top3.forEach(node3 => {
                    if (node1[0] != node3[0] && node2[0] != node3[0]) {
                        csv.push([node1[0] + '-' + node2[0] + '-' + node3[0], node3[1]])
                    }
                })
            }

        })
    })

    tree = _buildHierarchy(csv)

    return tree;

    // for (var i = 0; i < data.length; i++) {
    //     intersection = data[i].keywords.filter(value => -1 !== majorKeywords.indexOf(value))
    //     keywords = addKeywords(keywords, intersection);
    //     console.log(i)
    // }
}
// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

    // Basic setup of page elements.
    
    // drawLegend();
    // d3.select("#togglelegend").on("click", toggleLegend);



    
    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
        .filter(function (d) {
            return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });

    var sunburst = vis.data([json]).selectAll(".sunburstPath").data(nodes);
    var path =
        sunburst.enter().append("svg:path")
            .attr("class", "sunburstPath")
            .merge(sunburst)
            .attr("display", function (d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) {
                return wordColor(d.name);
            })
            .style("opacity", 1)
            .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    if (path.node())
        totalSize = path.node().__data__.value;
    else
        totalSize = 0
};

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

    var percentage = (100 * d.value / totalSize).toPrecision(2);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
        percentageString = "< 0.1%";
    }

    d3.select("#percentage")
        .text(percentageString);

    d3.select("#explanation")
        .style("visibility", "");

    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    d3.selectAll(".sunburstPath")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll(".sunburstPath")
        .filter(function (node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll(".sunburstPath").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll(".sunburstPath")
        .transition()
        .duration(1000)
        .style("opacity", 1);

    d3.selectAll(".sunburstPath").on("mouseover", mouseover);

    d3.select("#explanation")
        .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}

function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function (d) { return d.name + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function (d) {
            return wordColor(d.name);
        });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) { 
            return d.name; 
        });

    // Set position for entering and updating nodes.
    g.attr("transform", function (d, i) {
        console.log("transform: "+ d.name)
        return "translate(" + (i+1) * (b.w + b.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");

}

// function drawLegend() {

//     // Dimensions of legend item: width, height, spacing, radius of rounded rect.
//     var li = {
//         w: 75, h: 30, s: 3, r: 3
//     };

//     var legend = d3.select("#legend").append("svg:svg")
//         .attr("width", li.w)
//         .attr("height", d3.keys(10).length * (li.h + li.s));

//     var g = legend.selectAll("g")
//         .data(d3.entries(colors))
//         .enter().append("svg:g")
//         .attr("transform", function (d, i) {
//             return "translate(0," + i * (li.h + li.s) + ")";
//         });

//     g.append("svg:rect")
//         .attr("rx", li.r)
//         .attr("ry", li.r)
//         .attr("width", li.w)
//         .attr("height", li.h)
//         .style("fill", function (d) { return d.value; });

//     g.append("svg:text")
//         .attr("x", li.w / 2)
//         .attr("y", li.h / 2)
//         .attr("dy", "0.35em")
//         .attr("text-anchor", "middle")
//         .text(function (d) { return d.key; });
// }

function toggleLegend() {
    var legend = d3.select("#legend");
    if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
    } else {
        legend.style("visibility", "hidden");
    }
}
