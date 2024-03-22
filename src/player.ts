import {PlayerData, Settings} from "./types";
import {WALLS} from "./wall list";
import {UPGRADES} from "./upgrades";
import Toastify from "toastify-js";
import confetti from "canvas-confetti";

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

const wallArray = Object.values(WALLS);

export function attack(isAuto: boolean, amount?: number) {
    if (!isAuto && settings.attackParticlesEnabled) confetti({
        colors: ["#ff1b1b"],
        shapes: ["square"],
        gravity: 2,
        spread: 90
    });
    let x = (player.attack * player.upgrades.damageMultiplier.level) + Math.random() * 2;
    if (amount !== undefined) x = amount;
    player.wall.hp -= x;
    player.catsh += x;
    if (player.wall.hp <= 0) {
        confetti({ shapes: ['circle'] });
        const attackSfx = new Audio('/attack.mp3');
        attackSfx.volume = settings.attackSoundVolume / 100;
        attackSfx.play().then(_ => null);
        const currentWallIndex = wallArray.indexOf(player.wall);
        if (currentWallIndex === -1) resetFailsafe();
        if (currentWallIndex + 1 > wallArray.length) {
            alert("Congratulations! You beat the game!");
            // TODO: add prestige system
        }
        player.wall = wallArray[currentWallIndex + 1] ?? WALLS.unknown;
        if (player.wall === WALLS.unknown) resetFailsafe();
        player.wall.hp = player.wall.maxhp; // IDK failsafe potentially if it isn't already there
    }
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