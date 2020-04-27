const _ = require('underscore');
const Learning = require('../brains/learning');
const Grid = require('../grid');

const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min;
};

const randomGrid = () => {
	const g = new Grid(3, 3);
	let spaces = _.shuffle([...Array(9).keys()]);

	// Pick a random amount of places to fill in
	const fill = random(0, 9);
	for (let f = 0; f < fill; f++)
	{
		const cell = spaces.pop();
		g.place(g.toLocation(cell), ['X', '0'][random(0, 2)]);
	}

	return g;
}

const testGrids = [
	'XX X0X00X',
	'X        ',
	'0   X XX0',
	'  X   0X '
];


console.time("Duration");
const iterations = 50;
for (let i = 0; i < iterations; i++)
{
	const l = new Learning();
	const g = randomGrid();

	l.memory.add(g);
	// console.log(l.memory.data);

	// g.display();

	const rotation = random(0, 4);
	if (rotation)
	{
		for (let r = 0; r < rotation; r++)
		{
			g.rotate();
			// g.display();
		}
	}

	// for (let m = 0; m < 9; m++)
	// {
	// 	if (g.at(g.toLocation(m)) === '')
	// 	{
	// 		l.memory.store(g, m, 1);
	// 	}
	// }
	// console.log(l.memory.data);

	// Find 100 valid moves within the grid, checks the bucket does not contain invalid moves
	const moves = {};
	for (let i = 0; i < 10; i++)
	{
		const c = l.findMove(g);
		if (moves[c])
		{
			++moves[c];
		}
		else
		{
			moves[c] = 1;
		}

		const location = g.toLocation(c);

		if (g.at(location) !== '')
		{
			console.error(`Picked an invalid location ${location} (${c}) with rotation ${rotation}`);
			g.display();
			console.log(l.memory.data);
			console.log("===");
		}
		else
		{
			// console.log(`Picked location ${location} (${c})`);
			l.memory.store(g, c, 1);
		}
	}

	// console.log(moves);
}
console.timeEnd("Duration");

















if (false)
{
	const l = new Learning();
	const g = new Grid(3, 3);

	l.memory.store(g);
	g.place({ x: 1, y: 0 }, 'X');
	l.memory.store(g, 7);
	// console.log(l.memory.data);

	// g.reset();
	// g.place({ x: 1, y: 2 }, 'X');
	// l.memory.store(g, 1, 2);
	// console.log(l.memory.data);

	console.log("Board")
	g.display(g);

	console.log("Memory", Object.keys(l.memory.data).length);
	console.log(l.memory.data);

	const moves = {};
	for (let i = 0; i < 100; i++)
	{
		const c = l.findMove(g);
		if (moves[c])
		{
			++moves[c];
		}
		else
		{
			moves[c] = 1;
		}
	}

	console.log(moves);
}

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

