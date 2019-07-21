Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

jQuery.fn.visible = function () {
    return this.css('visibility', 'visible');
};

var allData = [];
var filteredData = [];

var countries = [];
var words = [];

function refresh() {
    if (allData === null || allData.length == 0)
        d3.csv('data/database.csv', initializeOptions);
}



function initializeOptions(error, data) {
    allData = data;
    filteredData = data;
    // autocomplete country
    countries = data.map(a => a.country).unique();

    var country = document.getElementById("country");
    country.options = countries.map(function (c) {
        var option = document.createElement("option");
        option.text = c;
        option.value = c;
        country.appendChild(option);
    })


    // autocomplete keywords
    words = data.map(
        a => a.review.split(/(\s+)/).map(
            function (e) {
                //remove punctuation 
                return e.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
            }
        ).filter(
            // remove small words
            function (e) { return e.trim().length > 3; }
        )
    )
    words = words.flat()
    words = words.unique();

    var keywords = document.getElementById("keywords");
    keywords.options = words.map(function (c) {
        var option = document.createElement("option");
        option.text = c;
        option.value = c;
        keywords.appendChild(option);
    })

    $('.chosen-select').chosen({}).trigger("chosen:updated");
    $('.chosen-select').visible()

    $(".chosen-select").chosen({}).change(function (e, c) {
        selectedCountries = Array.from(document.getElementById("country").selectedOptions).map(function (e) {
            return e.value;
        });
        selectedKeywords = Array.from(document.getElementById("keywords").selectedOptions).map(function (e) { return e.value; });

        filteredData = allData.filter(function (e) {
            if (selectedCountries != null && selectedCountries.length > 0) {
                if (!selectedCountries.includes(e.country))
                    return false;
            }

            if (selectedKeywords != null && selectedKeywords.length > 0) {
                if (!selectedKeywords.some(function (v) { return e.review.toLowerCase().indexOf(v) >= 0; })) {
                    return false;
                }
            }
            return true;
        });

    });
}