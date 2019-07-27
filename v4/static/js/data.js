// prototyping overloading
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

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    hash = hash%16000000;
    return Math.abs(hash).toString(16);
};


jQuery.fn.visible = function () {
    return this.css('visibility', 'visible');
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Global Variables
var allData = [];
var filteredData = [];
var countries = [];
var words = [];

// Filtering 
function init() {

    $(".reset").click(function () {
        $('.chosen-select').val('').trigger('chosen:updated');
        filteredData = allData.rawData;
        updateUI();
    });

    if (allData === null || allData.length == 0)
        d3.csv('static/data/database.csv', initializeOptions);
}


function preprocessData(data) {
    data = data.map(a => function (a) {
        a.keywords = a.review.split(/(\s+)/).map(
            function (e) {
                //remove punctuation 
                return e.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
            }).filter(
                // remove small words
                function (e) {
                    return e.trim().length > 4 && isNaN(e.trim()) && !["rated", "ratings", "comment", "reviews", "community", "comments"].contains(e.trim())
                }
            )
        //.filter( onlyUnique );

        return a
    }(a))

    words = data.map(a => a.keywords)
    words = words.flat()
    var wordFreqs = words.reduce((p, c) => {
        var name = c;
        if (!p.hasOwnProperty(name)) {
            p[name] = 0;
        }
        p[name]++;
        return p;
    }, {})

    var filtered = Object.keys(wordFreqs).reduce(function (filtered, key) {
        if (wordFreqs[key] > 100) filtered[key] = wordFreqs[key];
        return filtered;
    }, {});
    words = Object.keys(filtered);

    data = data.map(a => function (a) {
        a.keywords = a.keywords.filter(value => -1 !== words.indexOf(value))
        return a
    }(a))

    return { rawData: data, keywords: words };
}


function updateUI() {
    // autocomplete keywords
    updateSunburst(filteredData, allData.keywords);
}

function initForm(data) {

    // autocomplete country
    countries = data.rawData.map(a => a.country).unique();

    var country = document.getElementById("country");
    country.options = countries.map(function (c) {
        var option = document.createElement("option");
        option.text = c;
        option.value = c;
        country.appendChild(option);
    })


    var keywords = document.getElementById("keywords");
    keywords.options = data.keywords.map(function (c) {
        var option = document.createElement("option");
        option.text = c;
        option.value = c;
        keywords.appendChild(option);
    })

}
function initializeOptions(error, data) {

    allData = preprocessData(data);
    filteredData = allData.rawData;

    // init form
    initForm(allData)

    $('.chosen-select').chosen({}).trigger("chosen:updated");
    $('.chosen-select').visible()

    $(".chosen-select").chosen({}).change(function (e, c) {
        selectedCountries = Array.from(document.getElementById("country").selectedOptions).map(function (e) {
            return e.value;
        });
        selectedKeywords = Array.from(document.getElementById("keywords").selectedOptions).map(function (e) { return e.value; });

        filteredData = allData.rawData.filter(function (e) {
            if (selectedCountries != null && selectedCountries.length > 0) {
                if (!selectedCountries.includes(e.country))
                    return false;
            }

            if (selectedKeywords != null && selectedKeywords.length > 0) {
                if (!selectedKeywords.every(function (v) { return e.review.toLowerCase().indexOf(v) >= 0; })) {
                    return false;
                }
            }
            return true;
        });

        updateUI(allData, filteredData)

    });

    updateUI(allData, filteredData);
}