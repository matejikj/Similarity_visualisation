function createNodes( myObject){
    arr = [];
    pole = [];
    for (let i = 0; i < myObject.data.hierarchy.length; i++){
        if ( !( pole.includes( myObject.data.hierarchy[i][0]) ) ){
            pole.push(myObject.data.hierarchy[i][0]);
            let node = {};
            node.id = myObject.data.hierarchy[i][0];
            node.label = myObject.data.hierarchy[i][0];
            arr.push(node);
        }
        if ( !( pole.includes( myObject.data.hierarchy[i][2]) ) ){
            pole.push(myObject.data.hierarchy[i][2]);
            let node = {};
            node.id = myObject.data.hierarchy[i][2];
            node.label = myObject.data.hierarchy[i][2];
            arr.push(node);
        }
    }
    return arr;
}


function createEntities(myObject){
    entityArray = [];
    console.log(myObject);
    for (let i = 0 ; i < myObject.data.entities.length; i++){
        for (let j = 0 ; j < myObject.data.entities[i].mapping.length; j++){

        }
    }
}

entities = [];
entities = createEntities(myJson);

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
    var remainingNodes = nody.slice();
    var remainingLinks = linky.slice();
    var newArray = nody.slice();
    var level = 0;
    var deleted = 0;
    for (let i = 0 ; i<remainingNodes.length; i++){
        remainingNodes[i].thisLayer = false;
        remainingNodes[i].nextLayer = true;
    }
    for ( let i = 0; i < remainingNodes.length; i++){
        for (let j = 0; j < remainingLinks.length; j++){
            if ( remainingLinks[j].source === remainingNodes[i].id ){
                remainingNodes[i].nextLayer = false;
            }
        }
    }
    while (deleted < countNodes ){
        lastDeleted = deleted;
        level++;
        maxLevel = level;
        for(let i = 0 ; i < remainingNodes.length; i++){
            if (remainingNodes[i].nextLayer){
                remainingNodes[i].thisLayer = true;
                remainingNodes[i].nextLayer = false;
            }
        }
        for ( let i = 0; i < remainingNodes.length; i++){
            if (remainingNodes[i].thisLayer){
                for(let j = 0; j<remainingLinks.length; j++){
                    if(remainingLinks[j].target === remainingNodes[i].id){
                        for(let k = 0 ; k < remainingNodes.length; k++){
                            if (remainingNodes[k].id === remainingLinks[j].source ){
                                remainingNodes[k].nextLayer = true;
                            }
                        }
                        remainingLinks.splice(j,1);
                        j--;
                    }
                }
            }
        }
        for ( let i = 0; i < remainingNodes.length; i++){
            if (remainingNodes[i].thisLayer){
                newArray.find(x => x.id === remainingNodes[i].id).level = level;
                remainingNodes.splice(i,1);
                i--;
                deleted++;
            }
        }
    }
    return newArray;
}

function convert(nody, linkss){
    var loadedName;
    for ( let i = 0 ; i < nody.length; i++){
        loadedName = nody[i].id;
        for (let j = 0 ; j < linkss.length; j++){
            if (linkss[j].source === loadedName){
                linkss[j].source = i;
            }
            if (linkss[j].target === loadedName){
                linkss[j].target = i;
            }
            linkss[j].strength = 0.7;
        }
        nody[i].id = i;
    }
}

var links = (createLinks(myJson));
var nodes = buildHierarchy((createNodes(myJson)),links);

convert(nodes,links);

console.log(nodes);
console.log(links);
var myColor = d3.scaleSequential().domain([1,maxLevel])
    .interpolator(d3.interpolateRdYlBu);


//part for legend


//end legend

var width = 960;
var height = 700;

var label = {
    'nodes': [],
    'links': []
};

nodes.forEach(function(d, i) {
    label.nodes.push({node: d});
    label.nodes.push({node: d});
    label.links.push({
        source: i * 2,
        target: i * 2 + 1
    });
});

var graphLayout = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(1))
    .force("y", d3.forceY(height / 2).strength(1))
    .force("link", d3.forceLink(links).id(function(d) {return d.id; }).distance(50).strength(1))
    .on("tick", ticked);

var adjlist = [];

links.forEach(function(d) {
    adjlist[d.source.index + "-" + d.target.index] = true;
    adjlist[d.target.index + "-" + d.source.index] = true;
});

function neigh(a, b) {
    return a == b || adjlist[a + "-" + b];
}


