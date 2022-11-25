function generatePlayers(numberOfPlayers: number): Array<string> {
    const players: Array<string> = [];
    for (let i = 1; i <= numberOfPlayers; i++) {
        players.push(`Player ${i}`)
    }

    return players;
}

function generateRounds(players: Array<string>): Array<Array<string>> {
    const numberOfRounds = players.length - 1;
    const rounds: Array<Array<string>> = [];
    for (let i = 0; i < numberOfRounds; i++) {
        const round: Array<string> = []

        for (let j = 0; j < players.length / 2; j++) {
            round.push(`${players[j]} - ${players[players.length - 1 - j]}`)
        }

        players.splice(1, 0);
        players[1] = players[players.length - 1];
        players.pop();
        rounds.push(round);
    }

    return rounds;
}

export function getRoundRobinScheduling(numberOfPlayers: number): Array<Array<string>> {
    const players = generatePlayers(numberOfPlayers);
    return generateRounds(players);
}