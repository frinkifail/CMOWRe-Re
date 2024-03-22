import { PlayerData } from "./types";
import {save, settings} from "./player";
import Toastify from 'toastify-js';

export const elements = {
    wallName: document.getElementById('wall-name'),
    splashText: document.getElementById('splash'),
    attack: document.getElementById('plr-attack'),
    hp: document.getElementById('wall-hp'),
    maxhp: document.getElementById('wall-maxhp'),
    catsh: document.getElementById('plr-catsh'),
    attackButton: document.getElementById('attack'),
    upgrades: document.getElementById("upgrades"),
    resetSave: document.getElementById("reset-save"),
    upgradeTemplate: document.getElementById("upgrade-template"),
}

let autosaveTimer = 0;

export function gameloop(player: PlayerData) {
    autosaveTimer++;
    if (autosaveTimer >= 120) { // save every 120 ticks
        autosaveTimer = 0;
        save();
        Toastify({text: "saved"}).showToast();
    }
}

export function update(player: PlayerData) {
    document.title = `${player.wall?.name} | CMOWRe-Re`;
    elements.wallName.textContent = player.wall?.name;
    elements.attack.textContent = player.attack.toLocaleString();
    elements.hp.textContent = player.wall?.hp.toLocaleString();
    elements.maxhp.textContent = player.wall?.maxhp.toLocaleString();
    elements.catsh.textContent = player.catsh.toLocaleString();
}
