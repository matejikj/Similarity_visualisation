function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

var mytext = getUrlParam('dataset','http://visualisation.jmatejik.eu/data/example2.json');
var mydepth = getUrlParam('maxdepth','10');
export var maxActiveDepth = parseInt(mydepth);

const request = new XMLHttpRequest();
request.open("GET", mytext, false);
request.send(null);
export var jsonSource = JSON.parse(request.responseText);

export var links = createLinks(jsonSource);
export var nodesArray = createNodes(links);
export var paths = createPaths(jsonSource, links);

export function createLinks(source) {
    let linkArray = [];

    for (let i = 0; i < source.hierarchy.length; i++){
        let link = {};
        link.id = i;
        link.source = source.hierarchy[i][2];
        link.target = source.hierarchy[i][0];
        linkArray.push(link);
    }

    return linkArray;
}

export function createPaths(source, l) {
    let pathArray = [];
    pathArray.push({ from: "Select", to: "path..."});
    let array = createNodes(l);

    console.log(source);

    if ( source.paths == undefined ){
        return undefined;
    }

    for (let i = 0; i < source.paths.length; i++){
        let path = {};
        path.from = source.paths[i].from[0];
        path.to = source.paths[i].to[0];
        path.vertices = [];
        for ( let j = 0 ; j < source.paths[i].path.length ; j++ ){
            path.vertices.push(source.paths[i].path[j]);
        }
        path.directions = [];
        for (let j = 0 ; j < (path.vertices.length - 1) ;j++ ){
            let node = array.filter( x => x.url === path.vertices[j])[0];
            let parent = node.parents.filter( x => x.url === path.vertices[j+1])[0];
            if ( parent === undefined ){
                path.directions.push(0);
            }
            else{
                path.directions.push(1);
            }
        }

        let up = 0;
        let down = 0;
        for (let j = 0 ; j < path.directions.length ; j++ ){
            if (path.directions[j] == 1 ){
                up++;
            } else {
                down++;
            }
        }
        path.up = up;
        path.down = down;
        path.height = 0;
        if (up > down){
            path.height = up;
        }
        else{
            path.height = down;
        }
        pathArray.push(path);
    }
    console.log(pathArray);
    return pathArray;
}

function initializeNodes(links) {

    let tmpArray = [];
    let nArray = [];

    let root = {};

    root.color = null;
    root.depth = null;
    root.isInPath = null;
    root.pathDepth = null;
    root.title = null;
    root.parents = [];
    root.children = [];
    root.shortcut = "";
    root.url = "root";
    nArray.push(root);

    for (let i = 0 ; i < links.length; i++){
        if ( ! tmpArray.includes( links[i].target)){

            tmpArray.push(links[i].target);

            let newSource = {}
            newSource.color = null;
            newSource.depth = null;
            newSource.isInPath = null;
            newSource.pathDepth = null;
            newSource.title = null;// $.getValues(links[i].target.split("/")[4]);
            newSource.parents = [];
            newSource.children = [];
            newSource.shortcut = null;
            newSource.url = links[i].target;
            nArray.push(newSource);
        }
        if ( !tmpArray.includes( links[i].source)){

            tmpArray.push(links[i].source);

            let newTarget = {};
            newTarget.color = null;
            newTarget.depth = null;
            newTarget.isInPath = null;
            newTarget.pathDepth = null;
            newTarget.title = null;
            newTarget.parents = [];
            newTarget.children = [];
            newTarget.shortcut = null;
            newTarget.url = links[i].source;
            nArray.push(newTarget);
        }
    }

    return nArray;
}

export function createNodes(links){

    let counter = 0;

    let nodes = initializeNodes(links);

    for (let i = 0; i < nodes.length; i++){
        let url = nodes[i].url;

        for (let j = 0 ; j < links.length; j++){
            if (links[j].target == url){
                let source = nodes.filter(node => node.url == links[j].source)[0];
                nodes[i].parents.push(source);
            }
            if (links[j].source == url){
                let target = nodes.filter(node => node.url == links[j].target)[0];
                nodes[i].children.push(target);
            }
        }
    }

    let rootsArray = nodes.filter(node => node.parents.length == 0);

    let root = nodes.filter(node => node.url == "root")[0];

    for(let i = 0 ; i < rootsArray.length; i++){
        if (rootsArray[i].url != "root"){
            rootsArray[i].parents.push(root);
            root.children.push(rootsArray[i]);
        }
    }

    for (let i = 0; i < nodes.length ; i++){
        nodes[i].id = i;
    }

    return nodes;
}

export var maxDepth = 0 ;

export function buildTree(id, depth){

    //for (let i = 0 ; i < treeArray.length; i++){
    //    treeArray[i].depth = null;
    //}

    maxDepth = 0;

    nodesArray = createNodes(links);
    let origin = copyObj(nodesArray.filter(node => node.id === id)[0]);
    origin.depth = 0;
    nodesArray[origin.id] = origin.depth;

    let queue = [];

    queue.push(origin);

    let node;

    while( queue.length != 0 ){
        node = queue.shift();

        if (node == null){
            console.log("jsem zde");
        }

        if (node.children == null){
            console.log("jsem zde");
        }

        if (node.children.length != 0 ){
            for (let i= 0 ; i < node.children.length; i++){
                const children = copyObj(node.children[i]);
                node.children[i] = children;
                children.depth = node.depth + 1;

                console.log(children.depth);

                if (maxDepth < node.depth + 1){
                    maxDepth = node.depth + 1;
                }

                nodesArray[children.id].depth = children.depth;
                if (node.depth + 1 < depth){
                    queue.push(node.children[i]);
                } else {
                    if ( node.depth + 1 == depth){
                        node.children[i].children = [];
                        node.children[i].value = 1;
                    }
                }
            }
        }
        else {
            node.children = [];
            node.value = 1;
        }
    }
    //origin.color = 'white';
    return origin;
}

function copyObj(src) {
    return Object.assign({}, src);
}

// jQuery.extend({
//     getValues: function(id) {
//         var result = null;
//         var url = "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + id + "&languages=en&props=labels&format=json";
//         $.ajax({
//             url: url,
//             type: 'get',
//             dataType: 'json',
//             async: false,
//             success: function(data) {
//                 for (var i in data.entities) {
//                     if (data.entities.hasOwnProperty(i)) {
//                         result = data.entities[i].labels.en.value ;
//                     }
//                 }
//             }
//         });
//         return result;
//     }
// });
