import './styles.css';
import "toastify-js/src/toastify.css";
import './toast.css';
import {elements, gameloop, update} from './gameloop';
import {load, player, resetSave, attack} from "./player";
import {NAME_TO_KEY, UPGRADES} from "./upgrades";
import Toastify from "toastify-js";

const TPS = 20;

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
    for (const upg of Object.values(UPGRADES)) {
        const upgrade = player.upgrades[NAME_TO_KEY[upg.name]];
        const el = elements.upgradeTemplate.cloneNode(true) as HTMLDivElement;
        const name = el.children[0] as HTMLParagraphElement;
        const cost = el.children[1] as HTMLParagraphElement;
        const description = el.children[2] as HTMLParagraphElement;
        const buyButton = el.children[3] as HTMLButtonElement;
        function update() {
            name.textContent = upgrade.name;
            cost.textContent = `${upgrade.cost.toLocaleString()} catsh`;
            description.textContent = upgrade.description;
        }
        update()
        buyButton.onclick = () => {
            if (player.catsh >= upgrade.cost) {
                player.catsh -= upgrade.cost;
                upgrade.level++;
                upgrade.cost *= 1.15;
                update()
            } else {
                Toastify({text: "You don't have enough catsh!"}).showToast();
            }
        }
        el.id = "";
        el.style.display = '';
        elements.upgrades.append(el);
    }
    setInterval(() => gameloop(player), 1000 / TPS);
    setInterval(() => update(player), 1000 / 30);
    console.log("Loaded");
}
