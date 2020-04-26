
const test_place = (x, y) => {
	const w = 3;
	const h = 3;
	const token = 'X';

	const g = new Grid(w, h);
	return g.place({ x, y }, token);
};

const test_placeCheck = (x, y, token) => {
	const w = 3;
	const h = 3;

	const g = new Grid(w, h);
	g.place({ x, y }, token);
	return g.at({ x, y });
};

const gridTest = () => {
	// const pathFrom = (start, direction, match) => {
	// 	let location = start;
	// 	let size = 0;
	// 	while (tokenOn(location) === match)
	// 	{
	// 		size++;

	// 		location = moveTo(location, direction);
	// 	}

	// 	return size;
	// };

	// Test placing something in each location
	{
		console.assert(test_place(-1, -1) === false, "Invalid location on grid (-1, -1)");
		console.assert(test_place( 0, -1) === false, "Invalid location on grid ( 0, -1)");
		console.assert(test_place( 1, -1) === false, "Invalid location on grid ( 1, -1)");
		console.assert(test_place( 2, -1) === false, "Invalid location on grid ( 2, -1)");
		console.assert(test_place( 3, -1) === false, "Invalid location on grid ( 3, -1)");

		console.assert(test_place(-1,  0) === false, "Invalid location on grid (-1,  0)");
		console.assert(test_place( 0,  0) === true, "Invalid location on grid ( 0,  0)");
		console.assert(test_place( 1,  0) === true, "Invalid location on grid ( 1,  0)");
		console.assert(test_place( 2,  0) === true, "Invalid location on grid ( 2,  0)");
		console.assert(test_place( 3,  0) === false, "Invalid location on grid ( 3,  0)");

		console.assert(test_place(-1,  1) === false, "Invalid location on grid (-1,  1)");
		console.assert(test_place( 0,  1) === true, "Invalid location on grid ( 0,  1)");
		console.assert(test_place( 1,  1) === true, "Invalid location on grid ( 1,  1)");
		console.assert(test_place( 2,  1) === true, "Invalid location on grid ( 2,  1)");
		console.assert(test_place( 3,  1) === false, "Invalid location on grid ( 3,  1)");

		console.assert(test_place(-1,  2) === false, "Invalid location on grid (-1,  2)");
		console.assert(test_place( 0,  2) === true, "Invalid location on grid ( 0,  2)");
		console.assert(test_place( 1,  2) === true, "Invalid location on grid ( 1,  2)");
		console.assert(test_place( 2,  2) === true, "Invalid location on grid ( 2,  2)");
		console.assert(test_place( 3,  2) === false, "Invalid location on grid ( 3,  2)");

		console.assert(test_place(-1,  3) === false, "Invalid location on grid (-1,  3)");
		console.assert(test_place( 0,  3) === false, "Invalid location on grid ( 0,  3)");
		console.assert(test_place( 1,  3) === false, "Invalid location on grid ( 1,  3)");
		console.assert(test_place( 2,  3) === false, "Invalid location on grid ( 2,  3)");
		console.assert(test_place( 3,  3) === false, "Invalid location on grid ( 3,  3)");
	}

	// Test placing something in each location and validating its there
	{
		console.assert(test_placeCheck(-1, -1, 'X') === undefined, "Unexpected value at (-1, -1)");
		console.assert(test_placeCheck( 0, -1, 'X') === undefined, "Unexpected value at ( 0, -1)");
		console.assert(test_placeCheck( 1, -1, 'X') === undefined, "Unexpected value at ( 1, -1)");
		console.assert(test_placeCheck( 2, -1, 'X') === undefined, "Unexpected value at ( 2, -1)");
		console.assert(test_placeCheck( 3, -1, 'X') === undefined, "Unexpected value at ( 3, -1)");
	
		console.assert(test_placeCheck(-1,  0, 'X') === undefined, "Unexpected value at (-1,  0)");
		console.assert(test_placeCheck( 0,  0, 'X') === 'X', "Unexpected value at ( 0,  0)");
		console.assert(test_placeCheck( 1,  0, 'X') === 'X', "Unexpected value at ( 1,  0)");
		console.assert(test_placeCheck( 2,  0, 'X') === 'X', "Unexpected value at ( 2,  0)");
		console.assert(test_placeCheck( 3,  0, 'X') === undefined, "Unexpected value at ( 3,  0)");
	
		console.assert(test_placeCheck(-1,  1, 'X') === undefined, "Unexpected value at (-1,  1)");
		console.assert(test_placeCheck( 0,  1, 'X') === 'X', "Unexpected value at ( 0,  1)");
		console.assert(test_placeCheck( 1,  1, 'X') === 'X', "Unexpected value at ( 1,  1)");
		console.assert(test_placeCheck( 2,  1, 'X') === 'X', "Unexpected value at ( 2,  1)");
		console.assert(test_placeCheck( 3,  1, 'X') === undefined, "Unexpected value at ( 3,  1)");
	
		console.assert(test_placeCheck(-1,  2, 'X') === undefined, "Unexpected value at (-1,  2)");
		console.assert(test_placeCheck( 0,  2, 'X') === 'X', "Unexpected value at ( 0,  2)");
		console.assert(test_placeCheck( 1,  2, 'X') === 'X', "Unexpected value at ( 1,  2)");
		console.assert(test_placeCheck( 2,  2, 'X') === 'X', "Unexpected value at ( 2,  2)");
		console.assert(test_placeCheck( 3,  2, 'X') === undefined, "Unexpected value at ( 3,  2)");
	
		console.assert(test_placeCheck(-1,  3, 'X') === undefined, "Unexpected value at (-1,  3)");
		console.assert(test_placeCheck( 0,  3, 'X') === undefined, "Unexpected value at ( 0,  3)");
		console.assert(test_placeCheck( 1,  3, 'X') === undefined, "Unexpected value at ( 1,  3)");
		console.assert(test_placeCheck( 2,  3, 'X') === undefined, "Unexpected value at ( 2,  3)");
		console.assert(test_placeCheck( 3,  3, 'X') === undefined, "Unexpected value at ( 3,  3)");
	}
};

