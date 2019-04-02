const fetch = require('node-fetch');
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const proxy_url = 'https://cors-anywhere.herokuapp.com/';
const base_url = 'https://sofifa.com';
let html = '';

export async function getLeagues() {
    const res = await fetch(proxy_url + base_url + '/leagues');
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    const nodes = xpath.select("//a[contains(@href,'/league/')]", doc);
    
    // Dictionary to save id league and its name
    var dict = [];

    for(var i = 0; i < nodes.length; i++){
        doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(nodes[i].toString());
        var aux = xpath.select('//a/@href',doc);
        var id = aux[0].value.toString().replace('/league/','');
        console.log((i+1) + ': ' + '(id:'+ id + ') ' + nodes[i].firstChild.data);
        dict.push({id: id, value:nodes[i].firstChild.data});
    }
    console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
    console.log("Node: " + nodes[0].toString());
    return dict;
}

export async function getTeams(id) {
    const res = await fetch(proxy_url + base_url + '/teams?lg=' + id);
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    const nodes = xpath.select("//a[contains(@href,'/team/')]", doc);
    console.log(nodes)
    // Dictionary to save id Team and its name
    var dict = [];

    for(var i = 0; i < nodes.length; i++){
        doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(nodes[i].toString());
        var aux = xpath.select('//a/@href',doc);
        var id = aux[0].value.toString().replace('/team/','');
        dict.push({id: id, value:nodes[i].firstChild.data});
    }
    return dict;
}

