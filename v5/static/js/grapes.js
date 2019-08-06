var width = 500,
    height = 500;

var countries = ['all']
var min_price = 0
var max_price = 1000
var rating = 0
var grapes = ['all']

var chart = d3.select("div#chart")
    .append("svg")
    .attrs({
        "height": height,
        "width": width
    })
    .append("g")
    .attr("transform", "translate(" + 0 + "," + height / 2 + ")")


var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(.02))
    .force("y", d3.forceX(height / 2).strength(.02))
    .force("collide", d3.forceCollide(function(d) {
        return radiusScale(d["Count"]) + 1
    }));


// This function is to make the slider work
function getVals() {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseFloat(slides[0].value);
    var slide2 = parseFloat(slides[1].value);
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = slide1 + " - " + slide2
    svg.selectAll("*").remove()
    svg.selectAll("*").transition().duration(3000);
    // genGrapes(slide1);

    max_price = slide2
    min_price = slide1
    console.log(min_price)


}

const sliders2 = d3.selectAll('#slidess');
sliders2.on('change', function(d) {
    var sliderSections = document.getElementsByClassName("range-slider");
    for (var x = 0; x < sliderSections.length; x++) {
        var sliders = sliderSections[x].getElementsByTagName("input");
        for (var y = 0; y < sliders.length; y++) {
            if (sliders[y].type === "range") {
                sliders[y].oninput = getVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }
    console.log(sliderSections)
});


//function to get the changes in the rating filter
const buttons = d3.selectAll('#rating');
buttons.on('change', function(d) {
    ratings = this.value
    console.log(ratings)
});

//function to get the changes in the country and grapes filter
$(".chosen-select").chosen({}).change(function(e, c) {
    // filtering country
    countries = Array.from(document.getElementById("country").selectedOptions).map(function(e) {
        return e.value;
    });
    chart.selectAll("*").remove()
    chart.selectAll("*").transition().duration(3000)
    // filtering grapes
    grapes = Array.from(document.getElementById("grape").selectedOptions).map(function(e) {
        return e.value.replace('/','--');
    });

    if (countries.length>0 & grapes.length >0) {
        genGrapes(0, 1000, 0, countries, grapes)
    }
    if (countries.length==0 & grapes.length >0) {
        genGrapes(0, 1000, 0, ['all'], grapes)
    }
    if (countries.length>0 & grapes.length ==0) {
        genGrapes(0, 1000, 0, countries, ['all'])
    }

    if (countries.length==0 & grapes.length ==0) {
        genGrapes(0, 1000, 0, ['all'], ['all'])
    }



});


function genGrapes(min_price, max_price, rating, countries, grapes) {
    d3.queue()
        .defer(d3.csv, "getData/" + min_price + '/' + max_price + '/' +rating+ '/' + countries + '/' + grapes)
        .await(ready)

    function ready(error, datapoints) {
        var minrd = d3.min(datapoints, function(d){
            if(d["Type"]==='Red wine'){
                return parseInt(d.id);
            }
            else{
                return 1000;
            }
        })
        var maxrd = d3.max(datapoints, function(d){
            if(d["Type"]==='Red wine'){
                return parseInt(d.id);
            }
            else{
                return -10;
            }
        })
        var minwt = d3.min(datapoints, function(d){
            if(d["Type"]==='White wine'){
                return parseInt(d.id);
            }
            else{
                return 1000;
            }
        })
        var maxwt = d3.max(datapoints, function(d){
            if(d["Type"]==='White wine'){
                return parseInt(d.id);
            }
            else{
                return -10;
            }
        })
        var minct = d3.min(datapoints, function(d){
            return parseInt(d.Count);
        })
        var maxct = d3.max(datapoints, function(d){
            return parseInt(d.Count);
        })
        reds = d3.scaleLinear().domain([minrd, maxrd]).range(["#BD1E1E", "#940940"])
        whites = d3.scaleLinear().domain([minwt, maxwt]).range(["#E9EB8A", "#79CF4E"])
        var radiusScale = d3.scaleSqrt()
                            .domain([0, maxct*3])
                            .range([3, 50])
        var simulation = d3.forceSimulation()
                           .force("x", d3.forceX(width / 2).strength(.02))
                           .force("y", d3.forceX(height / 2).strength(.02))
                           .force("collide", d3.forceCollide(function(d) {
                            return radiusScale(d["Count"]) + 1
                          }));
        var circs = chart.selectAll(".artist")
            .data(datapoints)
            .enter()
            .append("circle")
            .attrs({
                "class": "artistic",
                "r": function(d) {
                    return radiusScale(d["Count"])
                },
                "fill": function(d) {
                    if (d["Type"] === 'Red wine') {
                        if (d["flag"] === '0') {
                            return reds(parseInt(d.id));
                        } else {
                            return "#9C7C7D"
                        }
                    } else {
                        if (d["flag"] === '0') {
                            return whites(parseInt(d.id));
                        } else {
                            return "#768075"
                        }
                    }
                }
            })
            .on("mouseover", function(d, i) {
                hoverText.text(d.Grape + ": " + d.Count);
                hoverGroup.attr("x", d.x);
                hoverGroup.attr("y", d.y);
                hoverGroup.style("visibility", "visible");
            })
            .on("mouseout", function(d, i) {
                hoverGroup.style("visibility", "hidden");
            })
            .on("click",function(d){
                $('#grape').val(d.Grape).trigger('chosen:updated');
                $('#grape').change();
            })

        var hoverGroup = chart.append("g").style("visibility", "hidden");

        hoverGroup.append("rect")
            .attr("id", "id")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 40)
            .attr("fill", "rgb(255, 255, 255)")
            .attr("stroke-width", "1px")
            .attr("stroke", "white");

        var hoverText = hoverGroup.append("text").attr("x", 7).attr("y", 15).style("font-size", "16px");
        simulation.nodes(datapoints)
            .on("tick", ticked)

        function ticked() {
            circs
                .attrs({
                    "cx": function(d) {
                        return d.x
                    },
                    "cy": function(d) {
                        return d.y
                    }
                })
        }
    }

}

genGrapes(0, 1000, 0, ['all'], ['all'])