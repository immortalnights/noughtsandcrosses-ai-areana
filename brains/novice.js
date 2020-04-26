

module.exports = class Novice {
	run(player, board)
	{
		const random = (min, max) => {
			return Math.floor(Math.random() * (max - min) ) + min;
		}

		const locationToGrid = (loc) => {
			const x = Math.floor(loc / 3);
			const y = (loc % 3);

			return { x, y };
		};

		let location;
		while (!location)
		{
			const test = locationToGrid(random(0, 9));
			// console.log("T", test);
			if (board.at(test) === '')
			{
				location = test;
			}
		}

		return location;
	}

	finish(winner)
	{
	}
};
