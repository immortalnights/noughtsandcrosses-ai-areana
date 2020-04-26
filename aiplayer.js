const _ = require('underscore');
const EventEmitter = require('events');
const Player = require('./player');
const Vector2D = require('./vector2d');

class AIEventIO extends EventEmitter
{
	join()
	{
		// No-op for AI players
		console.debug("AISocket:join");
	}

	leave()
	{
		// No-op for AI players
		console.debug("AISocket:leave");
	}
};

class AIPlayer extends Player {
	constructor(options)
	{
		super(options);
		this.io = new AIEventIO();
		this.difficultly = 'expert';
		this.artifical = true;
		console.log(`Initialized AI Player ${this.id}`);

		this.io.on('game:update', (game) => {
			console.log("AI received game update");

			if (game.turn === this.id)
			{
				console.log("Is AI turn");
				setTimeout(this.takeTurn.bind(this), 500);
			}
		});
	}

	takeTurn()
	{
		console.log("AI is taking it's turn");
		// find the best place, based ont he AI difficultly level

		const brain = Brain[this.difficultly];

		brain(this, this.game.board, (location) => {
			// FIXME send grid
			const cell = location.x + location.y * 3;
			this.io.emit('place_token', { id: cell });
		});
	}

	serialize()
	{
		const data = super.serialize();
		data.artifical = this.artifical;
		return data;
	}
};

module.exports = AIPlayer;