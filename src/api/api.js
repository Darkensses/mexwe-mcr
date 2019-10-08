// V3 October 5th, 2019
const fetch = require('node-fetch');
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const proxy_url = 'https://cors-anywhere.herokuapp.com/';
const base_url = 'https://sofifa.com';
let html = '';

// TODO: Add simple and full modes (simple returns {id, value} ; full returns {id, value, img})

export async function getLeagues() {
    const res = await fetch(proxy_url + base_url + '/leagues');
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    //const nodes = xpath.select("//a[contains(@href,'/league/')]", doc);
    const nodes = xpath.select("//table//tbody//tr", doc);
    
    // Dictionary to save id league and its name    
    var dict = [];

    for(var i = 0; i < nodes.length; i++){
        doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(nodes[i].toString());
        var aux = xpath.select('//a/@href',doc);
        var id = aux[0].value.toString().replace('/league/','');
        aux = xpath.select("//a[contains(@href,'/league/')]",doc)
        var name = aux[0].firstChild.data;
        aux = xpath.select("//img[contains(@src,'https://cdn.sofifa.org/leagues/')]/@data-src",doc)
        var imgSrc = aux[0].value;
        //console.log(aux);
        //console.log((i+1) + ': ' + '(id:'+ id + ') ' + nodes[i].firstChild.data);        
        console.log((i+1) + ': ' + '(id:'+ id + ') ' + name);
        //dict.push({id: id, value:nodes[i].firstChild.data, img:imgSrc});
        dict.push({id: id, value:name, img:imgSrc});
    }
    /*
    console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
    console.log("Node: " + nodes[0].toString());
    console.log(nodes[0]);
    */
    return dict;
}

export async function getTeams(idLeague) {
    const res = await fetch(proxy_url + base_url + '/teams?lg=' + idLeague);
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    //const nodes = xpath.select("//a[contains(@href,'/team/')]", doc);
    const nodes = xpath.select("//table//tbody//tr", doc);
    console.log(nodes)
    // Dictionary to save id Team and its name
    var dict = [];

    for(var i = 0; i < nodes.length; i++){
        doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(nodes[i].toString());
        var aux = xpath.select('//a/@href',doc);        
        var id = aux[1].value.toString().replace('/team/','');        
        aux = xpath.select("//a[contains(@href,'/team/')]",doc)
        var name = aux[0].firstChild.data;
        aux = xpath.select("//img[contains(@src,'https://cdn.sofifa.org/teams/')]/@data-src",doc)
        var imgSrc = aux[0].value;
        //dict.push({id: id, value:nodes[i].firstChild.data});
        dict.push({id: id, value:name, img:imgSrc});
    }
    return dict;
}

export async function getPlayers(idTeam) {
    const res = await fetch(proxy_url + base_url + '/team/' + idTeam);
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    const nodes = xpath.select("//table[preceding-sibling::h6[contains(text(),'Squad')]]/tbody/tr", doc);
    console.log(nodes);
    var dict = [];

    for(var i = 0; i < nodes.length; i++) {
        doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(nodes[i].toString());
        var aux = xpath.select("//a/@href",doc);        
        var id = aux[1].value.toString().replace('/player/','').split('/')[0];
        aux = xpath.select("//a[contains(@href,'/player/')]", doc);
        var name = aux[0].firstChild.data;        
        //console.log((i+1) + ': ' + '(id:'+ id + ') ' + name);   
        var playerStats = await getPlayerStats(id);
        dict.push({id: Number(id), name: name, ...playerStats})
    }
    console.log(dict)
    return dict;
}

async function getPlayerStats(idPlayer) {
    const res = await fetch(proxy_url + base_url + '/player/' + idPlayer);
    html = await res.text();
    var doc = new dom({errorHandler:{warning:(w) => {return}}}).parseFromString(html);
    var dict = {};

    // Player Info 
    // Age 28 (Jul 29, 1989) 6'2" 194lbs
    var nodeInfo = xpath.select("//div[@class='info']/div/text()[last()]", doc);
    //console.log(nodeInfo[0].data.trim().split(" "))
    
    // Trimming the string to remove the spaces at the start
    var info = nodeInfo[0].data.trim().split(" ");
    dict['age'] = Number(info[1]);
    var feet = Number(info[5].split("'")[0]);    
    var inches = info[5].substring(info[5].lastIndexOf("'") + 1, info[5].length - 1);
    dict['height'] = Math.floor(Number(feet * 30.48) + Number(inches * 2.54)); 
    var weight = info[6].replace('lbs', '');
    dict['weight'] = Math.floor(Number(weight) * 0.453592)

    // Position
    nodeInfo = xpath.select("//div[@class='info']//span[contains(@class, 'pos')]/text()", doc);
    var position = nodeInfo[0].data;      
    dict['position'] = position;

    // Preferred Foot
    nodeInfo = xpath.select("//label[text()='Preferred Foot']/following-sibling::text()", doc);    
    var preferredFoot = nodeInfo[0].data.charAt(0);
    dict['preferredFoot'] = preferredFoot;

    // Weak Foot
    nodeInfo = xpath.select("//label[text()='Weak Foot']/following-sibling::text()", doc);
    var weakFoot = nodeInfo[0].data.replace(/\s+/g, '');
    dict['weakFoot'] = Number(weakFoot);    

    // Shirt Number
    nodeInfo = xpath.select("//label[text()='Jersey Number']/following-sibling::text()", doc);
    var shirtNumber = nodeInfo[0].data.replace(/\s+/g, '');
    dict['shirtNumber'] = Number(shirtNumber);

    /**
     * Based on scrapi.R code taken from SoFIFA API for R
     * https://github.com/valentinumbach/SoFIFA/blob/master/R/scrapi.R#L93
     * Please support to Valentin Umbach.
     */

    let score_labels = [
      "Crossing",
      "Finishing",
      "Heading Accuracy",
      "Short Passing",
      "Volleys",
      "Dribbling",
      "Curve",
      "FK Accuracy",
      "Long Passing",
      "Ball Control",
      "Acceleration",
      "Sprint Speed",
      "Agility",
      "Reactions",
      "Balance",
      "Shot Power",
      "Jumping",
      "Stamina",
      "Strength",
      "Long Shots",
      "Aggression",
      "Interceptions",
      "Positioning",
      "Vision",
      "Penalties",
      "Composure",
      "Defensive Awareness", // change 'Marking' by 'Defensive Awareness' since API V3 and SOFIFA [FIFA 20 Oct 2019 04]
      "Standing Tackle",
      "Sliding Tackle",
      "GK Diving",
      "GK Handling",
      "GK Kicking",
      "GK Positioning",
      "GK Reflexes"
    ];

    let score_value;
    for(let i=0; i < score_labels.length; i++) {
        score_value = xpath.select(`(//*[not(self::script)][text()[contains(.,'${score_labels[i]}')]])//preceding-sibling::span//text()`, doc);
        if(score_value.length >= 1) {
            dict[`${camelize(score_labels[i].toLowerCase())}`] = Number(score_value[0].data);
        }
        else {
            dict[
              `${camelize(score_labels[i].toLowerCase())}`
            ] = undefined;
        }
    }
    
    //console.log(dict);
    return dict;
}

function camelize(text) {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
}
