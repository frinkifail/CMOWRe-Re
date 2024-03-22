import { generateWall } from "./types";

export const WALLS = {
    unknown: generateWall("The Unknown Wall", -1, -1),
    paper: generateWall("The Paper Wall", 1, 1),
    thick_paper: generateWall("The Thick Paper Wall", 10, 2),
    wooden: generateWall("The Wooden Wall", 50, 3),
    plastic: generateWall("The Plastic Wall", 80, 4),
    rock: generateWall("The Rock Wall", 100, 5),
    coal: generateWall("The Coal Wall", 160, 6),
    iron: generateWall("The Iron Wall", 200, 7),
    gold: generateWall("The Gold Wall", 300, 8),
    diamond: generateWall("The Diamond Wall", 650, 9),
}