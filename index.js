const EventEmitter = require('events');
const _ = require('underscore');
const Game = require('./game');
const AI = require('./ai');

const game = new Game();
// put the game on the global variable to allow debugging
global.game = game;

const learningAI = new AI({ id: 'B', token: '0', difficulty: 'learning' });

game.join(new AI({ id: 'A', token: 'X', difficulty: 'expert' }));
game.join(learningAI);

game.start();

const maxSets = 1;
const maxGames = 500;

learningAI.brain.memory.load('./data/brain.json');
console.log("Memory", Object.keys(learningAI.brain.memory.data).length);

let set = 0;
console.time("Duration");
while (set < maxSets)
{
	let played = 0;
	let results = { 'X': 0, '0': 0, 'draw': 0 };

	while (played < maxGames)
	{
		game.restart();

		let winner = false;
		while (!winner)
		{
			game.nextTurn();

			winner = game.checkForEndOfGame();
			if (winner)
			{
				// game.board.display(true);
				// console.log(`=========== Game ${played} Winner: ${winner} ===========`);
				results[winner] += 1;
			}
		}

		++played;
	}

	results.percent = Math.floor((results['X'] / maxGames) * 100);
	console.log("Finished", results);

	++set;
}
console.timeEnd("Duration");

learningAI.brain.memory.save('./data/brain.json');
console.log("Memory", Object.keys(learningAI.brain.memory.data).length);



	// 	const play = () => {
	// 		game.nextTurn();

	// 		const winner = game.checkForEndOfGame();
	// 		if (winner)
	// 		{
	// 			// game.board.display(true);
	// 			// console.log(`=========== Game ${played} Winner: ${winner} ===========`);
	// 			results[winner] += 1;

	// 			if (played < maxGames)
	// 			{
	// 				++played;

	// 				const cont = () => {
	// 					game.restart();
	// 					setTimeout(play, delay);
	// 				};

	// 				// console.log("Press enter to continue.")
	// 				// process.stdin.once('data', cont);
	// 				cont();
	// 			}
	// 			else
	// 			{
	// 				console.log("Finished", results);
	// 				resolve(lai);
	// 			}
	// 		}
	// 		else
	// 		{
	// 			play();
	// 		}
	// 	};

	// 	play();
	// });

// console.time("Play");
// playTest().then(lai => {
// 	if (lai)
// 	{
// 		const normalize = record => record.map(a => a.map(r => r === 0 ? 1 : 0));

// 		Grid.prettyPrint(lai.brain.memory.data[0], true);

// 		console.log("Validating memory...", lai.brain.memory.data.length);
// 		lai.brain.memory.data.forEach(record => {
// 			const normalized = normalize(record);
// 			// Grid.prettyPrint(normalized, true);

// 			const matched = lai.brain.memory.data.find(other => {
// 				let otherNormalized = normalize(other);

// 				let match = false;
// 				if (_.isEqual(normalized, otherNormalized))
// 				{
// 					// Skip exact self match
// 				}
// 				else
// 				{
// 					for (rotation = 0; rotation < 4 && match === false; rotation++)
// 					{
// 						otherNormalized = Grid.rotate(otherNormalized);
// 						match = _.isEqual(normalized, otherNormalized);
// 					}
// 				}

// 				if (match)
// 				{
// 					console.error("Data contains duplication!");
// 					console.log("Original");
// 					Grid.prettyPrint(normalized, true);
// 					console.log("Match   ");
// 					Grid.prettyPrint(normalize(other), true);
// 					console.log("R Match ");
// 					Grid.prettyPrint(otherNormalized, true);
// 				}

// 				return match;
// 			});
// 		});
// 	}
// 	console.timeEnd("Play");
// });
