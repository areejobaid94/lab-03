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
    console.log(template);
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
    });
    $.ajax({ url: "data/page-2.json", dataType: 'json' }).then(function (data) {
        data.forEach(ele => {
            addingToSen = true;
            new card(ele);
        });
        console.log(allArrSen,'allArrSen')
    });
    $("#sort-by").val('title');
    $(`#quick-sort-title`).css('color', 'red');
    $('#select').on('change', function (e) {
        selectedKey = this.value;
        updateSelectedArr(selectedKey)
        sortBy();
    });

    $('#sort-by').on('change', function (e) {
        selectedSort = this.value;
        if (selectedSort != 'default' && selectedSort != undefined) {
            sortBy();
            $('button').css('color', 'gray');
            $(`#quick-sort-${selectedSort}`).css('color', 'red');
        }
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
        updateSelectedArr(selectedKey);
        $('#switch-second-page').css('color', 'gray');
        $(this).css('color', 'red');
        $('#allFirItems').show();
        $('#switch-first-page').hide();
    })

    $('#switch-second-page').on('click', function (e) {
        e.preventDefault();
        id = 'allSenItems';
        selectedSort = 'title';
        $('#switch-first-page').css('color', 'gray');
        $(this).css('color', 'red');
        $('#switch-first-page').show();
        $('#allFirItems').hide();
        console.log(selectedArr)
        allArrSen.forEach(ele =>{
            $('main').append(ele.renderSen());
        })
        
    })
})

card.prototype.appendSelector = function () {
    $("#select").append(new Option(this.keyword, this.keyword));
}

function sortBy() {
    if (selectedSort != undefined || selectedSort != 'default') {
        selectedArr = selectedArr.sort((a, b) => (a[selectedSort] > b[selectedSort]) ? 1 : (a[selectedSort] === b[selectedSort]) ? ((a[selectedSort] > b[selectedSort]) ? 1 : -1) : -1)
    }
    showAll(selectedArr, true);
}

function showAll(selArr, isNotFirstTime) {
    $(`#${id}`).empty();
    selArr.forEach(element => {
        let newCard;
        isNotFirstTime == false ? newCard = new card(element) : newCard = element;
        if (arr.includes(newCard.keyword) == false) {
            arr.push(newCard.keyword);
            newCard.appendSelector();
        }
        newCard.render();
    });
}

function updateSelectedArr(val) {
    let locArr = id == 'allFirItems'? allArr : allArrSen;
    if (val != undefined && val != 'default') {
        selectedArr = [];
        locArr.forEach(ele => {
            if (ele['keyword'] === val) {
                selectedArr.push(ele);
            }
        });
    }else{
        locArr = allArr.slice();
    }
    console.log(selectedArr)
}