import './styles.css';
import "toastify-js/src/toastify.css";
import './toast.css';
import {elements, gameloop, update} from './gameloop';
import {WALLS} from './wall list';
import confetti from 'canvas-confetti';
import {load, player, resetFailsafe, resetSave, settings} from "./player";
import {UPGRADES} from "./upgrades";

const wallArray = Object.values(WALLS);

const TPS = 20;

function attack(isAuto: boolean) {
    if (!isAuto && settings.attackParticlesEnabled) confetti({
        colors: ["#ff1b1b"],
        shapes: ["square"],
        gravity: 2,
        spread: 90
    });
    const x = (player.attack * player.upgrades.damageMultiplier.level) + Math.random() * 2;
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

onload = async () => {
    console.log("Started to load");
    load();
    const response = await fetch('/splash.txt', { method: 'GET' });
    if (response.status !== 200) {
        console.error("failed to load splash text (no internet?)");
        elements.splashText.textContent = "failed to retrieve splash 3:";
    } else {
        const splashList = (await response.text()).split('\n');
        elements.splashText.textContent = splashList[Math.floor(Math.random() * splashList.length)];
    }
    elements.attackButton.onclick = () => attack(false);
    elements.resetSave.onclick = resetSave;
    for (const upgrade of Object.values(UPGRADES)) {
        const el = elements.upgradeTemplate.cloneNode(true) as HTMLDivElement;
        const name = el.children[0] as HTMLParagraphElement;
        const cost = el.children[1] as HTMLParagraphElement;
        const description = el.children[2] as HTMLParagraphElement;
        const buyButton = el.children[3] as HTMLButtonElement;
        name.textContent = upgrade.name;
        cost.textContent = `${upgrade.cost.toLocaleString()} catsh`;
        description.textContent = upgrade.description;
        buyButton.onclick = () => {
            const playerUpgrade = player.upgrades[upgrade.name];
            if (player.catsh >= playerUpgrade.cost) {
                player.catsh -= playerUpgrade.cost;
                playerUpgrade.level++;
                playerUpgrade.cost *= 1.15;
            }
        }
        el.style.display = '';
        elements.upgrades.append(el);
    }
    setInterval(() => gameloop(player), 1000 / TPS);
    setInterval(() => update(player), 1000 / 30);
    console.log("Loaded");
}
