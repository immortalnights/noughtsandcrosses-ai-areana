const _ = require('underscore');
const Grid = require('./grid');

class Memory
{
	constructor()
	{
		// current set of moves
		// object { matrix, move cell }
		this.moves = [];
		// remembered moves from previous cases
		// matrix and weightings
		this.data = [];
	}

	load(file)
	{

	}

	save(file)
	{

	}

	commit(winner)
	{
		this.moves.forEach(move => {
			const mmatrix = move.matrix;
			const index = this.findIndex(mmatrix);
			// console.log("Storing", Grid.flatten(mmatrix), index);

			let record;
			if (index !== -1)
			{
				record = this.data[index];
				// console.debug(`Loaded record for matrix`, move.cell);
			}
			else
			{
				record = this.makeWeightedRecord(mmatrix);
				// console.debug(`Created new record for matrix`, move.cell);
			}

			if (winner !== 0)
			{
				// Count free spaces to redistribute the weightings
				let free = 0;
				for (let y = 0; y < mmatrix[0].length; y++)
				{
					for (let x = 0; x < mmatrix.length; x++)
					{
						if (mmatrix[y][x] === '')
						{
							++free;
						}
					}
				}
				// console.log(free);

				if (false)
				{
					// const weight = winner / free;
					// // console.log("before", record);
					// for (let y = 0; y < record[0].length; y++)
					// {
					// 	for (let x = 0; x < record.length; x++)
					// 	{
					// 		let value = record[y][x];
					// 		if (value)
					// 		{
					// 			const cell = x + y * record[0].length;
					// 			if (cell === move.cell)
					// 			{
					// 				// console.log("inc", flat[i]);
					// 				value = value + (weight / free);
					// 				// console.log("inc", flat[i]);
					// 			}
					// 			else
					// 			{
					// 				value = value - ((weight / free) / (free - 1));
					// 			}
					// 		}

					// 		record[y][x] = value;
					// 	}
					// }
				}

				// find the winner cell value
				const moveLocation = { x: move.cell % mmatrix.length, y: Math.floor(move.cell / mmatrix[0].length) };
				const moveCellValue = record[moveLocation.y][moveLocation.x] * (winner > 0 ? 0.75 : -0.25);

				// console.log("before", record);
				for (let y = 0; y < record[0].length; y++)
				{
					for (let x = 0; x < record.length; x++)
					{
						let value = record[y][x];
						if (value)
						{
							const cell = x + y * record[0].length;
							if (cell === move.cell)
							{
								// console.log("inc", flat[i]);
								value = value + moveCellValue;
								// console.log("inc", flat[i]);
							}
							else
							{
								value = value - (moveCellValue / (free - 1));
							}
						}

						record[y][x] = value;
					}
				}
				// console.log("after", record);
			}

			if (index !== -1)
			{
				this.data[index] = record;
			}
			else
			{
				this.data.push(record);
			}
		});

		this.moves = [];
	}

	store(weightedMatrix)
	{
		// expect array of rows containing weights
		const index = this.findIndex(weightedMatrix);
		if (index === -1)
		{
			// Add
			this.data.push(weightedMatrix);
		}
		else
		{
			// Update
			this.data[index] = weightedMatrix;
		}
	}

	record(matrix, cell)
	{
		this.moves.push({ matrix, cell });
	}

	findIndex(matrix)
	{
		// normalize input matrix, expected to be board layout
		matrix = matrix.map(r => r.map(c => c !== '' ? 1 : 0));

		const index = this.data.findIndex(record => {
			// normalize the weighted matrix
			let recordMatrix = record.map(a => a.map(r => r === 0 ? 1 : 0));

			return Grid.findRotation(matrix, recordMatrix) !== -1;

			// let found = false;
			// for (let rotation = 0; rotation <= 5 && found === false; rotation++)
			// {
			// 	found = _.isEqual(matrix, grid);

			// 	matrix = Grid.rotate(matrix);
			// }

			// return found;
		});

		return index;
	}

	find(grid, create)
	{
		// console.log("Find ", grid.data);

		// normalize the input matrix
		const matrix = grid.data.map(r => r.map(c => c !== '' ? 1 : 0));

		let rotation = 0;
		let record = this.data.find(record => {
			// noramlize the record to match the provided matrix, this allows the use of _.isEqual
			// it could be skipped if a custom deep equal implementation was used.
			// console.log(record);
			let recordMatrix = record.map(a => a.map(r => r === 0 ? 1 : 0));

			rotation = Grid.findRotation(matrix, recordMatrix);
			return rotation !== -1;

			// console.log(matrix, "vs", recordMatrix);
			// let match = _.isEqual(matrix, recordMatrix);
			// for (rotation = 0; rotation < 4 && match === false; rotation++)
			// {
			// 	recordMatrix = Grid.rotate(recordMatrix);
			// 	match = _.isEqual(matrix, recordMatrix);
			// }

			// return match;
		});

		// rotate the resulting record by the same rotation as the match was found
		for (; rotation > 0 && !!record; rotation--)
		{
			record = Grid.rotate(record);
		}

		if (record)
		{
			// console.log("Found");
		}
		else if (create)
		{
			// console.log("Not found");
			record = this.makeWeightedRecord(grid.data);
		}

		return record;
	}

	makeWeightedRecord(matrix)
	{
		// initilize
		// give each free space equal weight
		// identify how many empty spaces there are
		const flat = Grid.flatten(matrix);
		let free = 0;
		for (let i = 0; i < flat.length; i++)
		{
			free = flat[i] === '' ? free + 1 : free;
		}

		const record = [];
		for (let y = 0; y < matrix[0].length; y++)
		{
			const row = []
			for (let x = 0; x < matrix.length; x++)
			{
				if (matrix[y][x] === '')
				{
					row.push(1 / free);
				}
				else
				{
					row.push(0);
				}
			}

			record.push(row);
		}

		return record;
	}
}

module.exports = class LearningAI
{
	constructor(options)
	{
		this.memory = new Memory();
	}

	run(grid)
	{
		// If this move has been played before
		let record = this.memory.find(grid, true);

		// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
		const weightedRandom = (spec) => {
			let i;
			let sum = 0;
			const rand = Math.random();
			let result;

			for (i in spec)
			{
				sum = spec[i] ? sum + spec[i] : sum + 0;
				if (rand <= sum)
				{
					result = Number(i);
					break;
				}
			}

			return result;
		};

		const f = Grid.flatten(record);
		const weights = _.mapObject(f, r => r);
		// console.log(weights);

		// const r = {}
		// for (let c = 0; c < 1000; c++)
		// {
		// 	const n = weightedRandom(weights); // random in distribution...
		// 	if (r[n])
		// 	{
		// 		r[n] = r[n] + 1;
		// 	}
		// 	else
		// 	{
		// 		r[n] = 1;
		// 	}
		// }
		// console.log("=", r);
		const choice = weightedRandom(weights);

		// console.log("Move", choice, f, weights);
		// grid.display(true);

		// console.log(choice);
		this.memory.record(grid.clone().data, choice);

		return grid.toLocation(choice);
	}

	finish(winner)
	{
		let reward = 0;
		if (this.token === winner)
		{
			reward = 1;
		}
		else if (winner !== 'draw')
		{
			reward = -1;
		}

		this.memory.commit(reward);
	}
};