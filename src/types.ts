import {UPGRADES} from "./upgrades";

export interface PlayerData {
    wall?: Wall
    attack: number
    catsh: number // cash + cat = catsh
    timeFirstPlayed: Date
    upgrades: typeof UPGRADES
}
export interface Settings {
    /** 0 to 100 (will get divided into 0-1) */
    attackSoundVolume: number
    attackParticlesEnabled: boolean
    saveName: string
}

export interface Wall {
    name: string
    hp: number
    maxhp: number
    level: number
}

export interface Upgrade {
    name: string
    cost: number
    description: string
    level: number
}

export function generateWall(name: string, maxhp: number, level: number): Wall {
    return {
        name: name,
        hp: maxhp,
        maxhp: maxhp,
        level: level
    }
}
