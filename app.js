//Initial array of stock
const stocks = ['ORCL', 'AAPL', 'MSFT', 'TSLA', 'WMT'];
let validationList = [''];

//Create buttons for each stock symbol in the array

const render = function () {
    $("#buttons-view").empty();
    for (let i = 0; i < stocks.length; i++) {
        const button = $("<button>").addClass("btn stock-btn");
        button.attr('data-name', stocks[i]);
        $("#buttons-view").append(button.text(stocks[i]));
    }
}
render();


// This api call  retrieve all the stock symbols available on iextrading

$.ajax({
    url: 'https://api.iextrading.com/1.0/ref-data/symbols',
    method: 'GET',
}).then(function (promise) {
    for (let i = 0; i < promise.length; i++) {
        validationList.push(promise[i].symbol);
    }
});
console.log(validationList);


//This function handle event when the add button is clicked

const addButton = function (e) {
    e.preventDefault();
    const stockTicker = $("#stock-input").val().trim().toUpperCase();
    for (let i = 0; i < validationList.length; i++) {
        if (stockTicker === validationList[i]){
            stocks.push(stockTicker); 
        }
    }
    $("#stock-input").val('');
    render();
}


//This function allows users to store their favorite stocks

let favArr = []
const favorite = function (e) {
    e.preventDefault();
    const favStock = $("#stock-input").val().trim().toUpperCase();
    favArr.push(favStock);
    $("#stock-input").val('');
   addFav();
}

//This function allows users to display their favorite stocks

const addFav = function () {
    $('.favStocks').empty();
    for (let i = 0; i < favArr.length; i++) {
        const favBtn = $("<button>"). addClass("btn fav-btn");
        favBtn.attr("data-name", favArr[i]);
        $(".favStocks").append(favBtn.text(favArr[i]));

    }
}
addFav();

//This function clears up the favorite section

const clear = function () {
    $(".favStocks").empty();
}
clear();


// This function displays  stock informations

const displayInfo = function () {
    //Grab the stock symbol from the button
    const stock = $(this).attr('data-name');
    const queryUrl = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,price,company,news`;
    //Ajax call
    $.ajax({
        url: queryUrl,
        method: 'GET',
    }).then(function (response) {
        console.log(queryUrl);
        console.log(response);
        //card body content html
        const cardBody = $('<h3>').addClass('card-title text-center');
        //Grab and append the company logo to the card body
        const companyLogo = response.logo.url;
        cardBody.append(`<img src=${companyLogo} alt='logo'>`);
        // Grab and append the company name to the card body  
        const companyName = response.quote.companyName;
        cardBody.append(`<strong>${companyName}</strong>`);
        //Create a table to display stock price, company CEO, sector and industry
        const table = $('<table>').addClass('table table-bordered');
        //Create table head
        table.append('<thead class="text-center"><tr><th scope="col-md-1">CEO</th><th scope="col-md-1">Sector</th><th scope="col-md-1">Industry</th><th scope="col-md-1" class="bg-danger">Stock Price</th></tr></thead>');
        //Create table body
        const tbody = $('<tbody>');
        //Create a new table row
        const trow = $('<tr class="text-center">');
        //Grab the stock price and append it to the card body
        const CEO = $('<td>').text(response.company.CEO);
        const sector = $('<td>').text(response.company.sector);
        const industry = $('<td>').text(response.company.industry);
        const stockPrice = $('<td>').text(response.price);
        //Append the table elements to their parents
        trow.append(CEO, sector, industry, stockPrice);
        tbody.append(trow);
        table.append(tbody);
        //Create an html to display the description
        const descrpDiv = $('<div>').addClass('description');
        descrpDiv.html('<h5 class="card-title font-weight-bold" id="sub-title">Description</h5>');
        //Grab the company description and append it to the description div
        const description = response.company.description;
        descrpDiv.append(`<p>${description}</p>`);
        //Append the cardBody to the page
        $("#stock-view").append(cardBody);
        //Append the description to the page
        $("#stock-view").append(descrpDiv);
        // Append the table to the page
        $("#stock-view").append(table);
        //create a new list for the news and append it to the page
        const list = $('<ul class="list-group list-group-flush news-list">');
        $("#stock-view").append(list);
        list.html('<li class="card-title"><h5 class="font-weight-bold" id="sub-title">News</h5></li>')
        //Grab news articles related to the stock
        const stockNews = response.news;
        for (let i = 0; i < stockNews.length; i++) {
            list.append(displayNews(stockNews[i], i));

        };


    });
}

displayNews = function (news, index) {

    const newsLink = $('<a>').attr('href', news.url);
    //Append the headline to the newslink
    const headline = news.headline;
    newsLink.append(`<h5><span class="badge badge-info">${index + 1}</span><strong>${headline}</strong></h5>`);
    const newsItems = $('<li>').addClass("list-group-item");
    newsItems.append(newsLink);

    return newsItems;
}

//Event listener
$("#add-btn").on('click', addButton);
$('#favorite-btn').on('click', favorite);
$("#clear-btn").on('click', clear);
$("#buttons-view").on('click', '.stock-btn', displayInfo);