const pathTests = () => {
	console.log("Path tests");
	let g;

	g = new Grid(3, 3);
	g.place(Vector2D.make(0, 0), 'X');
	g.place(Vector2D.make(1, 0), 'X');
	g.place(Vector2D.make(2, 0), 'X');
	g.display(true);
	g.findPaths('X');

	console.log()
	g = new Grid(3, 3);
	g.place(Vector2D.make(0, 0), 'X');
	g.place(Vector2D.make(1, 1), 'X');
	g.place(Vector2D.make(2, 2), 'X');
	g.display(true);
	g.findPaths('X');

	console.log()
	g = new Grid(3, 3);
	g.place(Vector2D.make(0, 0), 'X');
	g.place(Vector2D.make(0, 2), 'X');
	g.display(true);
	g.findPaths('X');

	console.log()
	g = new Grid(3, 3);
	g.place(Vector2D.make(2, 0), 'X');
	g.place(Vector2D.make(2, 2), 'X');
	g.display(true);
	g.findPaths('X');

	console.log()
	g = new Grid(3, 3);
	g.place(Vector2D.make(2, 0), 'X');
	g.place(Vector2D.make(2, 1), '0');
	g.place(Vector2D.make(2, 2), 'X');
	g.display(true);
	g.findPaths('X');

	// connect 4:
	// g = new Grid(7, 6);
	// g.place(Vector2D.make(0, 5), 'X');
	// g.display(true);
	// g.findPaths('X', 4);
}


