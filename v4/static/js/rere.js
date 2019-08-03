// Setting the params for margin 
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 550 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

//Creating the box to add the  informations on top 3 wines
var div2 = d3.select("div#table").append("div")
    .style("opacity", 0);

var min_price = 100
var max_price = 100000
var ratings = 0
var selectedCountries = null
var selectedGrapes = null

// adding function to add the top3 results
function gueryss(min_price,max_price,ratings,selectedCountries,selectedGrapes)
{
  // load data
  d3.csv("data/result.csv", function(error, datas) 
    {
        console.log("entrou")
      // change string (from CSV) into number format
        datas.forEach(function(d) 
          {
            d.price = +d.price;
            d.rating = +d.rating;
            d.name = d.name;
            d.region = d.region;
            d.country = d.country;
            d.grapes = d.grapes;
          })
        // filtering price
        datas = datas.filter(function(d){return d.price > min_price;})
        datas = datas.filter(function(d){return d.price < max_price;})

        // filtering rating
        datas = datas.filter(function(d){return d.rating >= ratings;})

        // filtering country
        datas = datas.filter(function (e) 
          {
                if (selectedCountries != null && selectedCountries.length > 0) 
                  {
                    if (!selectedCountries.includes(e.country))
                        return false;
                  }
                  return true;
          });

        //filtering grapes    
        datas = datas.filter(function (e) 
          {
                if (selectedGrapes != null && selectedGrapes.length > 0) 
                  {
                      if (!selectedGrapes.includes(e.grapes))
                          return false;
                  }
                  return true;
          });
        console.log(datas[1])
        //sorting by price (ascending)
        datas = datas.sort(function(x, y)
            {
               return d3.ascending(x.price, y.price);
            })
        //sorting by ratings (descending)
        datas = datas.sort(function(x, y)
            {
               return d3.descending(x.rating, y.rating);
            })
        console.log(datas[1])

        //slicing the data
        datas = datas.slice(0,3)

        for (i = 0; i < datas.length; i++) {
            console.log(i);
            console.log(datas[i].price);
            var ul = d3.select("#table").append('ul');
            ul.selectAll('li')
              .data(datas[i].price)
              .enter()
              .append('li')
              .html(String);
        }

        // var ul = d3.select("#table").append('ul');
        // ul.selectAll('li')
        //   .data(datas)
        //   .enter()
        //   .append('li')
        //   .html(String);

        






    })
}
gueryss(0,10000,0)