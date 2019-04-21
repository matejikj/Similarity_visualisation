var request = new XMLHttpRequest();
request.open("GET", "matejik.json", false);
request.send(null);
var myJson = JSON.parse(request.responseText);

function createNodes( myObject){
    arr = [];
    pole = [];
    for (let i = 0; i < myObject.data.hierarchy.length; i++){
        if ( !( pole.includes( myObject.data.hierarchy[i][0]) ) ){
            pole.push(myObject.data.hierarchy[i][0]);
            let node = {};
            node.id = myObject.data.hierarchy[i][0];
            node.label = myObject.data.hierarchy[i][0];
            node.type = myObject.data.hierarchy[i][1];
            arr.push(node);
        }
        if ( !( pole.includes( myObject.data.hierarchy[i][2]) ) ){
            pole.push(myObject.data.hierarchy[i][2]);
            let node = {};
            node.id = myObject.data.hierarchy[i][2];
            node.label = myObject.data.hierarchy[i][2];
            node.type = myObject.data.hierarchy[i][1];
            arr.push(node);
        }
    }
    return arr;
}
function createLinks( myObject){
    arr = [];
    for (let i = 0; i < myObject.data.hierarchy.length; i++){
        let link = {};
        link.source = myObject.data.hierarchy[i][2];
        link.target = myObject.data.hierarchy[i][0];
        arr.push(link);
    }
    return arr;
}

var countNodes = 0;

function buildHierarchy( nody, linky ){
    countNodes = nody.length;
    var zbyvajiciVrcholy = nody.slice();
    var zbyvajiciLinky = linky.slice();
    var arr = nody.slice();
    var level = 0;
    var odstraneno = 0;

    for (let i = 0 ; i<zbyvajiciVrcholy.length; i++){
        zbyvajiciVrcholy[i].thisLayer = false;
        zbyvajiciVrcholy[i].nextLayer = true;
    }

    for ( let i = 0; i < zbyvajiciVrcholy.length; i++){
        for (let j = 0; j < zbyvajiciLinky.length; j++){
            if ( zbyvajiciLinky[j].source === zbyvajiciVrcholy[i].id ){
                zbyvajiciVrcholy[i].nextLayer = false;
            }
        }
    }

    while (odstraneno < countNodes ){
        naposledOdstraneno = odstraneno;
        level++;
        maxLevel = level;

        for(let i = 0 ; i < zbyvajiciVrcholy.length; i++){
            if (zbyvajiciVrcholy[i].nextLayer){
                zbyvajiciVrcholy[i].thisLayer = true;
                zbyvajiciVrcholy[i].nextLayer = false;
            }
        }

        for ( let i = 0; i < zbyvajiciVrcholy.length; i++){
            if (zbyvajiciVrcholy[i].thisLayer){
                for(let j = 0; j<zbyvajiciLinky.length; j++){
                    if(zbyvajiciLinky[j].target === zbyvajiciVrcholy[i].id){
                        for(let k = 0 ; k < zbyvajiciVrcholy.length; k++){
                            if (zbyvajiciVrcholy[k].id === zbyvajiciLinky[j].source ){
                                zbyvajiciVrcholy[k].nextLayer = true;
                            }
                        }
                        zbyvajiciLinky.splice(j,1);
                        j--;
                    }
                }
            }
        }

        for ( let i = 0; i < zbyvajiciVrcholy.length; i++){
            if (zbyvajiciVrcholy[i].thisLayer){
                arr.find(x => x.id === zbyvajiciVrcholy[i].id).level = level;
                zbyvajiciVrcholy.splice(i,1);
                i--;
                odstraneno++;
            }
        }
    }
    return arr;
}

function convert(nody, linkss){

    var aktualniJmeno;

    for ( let i = 0 ; i < nody.length; i++){
        aktualniJmeno = nody[i].id;
        for (let j = 0 ; j < linkss.length; j++){
            if (linkss[j].source === aktualniJmeno){
                linkss[j].source = i;
            }
            if (linkss[j].target === aktualniJmeno){
                linkss[j].target = i;
            }
            linkss[j].strength = 0.7;
        }
        nody[i].id = i;
    }
}

//nodes = JSON.stringify(createNodes(myJson));
//links = JSON.stringify(createLinks(myJson));
var myNodes = (createNodes(myJson));
var myLinks = (createLinks(myJson));

var nodes = buildHierarchy(myNodes,myLinks);
var links = myLinks;

convert(nodes,links);

console.log(nodes);
console.log(links);

var myColor = d3.scaleSequential().domain([1,12])
    .interpolator(d3.interpolateRdYlBu);

function getNeighbors(node) {
    return links.reduce(function (neighbors, link) {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id)
            }
            return neighbors
        },
        [node.id]
    )
}
function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
}
function getNodeColor(node, neighbors) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
        return node.level === 1 ? 'blue' : 'green'
    }
    return node.level === 1 ? 'red' : 'gray'
}
function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
}
function getTextColor(node, neighbors) {
    return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
}
var width = window.innerWidth
var height = window.innerHeight
var svg = d3.select('svg')
svg.attr('width', width).attr('height', height)
// simulation setup with all forces
var linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return link.strength })
var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2))
var dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
}).on('drag', function (node) {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
}).on('end', function (node) {
    if (!d3.event.active) {
        simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
})
function selectNode(selectedNode) {
    var neighbors = getNeighbors(selectedNode)
    // we modify the styles to highlight selected nodes
    nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
    textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
    linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}
var linkElements = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "rgba(50, 50, 50, 0.2)")
var nodeElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 10)
    .attr("fill", getNodeColor)
    .call(dragDrop)
    .on('click', selectNode)
var textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .text(function (node) { return  node.label })
    .attr("font-size", 15)
    .attr("dx", 15)
    .attr("dy", 4)
simulation.nodes(nodes).on('tick', () => {
    nodeElements
        .attr('cx', function (node) { return node.x })
        .attr('cy', function (node) { return node.y })
    textElements
        .attr('x', function (node) { return node.x })
        .attr('y', function (node) { return node.y })
    linkElements
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) { return link.target.y })
})
simulation.force("link").links(links)