const brainTest = () => {
	const board = new Grid(3,3);
	board.place(new Vector2D(0, 0), '0');
	board.place(new Vector2D(1, 0), 'X');
	board.place(new Vector2D(2, 0), '0');
	// board.place(new Vector2D(0, 1), 'X');
	// board.place(new Vector2D(1, 1), '0');
	// board.place(new Vector2D(2, 1), 'X');
	board.place(new Vector2D(0, 2), '0');
	board.place(new Vector2D(1, 2), 'X');
	board.place(new Vector2D(2, 2), 'X');
	board.display(true);
	const winner = Game.prototype.checkForEndOfGame.call(null, board);
	console.log("Winner", winner);
	console.log("Paths");
	console.log(pathArrayToString(board.paths(3)));

	const ai = new AI({ id: '0', token: '0' });

	ai.on('place:token', p => {
		console.log(`Place token ${ai.token} at (${p.x}, ${p.y})`);
		board.place(p, ai.token);
	});

	console.time("Move");
	ai.takeSmarterTurn({ board: board });
	console.timeEnd("Move");
	board.display(true);
}


// const a = new LearningBrain();
// const g = new Grid(3, 3);

// a.memory.record([ ['', '', ''], ['', 'X', ''], ['', 'X', ''] ], 0);
// console.log(a.memory.moves);
// a.memory.commit(false);
// console.log(a.memory.moves);
// console.log(a.memory.data);
// a.memory.record([ ['', 'X', ''], ['', 'X', ''], ['', '', ''] ], 0);
// a.memory.commit(false);
// console.log(a.memory.moves);
// console.log(a.memory.data);



// a.memory.store([
// 	[ 0.125, 0.125, 0.125 ],
// 	[ 0, 0.125, 0 ],
// 	[ 0.125, 0.125, 0.125 ]
// ]);

// test finding items in memory
// console.log("=", a.memory.findIndex(g.data));

// g.place({ x: 0, y: 1 }, 'X');

// console.log("=", a.memory.findIndex(g.data));
// console.log(a.memory.find(g));

// g.place({ x: 2, y: 1 }, 'X');

// console.log("=", a.memory.findIndex(g.data));
// console.log(a.memory.find(g));

// console.log(a.memory.data);

// choice = a.run(g);
// console.log(choice, a.memory.moves[0].matrix);

// a.memory.commit(true);

// console.log(a.memory.moves);
// console.log(a.memory.data);


// g.place({ x: 1, y: 0 }, 'X');
// a.memory.moves.push({ matrix: g.data, cell: 4 });
// a.memory.commit(true);

// choice = a.run(g);
// g.place(choice, '0');
// g.display(true);

// g.reset();

// choice = a.run(g);
// g.place(choice, '0');
// g.display(true);

// const g = new Grid(3, 3);
// console.log(_.shuffle(g.corners)[0]);
// g.place({ x: 0, y: 2}, '0');
// g.display(true);

// const taken = g.corners.filter(c => {
// 	const t = g.at(c);
// 	console.log("c", c, t);
// 	return 'X' !== t && t !== '';
// });
// console.log("taken", taken);

// // place in the opposite if it's free
// // 0, 0 <=> 2, 2
// // 0, 2 <=> 2, 2
// const opposite = taken.map(c => {
// 	return new Vector2D(g.width - 1 - c.x, g.height - 1 - c.y);
// });
// console.log("opposite", opposite);

// const g = new Grid(3, 3);
// g.place({ x: 0, y: 0 }, 'X');
// g.place({ x: 1, y: 0 }, '0');
// // g.place({ x: 2, y: 0 }, 'X');
// // g.place({ x: 0, y: 1 }, 'X');
// // g.place({ x: 1, y: 1 }, 'X');
// g.place({ x: 2, y: 1 }, 'X');
// // g.place({ x: 0, y: 2 }, 'X');
// // g.place({ x: 1, y: 2 }, 'X');
// // g.place({ x: 2, y: 2 }, 'X');
// console.log(g.toArray());

// const b = new LearningBrain();
// const p = b.run(g);
// console.log(p);


