var accents = require('remove-accents');
const credits = require('./credits.json')

export function toWE2002(arrPlayers) {
    let dict = [];
    for(var i = 0; i < arrPlayers.length; i++) {
        dict.push({
            name: accents.remove(arrPlayers[i].name.replace(/\s+/g, '').slice(0, 10)),
            age: arrPlayers[i].age,
            foot: getFoot(arrPlayers[i].weakFoot, arrPlayers[i].preferredFoot),
            position: getPosition(arrPlayers[i].position),
            height: arrPlayers[i].height,
            body: getBody(arrPlayers[i].weight, arrPlayers[i].height),            
            shirtNumber: arrPlayers[i].shirtNumber,
            // TODO: team
            offense: getOffense(arrPlayers[i].positioning),
            defense: arrPlayers[i].position === 'GK' ? getDefenseGK(arrPlayers[i].gkDiving, arrPlayers[i].gkKicking) : getDefensePL(arrPlayers[i].defensiveAwareness, arrPlayers[i].slidingTackle),
            bodyBalance: getBodyBalance(arrPlayers[i].balance),
            stamina: getStamina(arrPlayers[i].stamina),
            speed: getSpeed(arrPlayers[i].sprintSpeed),
            acceleration: getAcceleration(arrPlayers[i].acceleration),
            passAccuracy: getPassAccuracy(arrPlayers[i].shortPassing, arrPlayers[i].longPassing),
            shotPower: getShotPower(arrPlayers[i].shotPower),
            shotAccuracy: getShotAccuracy(arrPlayers[i].finishing),
            jumpPower: getJumpPower(arrPlayers[i].jumping),
            headAccuracy: getHeadAccuracy(arrPlayers[i].headingAccuracy),
            technique: getTechnique(arrPlayers[i].ballControl),
            dribble: getDribble(arrPlayers[i].dribbling),
            curve: getCurve(arrPlayers[i].curve),
            agression: getAgression(arrPlayers[i].position, arrPlayers[i].positioning),
            response: arrPlayers[i] === 'GK' ? getResponseGK(arrPlayers[i].gkReflexes) : getResponsePL(arrPlayers[i].reactions),
            outside: getOutside(arrPlayers[i].crossing),
        });
        dict[i]['credits'] = getCredits(dict[i]); // TODO: DEFENSE 
    }
    return dict;    
}

// foot -> weakFoot > 3 ? 'B' : preferedFoot
/**
 * Get the foot depending of the sofifa foot skill.
 * If the soffia weak foot is greater than 3 return 'B', 
 * else it might be 'L' for left and 'R' for right.
 * @param {*} weakFoot 
 * @param {*} preferredFoot 
 * @returns {string} The char of the main foot skill. B stands for 'both'.
 */
function getFoot(weakFoot, preferredFoot) {
    return weakFoot > 3 ? 'B' : preferredFoot;
}

// position -> position -> Y27:Z42
/**
 * Search the Sofifa position and return the converter we2002 position.
 * @param {*} position 
 * @returns {string} The converted position into we2002 format
 */
function getPosition(position) {
    if(position === 'GK') { return 'GK'; }
    else if(position === 'CB' || position === 'RCB' || position === 'LCB') { return 'CB'; }
    else if(position === 'LB' || position === 'RB' || position === 'LWB' || position === 'RWB') { return 'SB'; }
    else if(position === 'CM' || position === 'RCM' || position === 'LCM' || position === 'CDM') { return 'DH'; }
    else if(position === 'LM' || position === 'RM') { return 'SH'; }
    else if(position === 'CAM') { return 'OH'; }
    else if(position === 'LW' || position === 'RW') { return 'WG'; }
    else if(position === 'ST' || position === 'CF') { return 'CF'; }
    else { throw `getPosition: Position conversion was not valid: ${position}`; }
}

// body -> Math.floor( weight * (height -> J27:K97) ) -> G27:H87
/**
 * Get the kind of we2002 body that a player has.
 * @param {number} weight 
 * @param {number} height 
 * @returns {string} A char (A - G) meaning the type of body.
 */
function getBody(weight, height) {
    let coefficent = getHeightCoefficentForBody(height);
    let bodyHeight = Math.floor(weight * coefficent);
    
    if(bodyHeight >= 50 && bodyHeight <= 64) { return 'A'; }
    else if(bodyHeight >= 65 && bodyHeight <= 69) { return 'B'; }
    else if(bodyHeight >= 70 && bodyHeight <= 74) { return 'C'; }
    else if(bodyHeight >= 75 && bodyHeight <= 79) { return 'D'; }
    else if(bodyHeight >= 80 && bodyHeight <= 84) { return 'E'; }
    else if(bodyHeight >= 85 && bodyHeight <= 90) { return 'F'; }
    else if(bodyHeight >= 90 && bodyHeight <= 94) { return 'G'; }
    else if(bodyHeight >= 95) { return 'H'}
    else { throw 'getBody: the body height must be a number and greather or equal than 50.'}
}

