dataset1 = getDatasetTree(0, jsonSource);
dataset2 = getDatasetTree(1, jsonSource);

var activeMode = 1;
var activeDepth = 1;
var activeRootId = 0;
var activeRootPath = [];
activeRootPath.push(0);
var activePath = undefined;

var leftMapNodes = [];
var rightMapNodes = [];

console.log(window.location.href);

//paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);

paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);
initTreeMaps();

var btnUndo = d3.select("#btn-undo")
    .on("click", undo);

var modeSlider = d3.select("#modeRange")
    .on("change", function () {
        let n = d3.select('#treeRight')
            .call(checkboxValues);

        activeMode = parseInt(d3.select(this).property('value'));
        leftMapNodes = [];
        rightMapNodes = [];
        let hidePaths = d3.select("#paths");
        let hideSelectedPath = d3.select("#selectedPath");
        switch (activeMode) {
            case 1:
                activePath = undefined;
                hidePaths.attr("style", "display: none;");
                hideSelectedPath.attr("style", "display: none;");
                break;

            case 2:
                hidePaths.attr("style", "display: inline;").property("selectedIndex", 0);
                hideSelectedPath.attr("style", "display: inline;");
                break;
        }
        initTreeMaps();
        paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);
        initTreeMaps();
        //chci odstranit linky
        //chci vykreslit zakldni pohled na root, dokud si nevyberu cestu/cesty, ktere chci zobrazit
    });

var zoomSlider = d3.select("#zoomRange")
    .on("change", function () {
        activeDepth = parseInt(d3.select(this).property('value'));
        paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);
        //chci prekreslit strom, porad stejny root, jenom jina hloubka zobrazeni
        //spolu s tim i prekreslit linky do nodeu
        //budu posilat i to v jakem jsem modu a budu se rozhodovat az v printtree

    });

var pathsDropdown = d3.select("#paths")
    .on("change", pathsDropdownChange);

pathsDropdown
    .selectAll("option")
    .data(paths)
    .enter().append("option")
    .attr("value", function (d, i) {
        return i;
    })
    .text(function (d) {
        return d.from + " to " + d.to ; // capitalize 1st letter
    });

function pathsDropdownChange() {
    id = parseInt(d3.select(this).property('value'));
    leftMapNodes = [];
    rightMapNodes = [];
    if (id != 0){
        activePath = paths[id];
        leftMapNodes.push(activePath.vertices[0]);
        rightMapNodes.push(activePath.vertices[activePath.vertices.length-1]);

    } else {
        activePath = undefined;
    }
    paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);
};

/*
get data functions
 */


function getDatasets(data) {
    arr = [];
    arr.push("Open this select menu");
    for(let i = 0 ; i < data.data.entities.length; i++ ){
        arr.push(data.data.entities[i].mapping[0].from[0])
    }
    return arr;
};

function getDatasetTree(id, data){

    let array = [];
    let root = {};

    root.url = "root";

    array.push(root);

    for (let i = 0 ; i < data.data.entities[id].mapping.length; i++ ){

        let parent = {};
        parent.url = data.data.entities[id].mapping[i].by[0];
        parent.parent = root.url;

        array.push(parent);

        for ( let j = 0 ; j < data.data.entities[id].mapping[i].to.length ; j++ ){
            let child = {};
            child.url = data.data.entities[id].mapping[i].to[j];
            child.parent = parent.url;
            array.push(child);
        }
    }
    return array;
}

/*
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
    } else {
        arr.push("Open this select menu");
        for(let i = 0 ; i < data.data.entities[indexFrom].mapping[indexBy].to.length; i++ ){
            arr.push(data.data.entities[indexFrom].mapping[indexBy].to[i])
        }
    }
    return arr;
}
*/

// Node content
function renderNode(selection, rcd, treeId) {
    if (rcd.parent != "root"){
        selection.append('input')
            .attr('type', 'checkbox')
            .attr('class', 'label-tree')
            .on('change', function (d) {
                if (this.checked){
                    switch (treeId) {
                        case 0:
                                leftMapNodes.push(d.data.url);
                            break;
                        case 1:
                                rightMapNodes.push(d.data.url);
                            break;
                    }
                } else {
                    let index = -1;
                    switch (treeId) {
                        case 0:
                            index = leftMapNodes.indexOf(d.data.url);
                            if (index !== -1) leftMapNodes.splice(index, 1);
                            break;

                        case 1:
                            index = rightMapNodes.indexOf(d.data.url);
                            if (index !== -1) rightMapNodes.splice(index, 1);
                            break;

                    }
                }
                paintTree(activeRootId, activeDepth, activeMode, leftMapNodes, rightMapNodes);
            });
    }
    selection.append('span')
        .text(rcd.url);
}

// Return array of ids that is checked
function checkboxValues(selection) {
    return selection.select('.body')
        .selectAll('input:checked').data().map(d => d.url);
}

// Recursively append child nodes
function nextLevel(selection, node, treeId) {
    const label = selection.append('span');
    const arrow = label.append('span').classed('arrow', true);
    label.call(renderNode, node.data, treeId);
    if (!node.hasOwnProperty('children')) return;
    const items = selection.append('ul')
        .style('list-style-type', 'none')
        .selectAll('li')
        .data(node.children, d => d.url);
    items.exit().remove();
    items.enter()
        .append('li').merge(items)
        .each(function (d) {
            d3.select(this).call(nextLevel, d, treeId);
        });
    label.select('.arrow')
        .text('▼ ')
        .on('click', function () {  // Collapse on click
            const childList = selection.select('ul');
            if (!childList.size()) return;
            const expanded = childList.style('display') !== 'none';
            d3.select(this).text(expanded ? '▶ ' : '▼ ');
            childList.style('display', expanded ? 'none' : 'inherit');
        });
}

// Generate tree view
function tree(selection) {
    selection
        .classed('viewport', true)
        .style('overflow-y', 'scroll')
        .style('overflow-x', 'hidden')
        .style('height', height+'px')
        .append('div')
        .classed('body', true)
        .style('transform', 'scale(1.5)')
        .style('transform-origin', 'top left');
}

// Update tree data
function updateTree(selection, items, treeId) {
    const root = d3.stratify()
        .id(d => d.url)
        .parentId(d => d.parent)(items);
    selection.select('.body')
        .call(nextLevel, root, treeId);
    // Remove dummy root node
    selection.select('.body > span').remove();
    selection.select('.body > ul').style('padding-left', 0);
}
function initTreeMaps(){
    // Render
    d3.select('#treeLeft div').remove();
    d3.select('#treeLeft').append('div')
        .call(tree)
        .call(updateTree, dataset1, 0 );

// Render
    d3.select('#treeRight div').remove();
    d3.select('#treeRight').append('div')
        .call(tree)
        .call(updateTree, dataset2, 1);
}
