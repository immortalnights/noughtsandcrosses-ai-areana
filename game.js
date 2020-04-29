const EventEmitter = require('events');
const _ = require('underscore');
const Grid = require('./grid');

class Game extends EventEmitter
{
	constructor()
	{
		super();
		this.status = 'PENDING';
		this.players = [];
	}

	isPlaying()
	{
		return this.status === 'PLAYING';
	}

	join(player)
	{
		this.players.push(player);

		player.on('place:token', (location) => {
			if (this.whosTurn() === player.id)
			{
				// console.log(`Player ${player.id} attempted to place token at ${location.x}, ${location.y}`);
				this.place(player, location);
			}
			else
			{
				console.error(`Player ${player.id} tried to take a turn out of sequence`);
			}
		});

		player.joinedGame(this);
	}

	start()
	{
		this.status = 'PLAYING';
		this.turnIndex = -1;
		this.board = new Grid(3, 3);
		// this.nextTurn();
		// console.log(`Game has started`);
	}

	restart()
	{
		this.board = new Grid(3, 3);
		this.start();
	}

	place(player, location)
	{
		const ok = this.board.place(location, player.token);
		if (!ok)
		{
			console.error("Failed to place token at", location);
		}
		else
		{
			// console.debug(this.board.display());
			// console.debug('');
		}

		return ok;
	}

	nextTurn()
	{
		if (this.turnIndex === -1)
		{
			// Find X to play first
			this.turnIndex = this.players.findIndex(p => p.token === 'X');
		}
		else
		{
			this.turnIndex++;
		}

		if (this.turnIndex >= this.players.length)
		{
			this.turnIndex = 0;
		}

		// this.board.display(true);
		this.emit('next:turn', this.whosTurn());
	}

	whosTurn()
	{
		return this.players[this.turnIndex].id;
	}

	checkForEndOfGame(board)
	{
		board = board || this.board;
		// console.log("checkForEndOfGame");
		// console.log(this.board.display());

		let winner = null;

		const paths = board.paths(3);
		const winPath = paths.find(path => {
			// Use the first token to match against the rest
			const token = path[0].token;

			return path.every(cell => cell.token === token);
		});

		if (_.isEmpty(winPath) === false)
		{
			winner = winPath[0].token;
		}
		else
		{
			const cells = board.toArray();
			const full = cells.every((c) => !!c);
			if (full)
			{
				winner = 'draw';
			}
		}

		if (winner)
		{
			this.emit('game:over', winner);
		}

		return winner;
	}
};

module.exports = Game;