/**
 * Get the coefficent for different Height.
 * The coefficent is necessary to obtain a kind of body.
 * @param {number} height 
 * @returns {number} the height coefficent.
 */
function getHeightCoefficentForBody(height) {
    if(height >= 150 && height <= 165) { return 1.4; }
    else if(height >= 166 && height <= 170) { return 1.25; }
    else if(height >= 171 && height <= 175) { return 1.1; }
    else if(height >= 176 && height <= 180) { return 0.95; }
    else if(height >= 181 && height <= 185) {return 0.93; }
    else if(height >= 186 && height <= 190) {return 0.91; }
    else if(height >= 191 && height <= 195) { return 0.89; }
    else if(height >= 196 && height <= 200) { return 0.87; }
    else if(height >= 201) { return 0.85; }
    else { throw "getHeightCoefficentForBody: Height must be a number and greater or equal than 150";}
}

// offense -> positioning -> S27:T126
/**
 * Get the offense value for we2002 mcr.
 * @param {Number} positioning 
 * @returns {Number} Value from 12 to 19 represent the offense skill in we2002.
 */
function getOffense(positioning) {
    if(positioning >= 1 && positioning <= 10) { return 12; }
    else if(positioning >= 11 && positioning <= 20) { return 13; }
    else if(positioning >= 21 && positioning <= 30) { return 14; }
    else if(positioning >= 31 && positioning <= 50) { return 15; }    
    else if(positioning >= 51 && positioning <= 80) { return 16; }
    else if(positioning >= 81 && positioning <= 83) { return 17; }
    else if(positioning >= 84 && positioning <= 86) { return 18; }
    else if(positioning >= 87) { return 19; }
    else { throw "getOffense: Positioning must be a number and greater or equal than 1";}
}

// defensePL -> Math.floor( (marking + slidingTackle) / 2 ) -> M27:N126
function getDefensePL(marking, slidingTackle) {
    let defense = Math.floor((marking + slidingTackle) / 2);
    return normalStats(defense);
}

// defenseGK -> Math.floor( (gkDiving + gkKicking) / 2 ) -> V27:W126
function getDefenseGK(gkDiving, gkKicking) {
    let defense = Math.floor((gkDiving + gkKicking) / 2);
    if(defense >= 1 && defense <= 5) { return 12; }
    else if(defense >= 6 && defense <= 10) { return 13; }
    else if(defense >= 11 && defense <= 25) { return 14; }
    else if(defense >= 26 && defense <= 45) { return 15; }
    else if(defense >= 46 && defense <= 70) { return 16; }
    else if(defense >= 71 && defense <= 75) { return 17; }
    else if(defense >= 76 && defense <= 80) { return 18; }
    else if(defense >= 81) { return 19; }
    else { throw "getDefenseGK: GK Defense must be a number and greater or equal than 1";}
}

// bodyBalance -> balance -> M27:N126
function getBodyBalance(bodyBalance) {
    return normalStats(bodyBalance);
}

// stamina -> stamina -> M27:N126
function getStamina(stamina) {
    return normalStats(stamina);
}

// speed -> sprintSpeed -> P27:Q126
function getSpeed(sprintSpeed) {
    return speedAndShot(sprintSpeed);
}

// acceleration -> acceleration -> M27:N126
function getAcceleration(acceleration) {
    return normalStats(acceleration);
}

// passAccuracy -> Math.floor( (shortPassing + longPassing) / 2 ) -> M27:N126
function getPassAccuracy(shortPassing, longPassing) {
    let passAccuracy = Math.floor( (shortPassing + longPassing) / 2 );
    return normalStats(passAccuracy);
}

// shotPower -> shotPower -> P27:Q126
function getShotPower(shotPower) {
    return speedAndShot(shotPower);
}

// shotAccuracy -> finishing -> P27:Q126
function getShotAccuracy(finishing) {
    return speedAndShot(finishing);
}

// jumpPower -> jumping M27:N126
function getJumpPower(jumping) {
    return normalStats(jumping);
}

// headAccuracy -> headingAccuracy -> M27:N126
function getHeadAccuracy(headAccuracy) {
    return normalStats(headAccuracy);
}

// technique -> ballControl -> M27:N126
function getTechnique(ballControl) {
    return normalStats(ballControl);
}

// dribble -> dribbling -> M27:N126
function getDribble(dribbling) {
    return normalStats(dribbling);
}

// curve -> curve -> M27:N126
function getCurve(curve) {
    return normalStats(curve);
}

// TODO: Refactoring the ifs
// aggression -> String( position + positioning ) -> AO27:AP826
function getAgression(position, positioning) {    
    if(positioning >= 1 && positioning <= 10) { return 12; }
    else if(positioning >= 11 && positioning <= 20) { return 13; }
    else if(positioning >= 21 && positioning <= 30) { return 14; }
    else if(positioning >= 31 && positioning <= 50) { return 15; }
    else if(((position === 'GK' || position === 'CB' || position === 'DH') && (positioning >= 51 && positioning <= 80)) || (positioning>= 51 && positioning <= 70)) {
        return 16;
    }
    else if(((position === 'GK' || position === 'CB' || position === 'DH') && (positioning >= 81 && positioning <= 83)) || (positioning>= 71 && positioning <= 78)) {
        return 17;
    }
    else if(((position === 'GK' || position === 'CB' || position === 'DH') && (positioning >= 84 && positioning <= 86)) || (positioning>= 79 && positioning <= 86)) {
        return 18;
    }
    else if(positioning >= 87) { return 19; }
    else { throw "getAgression: The value must be a number and greater or equal than 1";}
}

