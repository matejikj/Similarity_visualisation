var request = new XMLHttpRequest();
request.open("GET", "matejik.json", false);
request.send(null);
var myJson = JSON.parse(request.responseText);



var rangeZoom = d3.select("#customRange1")
    .on("change", rangeZoomChange);

var zoomIndex;

function rangeZoomChange(){
    zoomIndex = d3.select(this).property('value');
    console.log(zoomIndex);

}

entityArray = [];

function getEntities(data){
    arr = [];
    arr.push("Open this select menu");
    for(let i = 0 ; i < data.data.entities.length; i++ ){
        arr.push(data.data.entities[i].mapping[0].from[0])
    }
    return arr;
}

entityArray = getEntities(myJson);
console.log(entityArray);

//first entity selector

var entityDropdown1 = d3.select("#entitySelect1")
    .on("change", entityDropdown1Change);

entityDropdown1.selectAll("option")
    .data(entityArray)
    .enter().append("option")
    .attr("value", function (d, i) {
        return i;
    })
    .text(function (d) {
        return d; // capitalize 1st letter
    });

var entityFrom1 = [];
var indexFrom1;


function entityDropdown1Change() {
    indexFrom1 = d3.select(this).property('value') -1;
    console.log(indexFrom1);
    entityFrom1 = createMapBy(indexFrom1,myJson);
    showMapBy1();

};

var mapByDropdown1;
var indexBy1;
var mapTo1 = [];

function showMapBy1(){
    d3.select("#selectBy1")
        .selectAll("option")
        .remove();


    mapByDropdown1 = d3.select("#selectBy1")
        .on("change", mapByDropdown1Change);

    mapByDropdown1.selectAll("option")
        .data(entityFrom1)
        .enter().append("option")
        .attr("value", function (d, i) {
            return i;
        })
        .text(function (d) {
            return d; // capitalize 1st letter
        });
}

function mapByDropdown1Change() {
    indexBy1 = d3.select(this).property('value') -1;
    console.log(indexBy1);
    mapTo1 = createMapTo(indexFrom1,indexBy1,myJson);
    showMapTo1();

};

var mapToDropdown1;

function showMapTo1(){
    d3.select("#mapTo1")
        .selectAll("option")
        .remove();

    mapToDropdown1 = d3.select("#mapTo1")
        .on("change", mapToDropdown1Change);

    mapToDropdown1.selectAll("option")
        .data(mapTo1)
        .enter().append("option")
        .attr("value", function (d, i) {
            return i;
        })
        .text(function (d) {
            return d; // capitalize 1st letter
        });
}

var indexTo1;

function mapToDropdown1Change() {
    indexTo1 = d3.select(this).property('value') -1;
    console.log(indexTo1);

};


//second entity selector

var entityDropdown2 = d3.select("#entitySelect2")
    .on("change", entityDropdown2Change);

entityDropdown2.selectAll("option")
    .data(entityArray)
    .enter().append("option")
    .attr("value", function (d, i) {
        return i;
    })
    .text(function (d) {
        return d; // capitalize 1st letter
    });

var entityFrom2 = [];
var indexFrom2;

function entityDropdown2Change() {
    indexFrom2 = d3.select(this).property('value') -1;
    console.log(indexFrom2);
    entityFrom2 = createMapBy(indexFrom2,myJson);
    showMapBy2();

};

var mapByDropdown2;
var indexBy2;
var mapTo2 = [];


function showMapBy2(){
    d3.select("#selectBy2")
        .selectAll("option")
        .remove();

    mapByDropdown2 = d3.select("#selectBy2")
        .on("change", mapByDropdown2Change);

    mapByDropdown2.selectAll("option")
        .data(entityFrom2)
        .enter().append("option")
        .attr("value", function (d, i) {
            return i;
        })
        .text(function (d) {
            return d; // capitalize 1st letter
        });
}

function mapByDropdown2Change() {
    indexBy2 = d3.select(this).property('value') -1;
    console.log(indexBy2);
    mapTo2 = createMapTo(indexFrom2,indexBy2,myJson);
    showMapTo2();
};

var mapToDropdown2;

function showMapTo2(){
    d3.select("#mapTo2")
        .selectAll("option")
        .remove();

    mapToDropdown2 = d3.select("#mapTo2")
        .on("change", mapToDropdown2Change);

    mapToDropdown2.selectAll("option")
        .data(mapTo2)
        .enter().append("option")
        .attr("value", function (d, i) {
            return i;
        })
        .text(function (d) {
            return d; // capitalize 1st letter
        });
}

var indexTo2;

function mapToDropdown2Change() {
    indexTo2 = d3.select(this).property('value') -1;
    console.log(indexBy2);

};


//create mapping by

function createMapBy(indexFrom,data){
    arr = [];
    if (indexFrom < 0){
        arr.push("You must select entity");
    }
    else{
        arr.push("Open this select menu");
        for(let i = 0 ; i < data.data.entities[indexFrom].mapping.length; i++ ){
            arr.push(data.data.entities[indexFrom].mapping[i].by[0])
        }
    }

    return arr;
}

function createMapTo(indexFrom,indexBy,data){
    arr = [];
    if (data.data.entities[indexFrom].mapping[indexBy].to.length === 0){
        arr.push("none mapping to");
    }
    else{
        arr.push("Open this select menu");
        for(let i = 0 ; i < data.data.entities[indexFrom].mapping[indexBy].to.length; i++ ){
            arr.push(data.data.entities[indexFrom].mapping[indexBy].to[i])
        }
    }

    return arr;
}