var svg = d3.select("svg").attr("width", width).attr("height", height);
var container = svg.append("g");

svg.call(
    d3.zoom()
        .scaleExtent([.1, 4])
        .on("zoom", function() { container.attr("transform", d3.event.transform); })
);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr('refX', 20)//so that it comes towards the center.
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var link = container.append("g").attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr('marker-start', (d) => "url(#arrow)")
    .attr("stroke", "#aaa")
    .attr("stroke-width", "1px");

var node = container.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", function (d) {
        if (d.level === 1){
            return 5;
        }
        else{
            return 5;
        }
    })
    .attr("fill", function(d) {
        if (d.level === 1){
            return "black"
        }
        else{
            return myColor(d.level)
        }
    });


node.on("mouseover", focus).on("mouseout", unfocus);

node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
);

function ticked() {
    node.call(updateNode);
    link.call(updateLink);
}

function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
}

function focus(d) {
    tooltip.transition()
        .duration(300)
        .style("opacity", .8);
    tooltip.html("Name:" + d.id + "<p/>level:" + d.level)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");

    var index = d3.select(d3.event.target).datum().index;
    node.style("opacity", function(o) {
        return neigh(index, o.index) ? 1 : 0.1;
    });

    link.style("opacity", function(o) {
        return o.source.index == index || o.target.index == index ? 1 : 0.1;
    });

}

function unfocus() {
    tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    node.style("opacity", 1);
    link.style("opacity", 1);
}

function updateLink(link) {
    link.attr("x1", function(d) { return fixna(d.source.x); })
        .attr("y1", function(d) { return fixna(d.source.y); })
        .attr("x2", function(d) { return fixna(d.target.x); })
        .attr("y2", function(d) { return fixna(d.target.y); });
}

function updateNode(node) {
    node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) graphLayout.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

/*

puvodni graf

var myColor = d3.scaleSequential().domain([1,12])
    .interpolator(d3.interpolateRdYlBu);
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
    .force('charge', d3.forceManyBody().strength(-150))
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
    .attr("fill", function(d){return myColor(d.level) })
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
function mouseover(d) {
    d3.select(this).append("text")
        .attr("class", "hover")
        .attr('transform', function(d){
            return 'translate(5, -10)';
        })
        .text(d.name + ": " + d.id);
}
function mouseout(d) {
    d3.select(this).select("text.hover").remove();
}
var textElements = svg.append("g")
    .attr("class", "texts")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .style("visibility", "hidden")
    .text(function (node) { return  node.label })
    .attr("font-size", 15)
    .attr("dx", 15)
    .attr("dy", 4)
function getRndInteger(max) {
    return Math.floor(Math.random() * (max*2) ) -max;
}
simulation.nodes(nodes).on('tick', () => {
    nodeElements
        .attr('cx', function (node) { return node.x })
        .attr('cy', function (node) {
            if (node.level ===1){
                return height-20;
            }
            else{
                if (node.level === maxLevel){
                    return 10;
                }
                else{
                    return (height - node.level/maxLevel*height);
                }
            }
        })
    textElements
        .attr('x', function (node) { return node.x })
        .attr('y', function (node) {
            if (node.level ===1){
                return height-20;
            }
            else{
                if (node.level === maxLevel){
                    return 10;
                }
                else{
                    return (height - node.level/maxLevel*height);
                }
            }
        })
    linkElements
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) {
            if (link.source.level === 1){
                return height-20;
            }
            else{
                if (link.source.level === maxLevel){
                    return 10;
                }
                else{
                    return (height - link.source.level/maxLevel*height);
                }
            }                        })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) {
            if (link.target.level ===1){
                return height-20;
            }
            else{
                if (link.target.level === maxLevel){
                    return 10;
                }
                else{
                    return (height - link.target.level/maxLevel*height);
                }
            }
        })
})
simulation.force("link").links(links)

 */

/*

nejjednodussi simulace pomoci d3.v3

var svg = d3.select('svg');

svg.attr('width', 900).attr('height', 900);

var force = d3.layout.force()
    .gravity(0.5)
    .distance(200)
    .charge(-300)
    .nodes(nodes)
    .links(links)
    .size([900, 900])
    .start();

var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);
node.append('circle')
    .attr('r', 13)
    .attr('fill', "black");

node.append("text")
    .attr("dx", -8)
    .attr("dy", 8)
    .style("font-size", "9px")

    .text(function (d) {
        return d.id
    });

force.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });
    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
});


 */