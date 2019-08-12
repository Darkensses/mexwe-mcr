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
    const nodes = xpath.select("//table[preceding-sibling::h4[contains(text(),'Squad')]]/tbody/tr", doc);
    //console.log(nodes);
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

    // Pre Info
    var nodeInfo = xpath.select("//div[@class='info']/div/text()[last()]", doc);
    var info = nodeInfo[0].data.split(" ");
    dict['age'] = Number(info[2]);
    var feet = Number(info[6].split("'")[0]);    
    var inches = info[6].substring(info[6].lastIndexOf("'") + 1, info[6].length - 1);
    dict['height'] = Math.floor(Number(feet * 30.48) + Number(inches * 2.54)); 
    var weight = info[7].replace('lbs', '');
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

    // Attacking section
    var nodesValue = xpath.select("//h5[contains(text(), 'Attacking')]/following-sibling::ul//li//span[1]//text()", doc);
    var nodesSkill = xpath.select("//h5[contains(text(), 'Attacking')]/following-sibling::ul//li//span[2]//text()", doc);    
    
    for(let i=0; i < nodesValue.length; i++) {
        //dict.push({[`${camelize(nodesSkill[i].data)}`]: nodesValue[i].data)}
        dict[`${camelize(nodesSkill[i].data)}`] = Number(Number(nodesValue[i].data));
    }

    // Mentality section
    nodesValue = xpath.select("//h5[contains(text(), 'Mentality')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Mentality')]/following-sibling::ul//li//span[2]//text()", doc);    

    for(let i=0; i < nodesValue.length; i++) {
        // Fix the compusre attribute
        if(i === 5)
            dict.composure = Number(nodesValue[i].data);
        else 
            dict[`${camelize(nodesSkill[i].data)}`] = Number(Number(nodesValue[i].data));
    }

    // Skill section
    nodesValue = xpath.select("//h5[contains(text(), 'Skill')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Skill')]/following-sibling::ul//li//span[2]//text()", doc);    

    for(let i=0; i < nodesValue.length; i++) {
        dict[`${camelize(nodesSkill[i].data)}`] = Number(nodesValue[i].data);
    }

    // Defending section
    nodesValue = xpath.select("//h5[contains(text(), 'Defending')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Defending')]/following-sibling::ul//li//span[2]//text()", doc);    

    for(let i=0; i < nodesValue.length; i++) {
        dict[`${camelize(nodesSkill[i].data)}`] = Number(nodesValue[i].data);
    }

    // Movement section
    nodesValue = xpath.select("//h5[contains(text(), 'Movement')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Movement')]/following-sibling::ul//li//span[2]//text()", doc);    

    for(let i=0; i < nodesValue.length; i++) {
        dict[`${camelize(nodesSkill[i].data)}`] = Number(nodesValue[i].data);
    }

    // Goalkeeping section
    nodesValue = xpath.select("//h5[contains(text(), 'Goalkeeping')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Goalkeeping')]/following-sibling::ul//li//span[2]//text()", doc);

    // Fix the GK attributes
    dict["gkDiving"] = Number(nodesValue[0].data);
    dict["gkHandling"] = Number(nodesValue[1].data);
    dict["gkKicking"] = Number(nodesValue[2].data);
    dict["gkPositioning"] = Number(nodesValue[3].data);
    dict["gkReflexes"] = Number(nodesValue[4].data);

    

    // Power section
    nodesValue = xpath.select("//h5[contains(text(), 'Power')]/following-sibling::ul//li//span[1]//text()", doc);
    nodesSkill = xpath.select("//h5[contains(text(), 'Power')]/following-sibling::ul//li//span[2]//text()", doc);    

    for(let i=0; i < nodesValue.length; i++) {
        dict[`${camelize(nodesSkill[i].data)}`] = Number(nodesValue[i].data);
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
