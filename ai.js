const _ = require('underscore');
const EventEmitter = require('events');
const Brains = require('./brains/index');

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
		this.initBrain(this.difficulty);

		console.assert(this.brain, "Failed to initialize AI Player brain");
	}

	initBrain(difficulty)
	{
		const brain = Brains[difficulty] ? Brains[difficulty] : Brains['novice'];
		this.brain = new brain(this, {});
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
				this.brain.finish(winner === 'draw' ? winner : (this.token === winner));
			}
		});
	}

	takeTurn(game)
	{
		const location = this.brain.run(this, game.board);

		this.emit('place:token', location);

		return location;
	}
}

module.exports = AI;