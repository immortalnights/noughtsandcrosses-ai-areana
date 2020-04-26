const _ = require('underscore');
const EventEmitter = require('events');
const { Brain } = require('./aiplayer');
const LearningBrain = require('./learningai');

class AI extends EventEmitter
{
	constructor({ id, token, difficulty })
	{
		super();

		console.assert(_.isString(id), "AI ID must be string");
		console.assert(_.isString(token) && token.length === 1, "AI token must be single character");

		this.id = id;
		this.token = token;
		this.moveFailures = 0;
		this.difficulty = difficulty;
		this.brain = Brain[difficulty] ? Brain[difficulty] : new LearningBrain();
	}

	joinedGame(game)
	{
		game.on('next:turn', (playerID) => {
			if (playerID === this.id)
			{
				// console.log(`It's my turn ${this.id}`);
				this.takeTurn(game);
			}
		});

		game.on('invalid:move', ({ x, y }) => {
			// TODO
			console.log(`Received invalid move`);
			this.moveFailures += 1;
			this.takeTurn(game);
		});

		game.on('game:over', (winner) => {
			if (this.brain.finish)
			{
				this.brain.finish(winner);
			}
		});
	}

	takeTurn(game)
	{
		let location;
		if (this.brain.run)
		{
			location = this.brain.run(game.board);
		}
		else
		{
			this.brain.call(null, this, game.board, (loc) => {
				location = loc;
			});
		}

		this.emit('place:token', location);

		return location;
	}
}

module.exports = AI;