// responsePL -> reactions ->  M27:N126
function getResponsePL(reactions) {
    return normalStats(reactions);
}

// responseGK -> gkReflexes -> V27:W126
function getResponseGK(gkReflexes) {
    if(gkReflexes >= 1 && gkReflexes <= 5) { return 12; }
    else if(gkReflexes >= 6 && gkReflexes <= 10) { return 13; }
    else if(gkReflexes >= 11 && gkReflexes <= 25) { return 14; }
    else if(gkReflexes >= 26 && gkReflexes <= 45) { return 15; }
    else if(gkReflexes >= 46 && gkReflexes <= 70) { return 16; }
    else if(gkReflexes >= 71 && gkReflexes <= 75) { return 17; }
    else if(gkReflexes >= 70 && gkReflexes <= 80) { return 18; }
    else if(gkReflexes >= 81) { return 19; }
    else { throw "getResponseGK: The value must be a number and greater or equal than 1";}
}

// outside -> crossing -> AB27:AC126
function getOutside(crossing) {
    if(crossing >= 1 && crossing <= 70) { return 'NO'}
    else if(crossing >= 71) { return 'YES'}
    else { throw "getOutside: The value must be a number and greater or equal than 1";}
}

// credits -> statsFix -> Formulas!A2:B146
function getCredits(player) {
    let sfix = statsFix(player);
    return credits[`${sfix}`];
}


// M27:N126
function normalStats(value) {
    if(value >= 1 && value <= 10) { return 12; }
    else if(value >= 11 && value <= 20) { return 13; }
    else if(value >= 21 && value <= 30) { return 14; }
    else if(value >= 31 && value <= 50) { return 15; }
    else if(value >= 51 && value <= 75) { return 16; }
    else if(value >= 76 && value <= 80) { return 17; }
    else if(value >= 81 && value <= 85) { return 18; }
    else if(value >= 86) { return 19; }
    else { throw "normalStats: The value must be a number and greater or equal than 1";}
}

// P27:Q126
function speedAndShot(value) {
    if(value >= 1 && value <= 10) { return 12; }
    else if(value >= 11 && value <= 20) { return 13; }
    else if(value >= 21 && value <= 30) { return 14; }
    else if(value >= 31 && value <= 50) { return 15; }
    else if(value >= 51 && value <= 75) { return 16; }
    else if(value >= 76 && value <= 80) { return 17; }
    else if(value >= 81 && value <= 90) { return 18; }
    else if(value >= 91) { return 19; } // MexWE Fix
    else { throw "speedAndShot: The value must be a number and greater or equal than 1";}
}

// =========== B O N U S  S T A T S ===========

// bonusFoot: foot -> Formulas!E2:F4
function bonusFoot(foot) {
    return foot === 'B' ? 4 : 0;
}

// bonusOutside: outside -> Formulas!E7:F8
function bonusOutside(outside) {
    return outside === 'YES' ? 4 : 0;
}

// bonusGkDef -> String.join(position, defense)
// bonusGkDefense: bonusGkDef -> Formulas!E11:F18
function bonusGkDefense(position, defense){
    if(position === 'GK') {
        if(defense === 19) { return 12;}
        else if(defense === 18) { return 8;}
        else if(defense === 17) { return 4;}
        else if(defense <= 16) { return 0;}
    }
    else { return 0; }
}

// bonusGkRes -> String.join(position, responsePL | responseGK)
// bonusGkResponse: bonusGkRes -> Formulas!E21:F28
function bonusGkResponse(position, defense){
    if(position === 'GK') {
        if(defense === 19) { return 12;}
        else if(defense === 18) { return 8;}
        else if(defense === 17) { return 4;}
        else if(defense <= 16) { return 0;}
    }
    else { return 0; }
}

// stats: offense + ... + response -> SUMA(I696:X696)
function stats(player) {
    let sum =
      player.offense +
      player.defense +
      player.bodyBalance +
      player.stamina +
      player.stamina +
      player.speed +
      player.acceleration +
      player.passAccuracy +
      player.shotPower +
      player.shotAccuracy +
      player.jumpPower +
      player.headAccuracy +
      player.technique +
      player.dribble +
      player.curve +
      player.agression +
      player.response;
    return sum;
}

// statsFix: bonusFoot + bonusOutside + bonusGkDefense + bonusGkResponse + stats
function statsFix(player) {
    let fix =
      bonusFoot(player.foot) +
      bonusOutside(player.outside) +
      bonusGkDefense(player.position, player.defense) +
      bonusGkResponse(player.position, player.defense) +
      stats(player);
    return fix;
}
