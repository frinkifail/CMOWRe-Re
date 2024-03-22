import {PlayerData, Settings} from "./types";
import {WALLS} from "./wall list";
import {UPGRADES} from "./upgrades";
import Toastify from "toastify-js";

export let settings: Settings = {
    attackSoundVolume: 20,
    attackParticlesEnabled: true,
    saveName: "cmow-default"
}

export let player: PlayerData = {
    wall: WALLS.paper,
    attack: 1,
    catsh: 0,
    timeFirstPlayed: new Date(),
    upgrades: Object.assign(UPGRADES)
}

export function load() {
    try {
        const item = localStorage.getItem(settings.saveName);
        const settingsItem = JSON.parse(localStorage.getItem("cmowre-re-settings"));
        if (item === null) return // deal with it
        // noinspection PointlessBooleanExpressionJS
        if (settings === null) return // deal with it again
        player = JSON.parse(atob(item)); // save is definitely `PlayerData` trust me.
        settings = settingsItem; // if it's not, well im fucked.
    } catch (e) {
        if (!(e instanceof SyntaxError)) {
            throw e;
        } else {
            console.error(e);
            resetFailsafe();
        }
    }
}

export function save() {
    const save = JSON.stringify(player);
    const settingsSave = JSON.stringify(settings);
    localStorage.setItem(settings.saveName, btoa(save));
    localStorage.setItem("cmowre-re-settings", settingsSave);
}

//@ts-expect-error
export function resetFailsafe(): never {
    console.error("something went wrong, resetting save.");
    localStorage.clear();
    location.reload();
}

// Ask player for confirmation to reset save or not.
export function resetSave() {
    Toastify({
        text: "Reset save? This will disappear in 3 seconds. Click to confirm.",
        duration: 3000,
        onClick: () => {
            localStorage.removeItem(settings.saveName);
            location.reload();
        }
    }).showToast();
}