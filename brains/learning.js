const fs = require('fs');
const _ = require('underscore');
const Grid = require('../grid');

class Memory
{
	constructor()
	{
		// current set of moves
		// object { matrix, move cell }
		this.moves = [];
		// remembered moves from previous cases
		// matrix and weightings
		this.data = {};
	}

	load(file)
	{

	}

	save(file)
	{
		const data = JSON.stringify(this.data, null, 2);
		fs.writeFileSync(file, data, 'utf-8');
	}

	commit(reward)
	{
		this.moves.forEach(move => {
			this.store(move.grid, move.cell, reward);
		});

		const keys = Object.keys(this.data);
		keys.forEach(s => {
			console.assert(s.length === 9, "Memory key invalid: Too short");
		});

		this.moves = [];
	}

	find(grid)
	{
		const rotate = (data) => {
			data = data.split('');
			let result = [];

			result[0] = data[6];
			result[1] = data[3];
			result[2] = data[0];

			result[3] = data[7];
			result[4] = data[4];
			result[5] = data[1];

			result[6] = data[8];
			result[7] = data[5];
			result[8] = data[2];

			return result;
		}

		let result = {
			record: null,
			index: -1,
			rotation: undefined
		};

		const clone = grid.clone();
		let key = clone.serialize();
		let rotation;
		// console.log(`Find '${key}'`);
		for (rotation = 0; rotation < 4 && !result.record; rotation++)
		{
			if (this.data[key])
			{
				// console.log(`Found match at rotation ${rotation} '${key}'`);
				// Rotate the memory record to match the grid orientation
				let record = this.data[key].clone();
				// record.display();
				for (let r = 4 - rotation; r > 0; r--)
				{
					// console.log("Rotate record");
					record.rotate();
				}
				// record.display();

				result = { record, index: key, rotation: rotation };
				break;
			}
			else
			{
				// clone.display();
				clone.rotate();
				// clone.display();

				key = clone.serialize();
				// console.log(`Rotated key '${key}'`);
			}
		}

		// for (let index = 0; index < this.data.length && !result.record; index++)
		// {
		// 	const record = this.data[index].clone();

		// 	if (record.isEqual(grid, { normalize: true, rotate: true }))
		// 	{
		// 		result = { record, index };
		// 	}
		// }

		return result;
	}

	// store a given `grid` layout as a weighted matrix
	// give `bias` to the specified location.
	// if the grid exists; modify the bias by the `reward` percentage
	store(grid, bias, reward)
	{
		console.assert(grid instanceof Grid, "Invalid grid");

		let { record, index, rotation } = this.find(grid);

		if (!!record)
		{
			// console.debug(`Found record at with index '${index}'`);
		}
		else
		{
			// Create a new weighted matrix for the grid layout if one is not found
			// console.debug("Creating new memory matrix for grid");
			record = new Grid(this.makeWeightedRecord(grid.data));
		}

		// Apply weighting bias to a given location
		if (bias !== undefined && reward !== undefined)
		{
			// console.debug("Applying bias to record");
			this.applyBias(record, bias, reward);
		}

		if (index === -1)
		{
			index = grid.serialize();
			this.data[index] = record;
			// console.debug(`Save new memory record '${index}'`);
			// record.display();
		}
		else
		{
			for (let r = 0; r < rotation; r++)
			{
				// console.log("Rotate");
				record.rotate();
			}

			const a = record.data.map(r => r.map(c => c ? 1 : 0).join('')).join('');
			const b = this.data[index].data.map(r => r.map(c => c ? 1 : 0).join('')).join('');

			if (a !== b)
			{
				console.log(a);
				record.display();
				console.log(b);
				this.data[index].display();
				console.assert(false, `Mismatch for index '${index}' / record`, rotation);
			}

			this.data[index] = record;
			// console.debug(`Replace existing memory record '${index}'`);
			// record.display();
		}
	}

	applyBias(grid, bias, reward)
	{
		// Identify free spaces in record, for memory records, free spaces have a value
		const free = 9 - grid.freeCount();

		// console.debug("free", free);
		// grid.display();

		// find the winner cell value
		const moveLocation = { x: bias % grid.width, y: Math.floor(bias / grid.height) };
		const adjustmentValue = grid.at(moveLocation) * (reward ? .75 : -.25);
		// console.log(grid.at(moveLocation), 'adj', adjustmentValue);

		// console.log("before", record);
		for (let y = 0; y < grid.height; y++)
		{
			for (let x = 0; x < grid.width; x++)
			{
				let value = grid.at({ x, y });
				if (value)
				{
					const cell = x + y * grid.height;
					if (cell === bias)
					{
						// console.log("inc", flat[i]);
						value = value + adjustmentValue;
						// console.log("inc", flat[i]);
					}
					else
					{
						value = value - (adjustmentValue / (free - 1));
					}
				}

				grid.set({ x, y}, value, { overwrite: true });
			}
		}

		// To total value shoud be (as good as) 1
		let total = 0;
		for (let y = 0; y < grid.height; y++)
		{
			for (let x = 0; x < grid.width; x++)
			{
				total += Number(grid.at({ x, y }));
			}
		}

		if (total > 0.998)
		{
			grid.display();
			console.log("Total", total);
			console.assert(false, "Total is too low", total);
		}


		// grid.display();
	}

	record(grid, cell)
	{
		console.assert(grid instanceof Grid, "Cannot record move: Invalid grid");
		this.moves.push({ grid, cell });
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

	takeMove(grid, location, reward)
	{
		// this.memory.store(grid.clone(), grid.toCell(location), reward);
		this.memory.record(grid.clone(), grid.toCell(location));
		grid.place(location, 'X');
	}

	findMove(grid)
	{
		// If this move has been played before
		let { record } = this.memory.find(grid);

		if (!record)
		{
			// Create a new weighted matrix for the grid layout if one is not found
			// console.debug("Creating new memory matrix for grid");
			record = new Grid(this.memory.makeWeightedRecord(grid.data));
		}

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

		const f = record.toArray();
		const weights = _.mapObject(f, r => r);
		const choice = weightedRandom(weights);

		return choice;
	}

	run(player, grid)
	{
		const choice = this.findMove(grid);

		// console.debug("Choice", choice);
		this.memory.record(grid.clone(), choice);

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