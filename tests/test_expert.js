const Expert = require('../brains/expert');
const Grid = require('../grid');

const g = new Grid(3, 3);
const e = new Expert();

const player = { token: 'X' };
let location;

// Check first move on an empty board
location = e.run(player, g);
console.log("Make center move", location);

// Check winning moves

// Check block moves


// Check forking move
player.token = '0';
g.reset();
g.place({ x: 2, y: 1 }, '0');
g.place({ x: 1, y: 1 }, 'X');
g.place({ x: 1, y: 2 }, '0');
location = e.run(player, g);
console.log("Block fork move", location);
console.assert(location.x === 2 && location.y === 2, "Did not make expected move { x: 2, y: 2 }");
g.place(location, 'X');
g.display();
