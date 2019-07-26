$(document).ready(function () {

    fetchNews("us");

    //  define click events dynamically based on html list (flags) 
    $("#navFlagsList").find("li").each(function(idx, li) {
        var id= $(li).find('img').attr("id");
        var countryCode = id.substring(0, 2);
        $("#" + id).click(function () {
            fetchNews(countryCode);
        });
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
            url: "https://newsapi.org/v2/top-headlines?country=" + countryCode + "&apiKey=1b8423915d9c4caa8c5d2913325d7f01",
            success: function (result) {
                replaceContent(result, countryCode);
            }
        });
    }
}

function replaceContent(res, countryCode) {
    $("#newsContainer").empty();
    $(".flag-icon").removeClass("active");

    for(let i = 0; i < res.articles.length; i++) {
        var article = res.articles[i];
        var card = $('<div class="card">' +
                '<img class="card-img-top image" src="" alt="news image">' +
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