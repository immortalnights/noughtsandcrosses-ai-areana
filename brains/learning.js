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

	record(grid, cell)
	{
		console.assert(grid instanceof Grid, "Cannot record move: Invalid grid");
		this.moves.push({ grid, cell });
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
		for (rotation = 0; rotation < 4; rotation++)
		{
			if (this.data[key])
			{
				// console.log(`Found '${key}' at rotation ${rotation}:`, this.data[key]);
				result = { record: this.data[key], index: key, rotation: rotation };
				break;
			}
			else
			{
				clone.rotate();
				key = clone.serialize();
				// console.log(`Rotated key '${key}'`);
			}
		}

		return result;
	}

	add(grid)
	{
		const { record } = this.find(grid);
		console.assert(!record, "Failed to add record, record already exists!");

		const index = grid.serialize();
		this.data[index] = this.makeBucket(grid);

		return this.data[index];
	}

	// store a given `grid` layout as a weighted matrix
	// give `bias` to the specified location.
	// if the grid exists; modify the bias by the `reward` percentage
	store(grid, bias, reward)
	{
		console.assert(grid instanceof Grid, "Invalid grid");

		let { record, index, rotation } = this.find(grid);

		console.assert(!!record, `Failed to find record for '${grid.serialize()}'`);

		// Apply weighting bias to a given location
		if (bias !== undefined && reward !== undefined)
		{
			// Rotate the bias cell by the amount the record is rotated to ensure the correct cell is weighted
			const rotatedCell = this.rotateCell(bias, rotation);

			if (record.indexOf(rotatedCell) === -1)
			{
				const gridIndex = grid.serialize();
				console.error(`Cannot add bias to ${rotatedCell} (from ${bias} by ${rotation}) for '${gridIndex}' as memory '${index}'`);
			}
			else
			{
				// console.debug(`Applying bias to record '${index}' ${rotatedCell} ${reward}`);
				this.applyBias(record, rotatedCell, reward, index);
			}
		}

		this.data[index] = record;
	}

	rotateCell(cell, rotation)
	{
		const original = cell;
		for (let r = 0; r < rotation; r++)
		{
			// There may be a smarter way to do this...
			switch (cell)
			{
				case 0:
				{
					cell = 2;
					break
				}
				case 1:
				{
					cell = 5;
					break;
				}
				case 2:
				{
					cell = 8;
					break;
				}
				case 3:
				{
					cell = 1;
					break;
				}
				case 4:
				{
					// No change
					break;
				}
				case 5:
				{
					cell = 7;
					break;
				}
				case 6:
				{
					cell = 0;
					break;
				}
				case 7:
				{
					cell = 3;
					break;
				}
				case 8:
				{
					cell = 6;
					break;
				}
			}
		}

		// console.debug("rotate", original, cell, rotation);
		return cell;
	}

	applyBias(record, bias, reward, key)
	{
		if (reward > 0)
		{
			// Calculate percentage
			let occurrences = 0;
			record.forEach(c => {
				if (c === bias)
				{
					++occurrences;
				}
			});

			const weight = (occurrences / record.length);
			if (weight < 0.9)
			{
				for (let r = 0; r < reward; r++)
				{
					record.push(bias);
				}
			}
			else
			{
				console.log(`Not adding more weight to ${bias} at ${weight} (${occurrences} of ${record.length}) for ${key}`);
			}
		}
		else if (reward < 0)
		{
			let i = record.indexOf(bias) + 1;
			for (let r = 0; r < Math.abs(reward) && i !== -1; r++)
			{
				i = record.indexOf(bias, i);

				if (i !== -1)
				{
					record.splice(i, 1);
				}
			}
		}
	}

	makeBucket(grid)
	{
		const bucket = [];
		for (let y = 0; y < grid.height; y++)
		{
			for (let x = 0; x < grid.width; x++)
			{
				// console.log(x, y, grid.at({ x, y }))
				if (grid.at({ x, y }) === '')
				{
					bucket.push(grid.toCell({ x, y }));
				}
			}
		}

		// console.log("bucket", bucket);
		return bucket;
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
		const random = (min, max) => {
			return Math.floor(Math.random() * (max - min) ) + min;
		};

		// If this move has been played before
		let { record, rotation } = this.memory.find(grid);

		if (!record)
		{
			// Create a new weighted matrix for the grid layout if one is not found
			// console.debug("Creating new memory matrix for grid");
			record = this.memory.add(grid);
		}

		let cell = record[random(0, record.length)];
		cell = this.memory.rotateCell(cell, 4 - rotation);
		return cell;
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
		let reward;
		if (winner === 'draw')
		{
			reward = 0;
		}
		else
		{
			reward = winner ? 3 : -1;
		}

		this.memory.commit(reward);
	}
};