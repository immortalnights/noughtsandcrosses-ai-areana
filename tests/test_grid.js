const Grid = require('../grid');


const g1 = new Grid(3, 3);
const g2 = new Grid(3, 3);

// Basic empty equality check
console.assert(g1.isEqual(g2), "Empty grids should be equal");

// Inequality check
g1.place({ x: 1, y: 1 }, 'X');
console.assert(g1.isEqual(g2) === false, "Grids are different");

// Normalized equality check
g2.place({ x: 1, y: 1 }, '0');
console.assert(g1.isEqual(g2, { normalize: true }), "Grids are equal, if normalized");

// Rotation check
g1.reset();
g1.place({ x: 0, y: 0 }, 'X');
g2.reset();
g2.place({ x: 2, y: 2 }, 'X');
console.assert(g1.isEqual(g2, { rotate: true }), "Grids are equal, if rotated");

// Rotation and normalization check
g1.reset();
g1.place({ x: 0, y: 0 }, 'X');
g2.reset();
g2.place({ x: 2, y: 2 }, '0');
console.assert(g1.isEqual(g2, { normalize: true, rotate: true }), "Grids are equal, if normalized and rotated");

console.log("Done");