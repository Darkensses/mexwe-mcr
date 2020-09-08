const mcrB64 = require("./mcrBase64")
let offset = require("./offset");
const contentType = "application/octet-stream"; // optional(?)

// taken from 
// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function getBlobFromB64(data) {
  const byteCharacters = atob(data);
  const byteArrays = [];

  // the performance can be improved a little by processing the byteCharacters in smaller slices
  let sliceSize = 512;

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays);
  return blob;
}

export default async function CreateMCR(players) {
  let blob = getBlobFromB64(mcrB64);
  let buffer = await new Response(blob).arrayBuffer();
  let data = new DataView(buffer);
  let encoder = new TextEncoder();  

  // Jump Offset (jumps by 32)
  let jmp = 0;

  // Offset Variables
  let off_name = 0;
  let off_posi = 0;
  let off_heig = 0;
  let off_body = 0;
  let off_age = 0; // Useless (?)
  let off_foot = 0;
  let off_offe = 0;
  let off_acce = 0; // Useless (?)
  let off_defe = 0;
  let off_bala = 0;
  let off_stam = 0;
  let off_velo = 0;
  let off_pass = 0;
  let off_jump = 0;

  // Player Variables
  // let name = "";
  let position = 0;
  let height = 0;
  let body = 0;
  let age = 0;
  let foot = 0;
  let aggressiveness = 0;
  let offense = 0;
  let acceleration = 0;
  let defense = 0;
  let acc = 0;
  let power = 0; // Useless (?)
  let balance = 0;
  let response = 0;
  let stamina = 0;
  let velocity = 0; // Useless (?)
  let dribble = 0;
  let pass = 0;
  let head = 0; // Useless (?)
  let technique = 0;
  let jump = 0;
  let curve = 0;

  for(let i=0; i<players.length; i++) {
    // Point to the correct offset position
    off_name = offset.NAME + jmp;
    off_posi = offset.POSITION + jmp;
    off_heig = offset.HEIGHT + jmp;
    off_body = offset.BODY + jmp;
    off_age = offset.AGE + jmp;
    off_foot = offset.FOOT + jmp;
    off_offe = offset.OFFENSE + jmp;
    off_acce = offset.ACCEL + jmp;
    off_defe = offset.DEFENSE + jmp;
    off_bala = offset.BALANCE + jmp;
    off_stam = offset.STAMINA + jmp;
    off_velo = offset.VELOCITY + jmp;
    off_pass = offset.PASS + jmp;
    off_jump = offset.JUMP + jmp;

    // Name
    let name = encoder.encode(players[i].name.padEnd(10));
    for(let index = 0; index < name.length; index++) {
      data.setUint8(off_name + index, name[index]);
    }

    // Position
    position = 0;
    switch (players[i].position) {
      case "GK":
        position = 0;
        break;

      case "CB":
        position = 1;
        break;

      case "SB":
        position = 2;
        break;

      case "DH":
        position = 3;
        break;

      case "SH":
        position = 4;
        break;

      case "OH":
        position = 5;
        break;

      case "CF":
        position = 6;
        break;

      case "WG":
        position = 7;
        break;

      default:
        break;
    }
    data.setUint8(off_posi, position);

    // Height and Outside
    height = 0;
    if(players[i].height >= 148 && players[i].height <= 163) {
      data.setUint8(off_heig, 0);
      data.setUint8(off_heig + 1, 0);

      if(players[i].height === 148) { height = 0; }
      if(players[i].height === 149) { height = 16; }
      if(players[i].height === 150) { height = 32; }
      if(players[i].height === 151) { height = 48; }
      if(players[i].height === 152) { height = 64; }
      if(players[i].height === 153) { height = 80; }
      if(players[i].height === 154) { height = 96; }
      if(players[i].height === 155) { height = 112; }
      if(players[i].height === 156) { height = 128; }
      if(players[i].height === 157) { height = 144; }
      if(players[i].height === 158) { height = 160; }
      if(players[i].height === 159) { height = 176; }
      if(players[i].height === 160) { height = 192; }
      if(players[i].height === 161) { height = 208; }
      if(players[i].height === 162) { height = 224; }
      if(players[i].height === 163) { height = 240; }

      data.setUint8(off_heig, height)
      if(players[i].outside === "YES") { data.setUint8(off_heig + 1, 128); }
    }

    if(players[i].height >= 164 && players[i].height <= 179) {
      data.setUint8(off_heig, 0);
      data.setUint8(off_heig + 1, 0);

      if(players[i].height === 164) { height = 0; }
      if(players[i].height === 165) { height = 1; }
      if(players[i].height === 166) { height = 2; }
      if(players[i].height === 167) { height = 3; }
      if(players[i].height === 168) { height = 4; }
      if(players[i].height === 169) { height = 5; }
      if(players[i].height === 170) { height = 6; }
      if(players[i].height === 171) { height = 7; }
      if(players[i].height === 172) { height = 8; }
      if(players[i].height === 173) { height = 9; }
      if(players[i].height === 174) { height = 10; }
      if(players[i].height === 175) { height = 11; }
      if(players[i].height === 176) { height = 12; }
      if(players[i].height === 177) { height = 13; }
      if(players[i].height === 178) { height = 14; }
      if(players[i].height === 179) { height = 15; }

      data.setUint8(off_heig, height * 16);
      if(players[i].outside === "YES") { data.setUint8(off_heig + 1, 129) } 
      else{ data.setUint8(off_heig + 1, 1) }
    }

    if(players[i].height >= 180 && players[i].height <= 195) {
      data.setUint8(off_heig, 0);
      data.setUint8(off_heig + 1, 0);

      if(players[i].height === 180) { height = 0; }
      if(players[i].height === 181) { height = 1; }
      if(players[i].height === 182) { height = 2; }
      if(players[i].height === 183) { height = 3; }
      if(players[i].height === 184) { height = 4; }
      if(players[i].height === 185) { height = 5; }
      if(players[i].height === 186) { height = 6; }
      if(players[i].height === 187) { height = 7; }
      if(players[i].height === 188) { height = 8; }
      if(players[i].height === 189) { height = 9; }
      if(players[i].height === 190) { height = 10; }
      if(players[i].height === 191) { height = 11; }
      if(players[i].height === 192) { height = 12; }
      if(players[i].height === 193) { height = 13; }
      if(players[i].height === 194) { height = 14; }
      if(players[i].height === 195) { height = 15; }

      data.setUint8(off_heig, height * 16);
      if(players[i].outside === "YES") { data.setUint8(off_heig + 1, 130); } 
      else{ data.setUint8(off_heig + 1, 2); }
    }

    if(players[i].height >= 196 && players[i].height <= 211) {
      data.setUint8(off_heig, 0);
      data.setUint8(off_heig + 1, 0);

      if (players[i].height === 196) { height = 0; }
      if(players[i].height === 197) { height = 1; }
      if(players[i].height === 198) { height = 2; }
      if(players[i].height === 199) { height = 3; }
      if(players[i].height === 200) { height = 4; }
      if(players[i].height === 201) { height = 5; }
      if(players[i].height === 202) { height = 6; }
      if(players[i].height === 203) { height = 7; }
      if(players[i].height === 204) { height = 8; }
      if(players[i].height === 205) { height = 9; }
      if(players[i].height === 206) { height = 10; }
      if(players[i].height === 207) { height = 11; }
      if(players[i].height === 208) { height = 12; }
      if(players[i].height === 209) { height = 13; }
      if(players[i].height === 210) { height = 14; }
      if(players[i].height === 211) { height = 15; }

      data.setUint8(off_heig, height * 16);
      if(players[i].outside === "YES") { data.setUint8(off_heig + 1, 131); } 
      else { data.setUint8(off_heig + 1, 3); }
    }

    // Body
    if(players[i].body === 'A' || players[i].body === 'E') { body = 0; }
    if(players[i].body === 'B' || players[i].body === 'F') { body = 4; }
    if(players[i].body === 'C' || players[i].body === 'G') { body = 8; }
    if(players[i].body === 'D' || players[i].body === 'H') { body = 12; }

    // Age
    if(typeof players[i].age === 'string'){players[i].age = Number(players[i].age);} // Fix to scraped data
    if (players[i].body === 'A' || players[i].body === 'B' || players[i].body === 'C' || players[i].body === 'D') {
      
      if(players[i].age >= 15 && players[i].age <= 22) {
        if(players[i].age === 15) { age = 0; }
        if(players[i].age === 16) { age = 2; }
        if(players[i].age === 17) { age = 4; }
        if(players[i].age === 18) { age = 6; }
        if(players[i].age === 19) { age = 8; }
        if(players[i].age === 20) { age = 10; }
        if(players[i].age === 21) { age = 12; }
        if(players[i].age === 22) { age = 14; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 0)
      }

      if(players[i].age >= 23 && players[i].age <= 30) {
        if(players[i].age === 23) { age = 0; }
        if(players[i].age === 24) { age = 2; }
        if(players[i].age === 25) { age = 4; }
        if(players[i].age === 26) { age = 6; }
        if(players[i].age === 27) { age = 8; }
        if(players[i].age === 28) { age = 10; }
        if(players[i].age === 29) { age = 12; }
        if(players[i].age === 30) { age = 14; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 1);
      }

      if(players[i].age >= 31 && players[i].age <= 38) {
        if(players[i].age === 31) { age = 0; }
        if(players[i].age === 32) { age = 2; }
        if(players[i].age === 33) { age = 4; }
        if(players[i].age === 34) { age = 6; }
        if(players[i].age === 35) { age = 8; }
        if(players[i].age === 36) { age = 10; }
        if(players[i].age === 37) { age = 12; }
        if(players[i].age === 38) { age = 14; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 2);
      }

      if(players[i].age >= 39 && players[i].age <= 46) {
        if(players[i].age === 39) { age = 0; }
        if(players[i].age === 40) { age = 2; }
        if(players[i].age === 41) { age = 4; }
        if(players[i].age === 42) { age = 6; }
        if(players[i].age === 43) { age = 8; }
        if(players[i].age === 44) { age = 10; }
        if(players[i].age === 45) { age = 12; }
        if(players[i].age === 46) { age = 14; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 3);     
      }
    }

    if(players[i].body === 'E' || players[i].body === 'F' || players[i].body === 'G' || players[i].body === 'H') {
      if(players[i].age >= 15 && players[i].age <= 22) {
        if(players[i].age === 15) { age = 1; }
        if(players[i].age === 16) { age = 3; }
        if(players[i].age === 17) { age = 5; }
        if(players[i].age === 18) { age = 7; }
        if(players[i].age === 19) { age = 9; }
        if(players[i].age === 20) { age = 11; }
        if(players[i].age === 21) { age = 13; }
        if(players[i].age === 22) { age = 15; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 0);
      }

      if(players[i].age >= 23 && players[i].age <= 30) {
        if(players[i].age === 23) { age = 1; }
        if(players[i].age === 24) { age = 3; }
        if(players[i].age === 25) { age = 5; }
        if(players[i].age === 26) { age = 7; }
        if(players[i].age === 27) { age = 9; }
        if(players[i].age === 28) { age = 11; }
        if(players[i].age === 29) { age = 13; }
        if(players[i].age === 30) { age = 15; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 1);
      }

      if(players[i].age >= 31 && players[i].age <= 38) {
        if(players[i].age === 31) { age = 1; }
        if(players[i].age === 32) { age = 3; }
        if(players[i].age === 33) { age = 5; }
        if(players[i].age === 34) { age = 7; }
        if(players[i].age === 35) { age = 9; }
        if(players[i].age === 36) { age = 11; }
        if(players[i].age === 37) { age = 13; }
        if(players[i].age === 38) { age = 15; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 2);
      }

      if(players[i].age >= 39 && players[i].age <= 46) {
        if(players[i].age === 39) { age = 1; }
        if(players[i].age === 40) { age = 3; }
        if(players[i].age === 41) { age = 5; }
        if(players[i].age === 42) { age = 7; }
        if(players[i].age === 43) { age = 9; }
        if(players[i].age === 44) { age = 11; }
        if(players[i].age === 45) { age = 13; }
        if(players[i].age === 46) { age = 15; }
        data.setUint8(off_body, 16 * age + 1 * body);
        data.setUint8(off_body + 1, 3);
      }
    }

    // Response
    if(players[i].age >= 15 && players[i].age <= 22) {
      if(players[i].response === 12) { response = 0; }
      if(players[i].response === 13) { response = 4; }
      if(players[i].response === 14) { response = 8; }
      if(players[i].response === 15) { response = 12; }
      if(players[i].response === 16) { response = 0; }
      if(players[i].response === 17) { response = 4; }
      if(players[i].response === 18) { response = 8; }
      if(players[i].response === 19) { response = 12; }
    }

    if(players[i].age >= 23 && players[i].age <= 30) {
      if(players[i].response === 12) { response = 1; }
      if(players[i].response === 13) { response = 5; }
      if(players[i].response === 14) { response = 9; }
      if(players[i].response === 15) { response = 13; }
      if(players[i].response === 16) { response = 1; }
      if(players[i].response === 17) { response = 5; }
      if(players[i].response === 18) { response = 9; }
      if(players[i].response === 19) { response = 13; }
    }

    if(players[i].age >= 31 && players[i].age <= 38) {
      if(players[i].response === 12) { response = 2; }
      if(players[i].response === 13) { response = 6; }
      if(players[i].response === 14) { response = 10; }
      if(players[i].response === 15) { response = 14; }
      if(players[i].response === 16) { response = 2; }
      if(players[i].response === 17) { response = 6; }
      if(players[i].response === 18) { response = 10; }
      if(players[i].response === 19) { response = 14; }
    }

    if(players[i].age >= 39 && players[i].age <= 46) {
      if(players[i].response === 12) { response = 3; }
      if(players[i].response === 13) { response = 7; }
      if(players[i].response === 14) { response = 11; }
      if(players[i].response === 15) { response = 15; }
      if(players[i].response === 16) { response = 3; }
      if(players[i].response === 17) { response = 7; }
      if(players[i].response === 18) { response = 11; }
      if(players[i].response === 19) { response = 15; }
    }

    // Balance
    if (players[i].response >= 12 && players[i].response <= 15) {
      if(players[i].bodyBalance === 12) { balance = 0; }
      if(players[i].bodyBalance === 13) { balance = 4; }
      if(players[i].bodyBalance === 14) { balance = 8; }
      if(players[i].bodyBalance === 15) { balance = 12; }
      if(players[i].bodyBalance === 16) { balance = 0; }
      if(players[i].bodyBalance === 17) { balance = 4; }
      if(players[i].bodyBalance === 18) { balance = 8; }
      if(players[i].bodyBalance === 19) { balance = 12; }
      data.setUint8(off_bala, 16 * balance + 1 * response);      
    }

    if (players[i].response >= 16 && players[i].response <= 19) {
      if(players[i].bodyBalance === 12) { balance = 1; }
      if(players[i].bodyBalance === 13) { balance = 5; }
      if(players[i].bodyBalance === 14) { balance = 9; }
      if(players[i].bodyBalance === 15) { balance = 13; }
      if(players[i].bodyBalance === 16) { balance = 1; }
      if(players[i].bodyBalance === 17) { balance = 5; }
      if(players[i].bodyBalance === 18) { balance = 9; }
      if(players[i].bodyBalance === 19) { balance = 13; }
      data.setUint8(off_bala, 16 * balance + 1 * response);
    }

    // Stamina
    if (players[i].bodyBalance >= 12 && players[i].bodyBalance <= 15) {
      if(players[i].stamina === 12) { stamina = 0; }
      if(players[i].stamina === 13) { stamina = 2; }
      if(players[i].stamina === 14) { stamina = 4; }
      if(players[i].stamina === 15) { stamina = 6; }
      if(players[i].stamina === 16) { stamina = 8; }
      if(players[i].stamina === 17) { stamina = 10; }
      if(players[i].stamina === 18) { stamina = 12; }
      if(players[i].stamina === 19) { stamina = 14; }
      data.setUint8(off_stam, stamina)
    }

    if (players[i].bodyBalance >= 16 && players[i].bodyBalance <= 19) {
      if(players[i].stamina === 12) { stamina = 1; }
      if(players[i].stamina === 13) { stamina = 3; }
      if(players[i].stamina === 14) { stamina = 5; }
      if(players[i].stamina === 15) { stamina = 7; }
      if(players[i].stamina === 16) { stamina = 9; }
      if(players[i].stamina === 17) { stamina = 11; }
      if(players[i].stamina === 18) { stamina = 13; }
      if(players[i].stamina === 19) { stamina = 15; }
      data.setUint8(off_stam, stamina);
    }

    // Dribble & Velocity
    if (players[i].dribble >= 12) {
      if(players[i].speed === 12) { dribble = 0; }
      if(players[i].speed === 13) { dribble = 8; }
      if(players[i].speed === 14) { dribble = 0; }
      if(players[i].speed === 15) { dribble = 8; }
      if(players[i].speed === 16) { dribble = 0; }
      if(players[i].speed === 17) { dribble = 8; }
      if(players[i].speed === 18) { dribble = 0; }
      if(players[i].speed === 19) { dribble = 8; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);      
    }

    if (players[i].dribble >= 13) {
      if(players[i].speed === 12) { dribble = 1; }
      if(players[i].speed === 13) { dribble = 9; }
      if(players[i].speed === 14) { dribble = 1; }
      if(players[i].speed === 15) { dribble = 9; }
      if(players[i].speed === 16) { dribble = 1; }
      if(players[i].speed === 17) { dribble = 9; }
      if(players[i].speed === 18) { dribble = 1; }
      if(players[i].speed === 19) { dribble = 9; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 14) {
      if(players[i].speed === 12) { dribble = 2; }
      if(players[i].speed === 13) { dribble = 10; }
      if(players[i].speed === 14) { dribble = 2; }
      if(players[i].speed === 15) { dribble = 10; }
      if(players[i].speed === 16) { dribble = 2; }
      if(players[i].speed === 17) { dribble = 10; }
      if(players[i].speed === 18) { dribble = 2; }
      if(players[i].speed === 19) { dribble = 10; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 15) {
      if(players[i].speed === 12) { dribble = 3; }
      if(players[i].speed === 13) { dribble = 11; }
      if(players[i].speed === 14) { dribble = 3; }
      if(players[i].speed === 15) { dribble = 11; }
      if(players[i].speed === 16) { dribble = 3; }
      if(players[i].speed === 17) { dribble = 11; }
      if(players[i].speed === 18) { dribble = 3; }
      if(players[i].speed === 19) { dribble = 11; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 16) {
      if(players[i].speed === 12) { dribble = 4; }
      if(players[i].speed === 13) { dribble = 12; }
      if(players[i].speed === 14) { dribble = 4; }
      if(players[i].speed === 15) { dribble = 12; }
      if(players[i].speed === 16) { dribble = 4; }
      if(players[i].speed === 17) { dribble = 12; }
      if(players[i].speed === 18) { dribble = 4; }
      if(players[i].speed === 19) { dribble = 12; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 17) {
      if(players[i].speed === 12) { dribble = 5; }
      if(players[i].speed === 13) { dribble = 13; }
      if(players[i].speed === 14) { dribble = 5; }
      if(players[i].speed === 15) { dribble = 13; }
      if(players[i].speed === 16) { dribble = 5; }
      if(players[i].speed === 17) { dribble = 13; }
      if(players[i].speed === 18) { dribble = 5; }
      if(players[i].speed === 19) { dribble = 13; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 18) {
      if(players[i].speed === 12) { dribble = 6; }
      if(players[i].speed === 13) { dribble = 14; }
      if(players[i].speed === 14) { dribble = 6; }
      if(players[i].speed === 15) { dribble = 14; }
      if(players[i].speed === 16) { dribble = 6; }
      if(players[i].speed === 17) { dribble = 14; }
      if(players[i].speed === 18) { dribble = 6; }
      if(players[i].speed === 19) { dribble = 14; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    if (players[i].dribble >= 19) {
      if(players[i].speed === 12) { dribble = 7; }
      if(players[i].speed === 13) { dribble = 15; }
      if(players[i].speed === 14) { dribble = 7; }
      if(players[i].speed === 15) { dribble = 15; }
      if(players[i].speed === 16) { dribble = 7; }
      if(players[i].speed === 17) { dribble = 15; }
      if(players[i].speed === 18) { dribble = 7; }
      if(players[i].speed === 19) { dribble = 15; }
      data.setUint8(off_velo, 16 * dribble + 1 * stamina);
    }

    // Acceleration
    if(players[i].speed === 12 || players[i].speed === 13) {
      if(players[i].acceleration === 12) { acceleration = 0; }
      if(players[i].acceleration === 13) { acceleration = 4; }
      if(players[i].acceleration === 14) { acceleration = 8; }
      if(players[i].acceleration === 15) { acceleration = 12; }
      if(players[i].acceleration === 16) { acceleration = 0; }
      if(players[i].acceleration === 17) { acceleration = 4; }
      if(players[i].acceleration === 18) { acceleration = 8; }
      if(players[i].acceleration === 19) { acceleration = 12; }
    }
    if(players[i].speed === 14 || players[i].speed === 15) {
      if(players[i].acceleration === 12) { acceleration = 1; }
      if(players[i].acceleration === 13) { acceleration = 5; }
      if(players[i].acceleration === 14) { acceleration = 9; }
      if(players[i].acceleration === 15) { acceleration = 13; }
      if(players[i].acceleration === 16) { acceleration = 1; }
      if(players[i].acceleration === 17) { acceleration = 5; }
      if(players[i].acceleration === 18) { acceleration = 9; }
      if(players[i].acceleration === 19) { acceleration = 13; }
    }
    if(players[i].speed === 16 || players[i].speed === 17) {
      if(players[i].acceleration === 12) { acceleration = 2; }
      if(players[i].acceleration === 13) { acceleration = 6; }
      if(players[i].acceleration === 14) { acceleration = 10; }
      if(players[i].acceleration === 15) { acceleration = 14; }
      if(players[i].acceleration === 16) { acceleration = 2; }
      if(players[i].acceleration === 17) { acceleration = 6; }
      if(players[i].acceleration === 18) { acceleration = 10; }
      if(players[i].acceleration === 19) { acceleration = 14; }
    }
    if(players[i].speed === 18 || players[i].speed === 19) {
      if(players[i].acceleration === 12) { acceleration = 3; }
      if(players[i].acceleration === 13) { acceleration = 7; }
      if(players[i].acceleration === 14) { acceleration = 11; }
      if(players[i].acceleration === 15) { acceleration = 15; }
      if(players[i].acceleration === 16) { acceleration = 3; }
      if(players[i].acceleration === 17) { acceleration = 7; }
      if(players[i].acceleration === 18) { acceleration = 11; }
      if(players[i].acceleration === 19) { acceleration = 15; }
    }

    // Offense
    if(players[i].acceleration >= 12 && players[i].acceleration <= 15) {
      if(players[i].offense === 12) { offense = 0; }
      if(players[i].offense === 13) { offense = 2; }
      if(players[i].offense === 14) { offense = 4; }
      if(players[i].offense === 15) { offense = 6; }
      if(players[i].offense === 16) { offense = 8; }
      if(players[i].offense === 17) { offense = 10; }
      if(players[i].offense === 18) { offense = 12; }
      if(players[i].offense === 19) { offense = 14; }
      data.setUint8(off_offe, 16 * offense + 1 * acceleration);      
    }
    if(players[i].acceleration >= 16 && players[i].acceleration <= 19) {
      if(players[i].offense === 12) { offense = 1; }
      if(players[i].offense === 13) { offense = 3; }
      if(players[i].offense === 14) { offense = 5; }
      if(players[i].offense === 15) { offense = 7; }
      if(players[i].offense === 16) { offense = 9; }
      if(players[i].offense === 17) { offense = 11; }
      if(players[i].offense === 18) { offense = 13; }
      if(players[i].offense === 19) { offense = 15; }        
      data.setUint8(off_offe, 16 * offense + 1 * acceleration);
    }

    //Defense
    if(players[i].shotPower === 12 || players[i].shotPower === 14 || players[i].shotPower === 16 || players[i].shotPower === 18) {
      if(players[i].defense === 12) { defense = 0; }
      if(players[i].defense === 13) { defense = 1; }
      if(players[i].defense === 14) { defense = 2; }
      if(players[i].defense === 15) { defense = 3; }
      if(players[i].defense === 16) { defense = 4; }
      if(players[i].defense === 17) { defense = 5; }
      if(players[i].defense === 18) { defense = 6; }
      if(players[i].defense === 19) { defense = 7; }        
    }
    if(players[i].shotPower === 13 || players[i].shotPower === 15 || players[i].shotPower === 17 || players[i].shotPower === 19) {
      if(players[i].defense === 12) { defense = 8; }
      if(players[i].defense === 13) { defense = 9; }
      if(players[i].defense === 14) { defense = 10; }
      if(players[i].defense === 15) { defense = 11; }
      if(players[i].defense === 16) { defense = 12; }
      if(players[i].defense === 17) { defense = 13; }
      if(players[i].defense === 18) { defense = 14; }
      if(players[i].defense === 19) { defense = 15; }        
    }

    // Shot Accuracy
    if(players[i].shotAccuracy === 12) { acc = 0; }
    if(players[i].shotAccuracy === 13) { acc = 4; }
    if(players[i].shotAccuracy === 14) { acc = 8; }
    if(players[i].shotAccuracy === 15) { acc = 12; }
    if(players[i].shotAccuracy === 16) { acc = 0; }
    if(players[i].shotAccuracy === 17) { acc = 4; }
    if(players[i].shotAccuracy === 18) { acc = 8; }
    if(players[i].shotAccuracy === 19) { acc = 12; }


    // Power
    if(players[i].shotPower === 12) { acc = acc; }
    if(players[i].shotPower === 13) { acc = acc; }
    if(players[i].shotPower === 14) { acc = acc + 1; }
    if(players[i].shotPower === 15) { acc = acc + 1; }
    if(players[i].shotPower === 16) { acc = acc + 2; }
    if(players[i].shotPower === 17) { acc = acc + 2; }
    if(players[i].shotPower === 18) { acc = acc + 3; }
    if(players[i].shotPower === 19) { acc = acc + 3; }

    if (players[i].shotAccuracy >= 12 && players[i].shotAccuracy <= 15) {
      data.setUint8(off_defe, 16 * acc + 1 * defense);
      data.setUint8(off_defe + 1, 0);
    }
    if (players[i].shotAccuracy >= 16 && players[i].shotAccuracy <= 19) {
      data.setUint8(off_defe, 16 * acc + 1 * defense);
      data.setUint8(off_defe + 1, 1);
    }

    // Pass
    if (players[i].shotAccuracy >= 12 && players[i].shotAccuracy <= 15) {
      if(players[i].passAccuracy === 12) { pass = 0; }
      if(players[i].passAccuracy === 13) { pass = 2; }
      if(players[i].passAccuracy === 14) { pass = 4; }
      if(players[i].passAccuracy === 15) { pass = 6; }
      if(players[i].passAccuracy === 16) { pass = 8; }
      if(players[i].passAccuracy === 17) { pass = 10; }
      if(players[i].passAccuracy === 18) { pass = 12; }
      if(players[i].passAccuracy === 19) { pass = 14; }
      data.setUint8(off_pass, pass);
    }
    if (players[i].shotAccuracy >= 16 && players[i].shotAccuracy <= 19) {
      if(players[i].passAccuracy === 12) { pass = 1; }
      if(players[i].passAccuracy === 13) { pass = 3; }
      if(players[i].passAccuracy === 14) { pass = 5; }
      if(players[i].passAccuracy === 15) { pass = 7; }
      if(players[i].passAccuracy === 16) { pass = 9; }
      if(players[i].passAccuracy === 17) { pass = 11; }
      if(players[i].passAccuracy === 18) { pass = 13; }
      if(players[i].passAccuracy === 19) { pass = 15; }
      data.setUint8(off_pass, pass);
    }

    // Technique / HeadAccuracy
    if(players[i].technique === 12) {
      if(players[i].headAccuracy === 12) { technique = 0; }
      if(players[i].headAccuracy === 13) { technique = 8; }
      if(players[i].headAccuracy === 14) { technique = 0; }
      if(players[i].headAccuracy === 15) { technique = 8; }
      if(players[i].headAccuracy === 16) { technique = 0; }
      if(players[i].headAccuracy === 17) { technique = 8; }
      if(players[i].headAccuracy === 18) { technique = 0; }
      if(players[i].headAccuracy === 19) { technique = 8; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 13) {
      if(players[i].headAccuracy === 12) { technique = 1; }
      if(players[i].headAccuracy === 13) { technique = 9; }
      if(players[i].headAccuracy === 14) { technique = 1; }
      if(players[i].headAccuracy === 15) { technique = 9; }
      if(players[i].headAccuracy === 16) { technique = 1; }
      if(players[i].headAccuracy === 17) { technique = 9; }
      if(players[i].headAccuracy === 18) { technique = 1; }
      if(players[i].headAccuracy === 19) { technique = 9; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 14) {
      if(players[i].headAccuracy === 12) { technique = 2; }
      if(players[i].headAccuracy === 13) { technique = 10; }
      if(players[i].headAccuracy === 14) { technique = 2; }
      if(players[i].headAccuracy === 15) { technique = 10; }
      if(players[i].headAccuracy === 16) { technique = 2; }
      if(players[i].headAccuracy === 17) { technique = 10; }
      if(players[i].headAccuracy === 18) { technique = 2; }
      if(players[i].headAccuracy === 19) { technique = 10; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 15) {
      if(players[i].headAccuracy === 12) { technique = 3; }
      if(players[i].headAccuracy === 13) { technique = 11; }
      if(players[i].headAccuracy === 14) { technique = 3; }
      if(players[i].headAccuracy === 15) { technique = 11; }
      if(players[i].headAccuracy === 16) { technique = 3; }
      if(players[i].headAccuracy === 17) { technique = 11; }
      if(players[i].headAccuracy === 18) { technique = 3; }
      if(players[i].headAccuracy === 19) { technique = 11; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 16) {
      if(players[i].headAccuracy === 12) { technique = 4; }
      if(players[i].headAccuracy === 13) { technique = 12; }
      if(players[i].headAccuracy === 14) { technique = 4; }
      if(players[i].headAccuracy === 15) { technique = 12; }
      if(players[i].headAccuracy === 16) { technique = 4; }
      if(players[i].headAccuracy === 17) { technique = 12; }
      if(players[i].headAccuracy === 18) { technique = 4; }
      if(players[i].headAccuracy === 19) { technique = 12; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 17) {
      if(players[i].headAccuracy === 12) { technique = 5; }
      if(players[i].headAccuracy === 13) { technique = 13; }
      if(players[i].headAccuracy === 14) { technique = 5; }
      if(players[i].headAccuracy === 15) { technique = 13; }
      if(players[i].headAccuracy === 16) { technique = 5; }
      if(players[i].headAccuracy === 17) { technique = 13; }
      if(players[i].headAccuracy === 18) { technique = 5; }
      if(players[i].headAccuracy === 19) { technique = 13; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 18) {
      if(players[i].headAccuracy === 12) { technique = 6; }
      if(players[i].headAccuracy === 13) { technique = 14; }
      if(players[i].headAccuracy === 14) { technique = 6; }
      if(players[i].headAccuracy === 15) { technique = 14; }
      if(players[i].headAccuracy === 16) { technique = 6; }
      if(players[i].headAccuracy === 17) { technique = 14; }
      if(players[i].headAccuracy === 18) { technique = 6; }
      if(players[i].headAccuracy === 19) { technique = 14; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }
    if(players[i].technique === 19) {
      if(players[i].headAccuracy === 12) { technique = 7; }
      if(players[i].headAccuracy === 13) { technique = 15; }
      if(players[i].headAccuracy === 14) { technique = 7; }
      if(players[i].headAccuracy === 15) { technique = 15; }
      if(players[i].headAccuracy === 16) { technique = 7; }
      if(players[i].headAccuracy === 17) { technique = 15; }
      if(players[i].headAccuracy === 18) { technique = 7; }
      if(players[i].headAccuracy === 19) { technique = 15; }
      data.setUint8(off_pass, 16 * technique + 1 * pass);
    }

    // Jump
    if(players[i].headAccuracy === 12 || players[i].headAccuracy === 13) {
      if(players[i].jumpPower === 12) { jump = 0; }
      if(players[i].jumpPower === 13) { jump = 4; }
      if(players[i].jumpPower === 14) { jump = 8; }
      if(players[i].jumpPower === 15) { jump = 12; }
      if(players[i].jumpPower === 16) { jump = 0; }
      if(players[i].jumpPower === 17) { jump = 4; }
      if(players[i].jumpPower === 18) { jump = 8; }
      if(players[i].jumpPower === 19) { jump = 12; }
    }
    if(players[i].headAccuracy === 14 || players[i].headAccuracy === 15) {
      if(players[i].jumpPower === 12) { jump = 1; }
      if(players[i].jumpPower === 13) { jump = 5; }
      if(players[i].jumpPower === 14) { jump = 9; }
      if(players[i].jumpPower === 15) { jump = 13; }
      if(players[i].jumpPower === 16) { jump = 1; }
      if(players[i].jumpPower === 17) { jump = 5; }
      if(players[i].jumpPower === 18) { jump = 9; }
      if(players[i].jumpPower === 19) { jump = 13; }
    }
    if(players[i].headAccuracy === 16 || players[i].headAccuracy === 17) {
      if(players[i].jumpPower === 12) { jump = 2; }
      if(players[i].jumpPower === 13) { jump = 6; }
      if(players[i].jumpPower === 14) { jump = 10; }
      if(players[i].jumpPower === 15) { jump = 14; }
      if(players[i].jumpPower === 16) { jump = 2; }
      if(players[i].jumpPower === 17) { jump = 6; }
      if(players[i].jumpPower === 18) { jump = 10; }
      if(players[i].jumpPower === 19) { jump = 14; }
    }
    if(players[i].headAccuracy === 18 || players[i].headAccuracy === 19) {
      if(players[i].jumpPower === 12) { jump = 3; }
      if(players[i].jumpPower === 13) { jump = 7; }
      if(players[i].jumpPower === 14) { jump = 11; }
      if(players[i].jumpPower === 15) { jump = 15; }
      if(players[i].jumpPower === 16) { jump = 3; }
      if(players[i].jumpPower === 17) { jump = 7; }
      if(players[i].jumpPower === 18) { jump = 11; }
      if(players[i].jumpPower === 19) { jump = 15; }
    }

    // Curve
    if (players[i].jumpPower >= 12 && players[i].jumpPower <= 15) {
      if(players[i].curve === 12) { curve = 0; }
      if(players[i].curve === 13) { curve = 2; }
      if(players[i].curve === 14) { curve = 4; }
      if(players[i].curve === 15) { curve = 6; }
      if(players[i].curve === 16) { curve = 8; }
      if(players[i].curve === 17) { curve = 10; }
      if(players[i].curve === 18) { curve = 12; }
      if(players[i].curve === 19) { curve = 14; }
      data.setUint8(off_jump, 16 * curve + 1 * jump);
    }
    if (players[i].jumpPower >= 16 && players[i].jumpPower <= 19) {
      if(players[i].curve === 12) { curve = 1; }
      if(players[i].curve === 13) { curve = 3; }
      if(players[i].curve === 14) { curve = 5; }
      if(players[i].curve === 15) { curve = 7; }
      if(players[i].curve === 16) { curve = 9; }
      if(players[i].curve === 17) { curve = 11; }
      if(players[i].curve === 18) { curve = 13; }
      if(players[i].curve === 19) { curve = 15; }
      data.setUint8(off_jump, 16 * curve + 1 * jump);
    }

    // Foot
    foot = 0;
    if(players[i].foot === 'R') { foot = 0; }
    if(players[i].foot === 'L') { foot = 4; }
    if(players[i].foot === 'B') { foot = 8; }

    // Agression
    if(players[i].agression === 12) { aggressiveness = 0; }
    if(players[i].agression === 13) { aggressiveness = 1; }
    if(players[i].agression === 14) { aggressiveness = 2; }
    if(players[i].agression === 15) { aggressiveness = 3; }
    if(players[i].agression === 16) { aggressiveness = 4; }
    if(players[i].agression === 17) { aggressiveness = 5; }
    if(players[i].agression === 18) { aggressiveness = 6; }
    if(players[i].agression === 19) { aggressiveness = 7; }
    data.setUint8(off_foot, 16 * foot + 1 * aggressiveness);

    jmp+=32;
  }
  console.log("MCR created!");
  return data.buffer;
}