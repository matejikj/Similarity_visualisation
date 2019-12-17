dataset1 = getDatasetTree(0, jsonSource);
dataset2 = getDatasetTree(1, jsonSource);

var activeDepth = 1;
var maxActiveDepth = 10;
var activeRootLevel = 0;
var activeRootId = 0;
var activeRootPath = [];
var activePath = undefined;

var leftMapNodes = [];
var rightMapNodes = [];

console.log(window.location.href);

paintTree(activeRootId, activeDepth, leftMapNodes, rightMapNodes);
initTreeMaps();


var zoomSlider = d3.select("#zoomRange")
    .on("input", function () {

        let depth = parseInt(d3.select(this).property('value'));
        console.log( depth );


        if ( depth < activeDepth + activeRootLevel ) {
            if ( activeDepth > 1 ){
                activeDepth--;
            } else {
                let n = activeDepth + activeRootLevel - depth;
                while ( n != 0 ) {
                    let item = activeRootPath.pop();
                    activeRootId = item;
                    activeRootLevel--;
                    n--;
                }
                activeDepth = 1;
            }
        } else {
            activeDepth = depth;
        }


        paintTree(activeRootId, activeDepth, leftMapNodes, rightMapNodes);
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
        activeRootLevel = 0;
        activeDepth = 1;
        activeRootId = parseInt(activePath.vertices[activePath.up]);
        activeRootPath = [];
        leftMapNodes.push(activePath.vertices[0]);
        rightMapNodes.push(activePath.vertices[activePath.vertices.length-1]);

    } else {
        initTreeMaps();
        activePath = undefined;
    }
    paintTree(activeRootId, activeDepth, leftMapNodes, rightMapNodes);
};

/*
get data functions
 */

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
                paintTree(activeRootId, activeDepth, leftMapNodes, rightMapNodes);
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
