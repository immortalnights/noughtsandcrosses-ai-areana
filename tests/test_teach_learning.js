const Learning = require('../brains/learning');
const Grid = require('../grid');

const l = new Learning();
const g = new Grid(3, 3);

l.memory.store(g);
console.log(l.memory.data)

// g.place({ x: 1, y: 0 }, 'X');
// l.memory.store(g);

// g.reset();
// g.place({ x: 1, y: 2 }, 'X');
// l.memory.store(g);

// console.log("Board")
// g.display(g);

// console.log("Memory", Object.keys(l.memory.data).length);
// console.log(l.memory.data)

// const moves = {};
// for (let i = 0; i < 100; i++)
// {
// 	const c = l.findMove(g);
// 	if (moves[c])
// 	{
// 		++moves[c];
// 	}
// 	else
// 	{
// 		moves[c] = 1;
// 	}
// }

// console.log(moves);


// l.takeMove(g, { x: 1, y: 0 }, true);
// g.display();

// l.memory.commit(true);
// console.log("Memory", Object.keys(l.memory.data).length);
// console.log(Object.keys(l.memory.data));

// g.reset();
// l.takeMove(g, { x: 1, y: 2 }, true);
// l.takeMove(g, { x: 1, y: 1 }, true);
// g.display();

// l.memory.commit(true);
// console.log("Memory", Object.keys(l.memory.data).length);
// const k = Object.keys(l.memory.data)[0];
// console.log(l.memory.data[k].data);

// console.log("--- Next ---");

// g.reset();
// l.takeMove(g, { x: 0, y: 0 }, true);
// l.takeMove(g, { x: 2, y: 0 }, true);
// console.log("Memory", l.memory.data.length);


// Teach the AI about all the possible board combinations
// for (let y = 0; y <g.height; y++)
// {
// 	for (let x = 0; x < g.width; x++)
// 	{
// 		g.place({ x, y }, 'X');
// 		l.memory.store(g);
// 		g.reset();
// 	}
// }

