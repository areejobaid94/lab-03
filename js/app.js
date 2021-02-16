"use strict";
let arr = [];
let allArr = [];
let selectedArr = [];
let selectedKey;
let allArrSen = [];
let selectedArrSen = [];
let selectedSort;
let isFirst = true;
let id = 'allFirItems';
let addingToSen =false;
let sellectedButId = '#switch-first-page';

function card(ele) {
    this.keyword = ele.keyword;
    this.image_url = ele.image_url;
    this.title = ele.title;
    this.description = ele.description;
    this.horns = ele.horns;
    addingToSen == false ? allArr.push(this): allArrSen.push(this);
}

card.prototype.render = function () {
    let card = $("#photo-template").clone();
    card.find("img").attr("src", this.image_url);
    card.find("h2").text(this.title);
    card.find("h3").text(`Description: ${this.description}`);
    card.find(".keyword").text(`Keyword: ${this.keyword}`);
    card.find(".horns").text(`Horns: ${this.horns}`);
    card.toggleClass('card')
    card.show();
    $(`#${id}`).append(card);
}

card.prototype.renderSen = function () {
    let template = $("#allSenItems").html();
    return Mustache.render(template,this);
}


$(document).ready(() => {
    $("#photo-template").hide();
    $.ajax({ url: "data/page-1.json", dataType: 'json' }).then(function (data) {
        id = 'allFirItems';
        showAll(data, false);
        selectedArr = allArr.slice();
        selectedSort = 'title';
        sortBy();
        appendAllSelecters(allArr);
        $('#switch-first-page').css('color', 'red');
    });

    $.ajax({ url: "data/page-2.json", dataType: 'json' }).then(function (data) {
        data.forEach(ele => {
            addingToSen = true;
            new card(ele);
        });
    });
    $("#sort-by").val('title');
    $(`#quick-sort-title`).css('color', 'red');
    $('#select').on('change', function (e) {
        selectedKey = this.value;
        updateSelectedArr(selectedKey);
        sortBy();
    });

    $('#sort-by').on('change', function (e) {
        selectedSort = this.value;
        if (selectedSort != 'default' && selectedSort != undefined) {
            sortBy();
            $('button').css('color', 'gray');
            $(`#quick-sort-${selectedSort}`).css('color', 'red');
        }
        $(sellectedButId).css('color', 'red');
    });
    $('#quick-sort-horns').on('click', function (e) {
        e.preventDefault();
        selectedSort = 'horns';
        updateSelectedArr(selectedKey);
        $('#quick-sort-title').css('color', 'gray');
        $(this).css('color', 'red');
        sortBy();
        $("#sort-by").val('horns');
    })
    $('#quick-sort-title').on('click', function (e) {
        e.preventDefault();
        selectedSort = 'title';
        updateSelectedArr(selectedKey);
        $('#quick-sort-horns').css('color', 'gray');
        $(this).css('color', 'red');
        sortBy();
        $("#sort-by").val('title');
    })

    $('#switch-first-page').on('click', function (e) {
        e.preventDefault();
        id = 'allFirItems';
        $('#senContent').empty();
        $('#allFirItems').empty();
        selectedKey = 'default';
        selectedSort = 'title';
        $('#quick-sort-title').css('color', 'red');
        $('#quick-sort-horns').css('color', 'gray');
        updateSelectedArr(selectedKey);
        $('#switch-second-page').css('color', 'gray');
        $(this).css('color', 'red');
        sortBy();
        appendAllSelecters(allArr);
        $("#sort-by").val('title');
        sellectedButId = '#switch-first-page';
    })

    $('#switch-second-page').on('click', function (e) {
        e.preventDefault();
        id = 'allSenItems';
        selectedKey = 'default';
        selectedSort = 'title';
        $('#quick-sort-title').css('color', 'red');
        $('#quick-sort-horns').css('color', 'gray');
        updateSelectedArr(selectedKey);
        $('#switch-first-page').css('color', 'gray');
        $(this).css('color', 'red');
        $('#senContent').empty();
        $('#allFirItems').empty();
        sortBy();
        appendAllSelecters(allArrSen)
        arr = [];
        // selectedArr.forEach(ele =>{
        //     console.log('hi');
        //     $('#senContent').append(ele.renderSen());
        // })
        $("#sort-by").val('title');
        sellectedButId = '#switch-second-page';
    })
})


card.prototype.appendSelector = function () {
    $("#select").append(new Option(this.keyword, this.keyword));
}

function sortBy() {
    if (selectedSort != undefined || selectedSort != 'default') {
        selectedArr = selectedArr.sort((a, b) => (a[selectedSort] > b[selectedSort]) ? 1 : (a[selectedSort] === b[selectedSort]) ? ((a[selectedSort] > b[selectedSort]) ? 1 : -1) : -1)
    }
    if(id == 'allFirItems'){
        showAll(selectedArr, true);
    }else{
        showAllSend(selectedArr, true);
    }
}

function showAll(selArr, isNotFirstTime) {
    $(`#${id}`).empty();
    selArr.forEach(element => {
        let newCard;
        isNotFirstTime == false ? newCard = new card(element) : newCard = element;
        newCard.render();
    });
}

function showAllSend(){
    $('#senContent').empty();
    selectedArr.forEach(ele =>{
        $('#senContent').append(ele.renderSen());
    })
}
function appendAllSelecters(allArray){
    arr = [];
    $("#select").empty();
    $("#select").append(new Option('All', 'default'));
    allArray.forEach(ele =>{
        if (arr.includes(ele.keyword) == false) {
            arr.push(ele.keyword);
            ele.appendSelector();
        }
    })
}
function updateSelectedArr(val) {
    let locArr = allArr;
    if(id != 'allFirItems'){
        locArr =allArrSen
    }
    if (val != undefined && val != 'default') {
        selectedArr = [];
        locArr.forEach(ele => {
            if (ele['keyword'] === val) {
                selectedArr.push(ele);
            }
        });
    }else{
        selectedArr = locArr.slice();
    }
}