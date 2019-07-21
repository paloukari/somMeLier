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

var countries = [];
function loadData() {
    d3.csv('data/database.csv', ready);
}

function ready(error, data) {

    // autocomplete country
    let countries = data.map(a => a.country).unique();
    autocomplete(document.getElementById("country"), countries);

    // autocomplete keywords
    let words = data.map(
        a => a.review.split(/(\s+)/).map(
            function (e) {
                //remove punctuation 
                return e.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            }
        ).filter(
            // remove small words
            function (e) { return e.trim().length > 3; }
        )
    )
    words = words.flat()

    words = words.unique();
    autocomplete(document.getElementById("keywords"), words);
}