const _ = require('underscore');
const Vector2D = require('../vector2d');
const { findWinningPaths, findBlockingPaths } = require('./common');

module.exports = class Expert {
	run(player, board)
	{
		let location;

		// check for blocks
		const paths = board.paths(3);
		const winningPaths = findWinningPaths(paths, player.token);
		const blockingPaths = findBlockingPaths(paths, player.token);

		const tryMove = loc => {
			const ok = board.at(loc) === '';

			if (ok)
			{
				// player.emit('place:token', loc);
				location = loc;
			}

			return ok;
		};

		const tryMoves = paths => {
			let moved = false;
			if (_.isEmpty(paths) === false)
			{
				moved = paths.some(path => {
					return path.some(cell => {
						return tryMove(cell.location);
					});
				});
			}

			return moved;
		}

		if (tryMoves(winningPaths))
		{
			// console.debug("Took a winning move", player.token);
		}
		else if (tryMoves(blockingPaths))
		{
			// console.debug("Took a blocking move", player.token);
		}
		else if (board.at(board.center) === '')
		{
			tryMove(board.center);
			// console.debug("Took center", player.token);
		}
		else
		{
			// find taken corners
			const corners = board.corners; // _.shuffle(board.corners);
			const taken = corners.filter(c => {
				const t = board.at(c);
				return player.token !== t && t !== '';
			});
			// console.log("taken", taken);

			// place in the opposite if it's free
			// 0, 0 <=> 2, 2
			// 0, 2 <=> 2, 2
			const opposite = taken.map(c => {
				return new Vector2D(board.width - 1 - c.x, board.height - 1 - c.y);
			});
			// console.log("opposite", opposite);

			if (_.isEmpty(opposite) == false && opposite.some(tryMove))
			{
				// console.debug("Took opposite corner", player.token);
			}
			else
			{
				const free = corners.filter(c => {
					return board.at(c) === '';
				});
				// console.log("free", free);

				if (_.isEmpty(free) == false && free.some(tryMove))
				{
					// console.debug("Took a corner move", player.token);
				}
				else
				{
					const edges = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }];
					if (edges.some(tryMove))
					{
						// console.debug("Took an edge move", player.token);
					}
					else
					{
						console.error("Could not find a valid move");
						board.display(true);
					}
				}
			}
		}

		return location
	}

	finish(winner)
	{
	}
};
