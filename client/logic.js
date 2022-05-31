$(document).ready(function () {

    var available_flags = [];

    //  define click events dynamically based on html list (flags) 
    $("#navFlagsList").find("li").each(function(idx, li) {
        var id= $(li).find('img').attr("id");
        var countryCode = id.substring(0, 2);
        available_flags.push(countryCode);
        $("#" + id).click(function () {
            fetchNews(countryCode);

            // code responsible for closing the hamburger menu after user clicks the flag
            if ($('.navbar-toggler').is(':visible')) {  // first checks if hamburger menu is visible/present
                $('.navbar-toggler').click();           // if it is then menu is hidden after the selection
            }
            $('.tooltip').remove();         // removes tooltips after click
        });
      });

    // use geo-location to fetch relevant news based on user location
    $.ajax({
        url: "https://ipinfo.io",
        type: 'GET',
        dataType: 'jsonp',
        success: function (response) {
            var country = response.country;
            country = country.toLowerCase();
            if(available_flags.indexOf(country) < 0) {
                country = 'gb';
            }
            fetchNews(country);
        },
        error: function (xhr) {
            fetchNews('gb');
        }
    });    

    // OLD VERSION (not dynamic, but human friendly)
    // $("#us_flag").click(function () {
    //     fetchNews("us");
    // });
    // $("#jp_flag").click(function () {
    //     fetchNews("jp");
    // });
    // $("#fr_flag").click(function () {
    //     fetchNews("fr");
    // });
    // $("#pl_flag").click(function () {
    //     fetchNews("pl");
    // });
    // $("#gb_flag").click(function () {
    //     fetchNews("gb");
    // });

    $('[data-toggle="tooltip"]').tooltip();   // code responsible for tooltip
});

function fetchNews(countryCode) {
    var isActive = $("#" + countryCode + "_flag").parent().hasClass('active');
    if(!isActive) {         // prevents ajax calls if class is already active
        $.ajax({
            type: "POST",
            url: "https://monbird.com/news-api-proxy",
            data: {
                url: "https://newsapi.org/v2/top-headlines?country=" + countryCode
            },
            dataType: "json",
            success: function (result) {
                replaceContent(result, countryCode);
            },
            error: function (xhr) {
                displayError(xhr.status);
            }
        });
    }
}

function replaceContent(res, countryCode) {
    $("#newsContainer").empty();    // clears news from previous country
    $(".error").remove();           // clears error message if present
    $(".flag-icon").removeClass("active");

    for(let i = 0; i < res.articles.length; i++) {
        var article = res.articles[i];
        // konstruujemy kod html przy uzyciu jQuery ($ tutaj nie jest selektorem)
        var card = $('<div class="card mb-3">' +
                        '<img class="card-img-top image" src="" alt="&nbsp;&nbsp;&nbsp;news image">' +
                        '<div class="card-body">' +
                            '<h5 class="card-title title"></h5>' +
                            '<p class="card-text description"></p>' +
                            '<p class="author"></p>' +
                            '<p class="publicationDate"></p>' +
                            '<a href="#" target="_blank" class="btn btn-secondary btn-block stretched-link moreButton">See more</a>' +
                        '</div>' +
                    '</div>');

        card.find('.image').attr("src", article.urlToImage);
        card.find('.title').text(article.title);
        card.find('.description').text(article.description);
        card.find('.moreButton').attr("href", article.url);
 
        var d = new Date (article.publishedAt);
        var formattedDate = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        card.find('.publicationDate').text(formattedDate);

        if (article.author) {       // checks if author is not falsy i.e empty
            card.find('.author').text(article.author);
        } else {       // if falsy:
            card.find('.author').remove();
        }

        $("#newsContainer").append(card);
        $("#" + countryCode + "_flag").parent().addClass("active");
    }
}

function displayError(errorCode) {
    var errorElement = '<div class="error">';
    if(errorCode) { // only show errorCode if we get a valid one (prevents from showing '0')
        errorElement += '<h1>' + errorCode + '</h1>';
    }
    errorElement += '<h2>Internal server error</h2>' +
        '<p>Sorry we couldn\'t fetch your news at the moment.</p>' +
        '<p>Please try again later.</p>' +
    '</div>';
    var errorMessage = $(errorElement);

    $("#newsContainer").empty();    // clears news if present
    $("#mainContainer").append(errorMessage);
}
