// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
    let response = undefined;

    if (!importObject) {
        importObject = {
            env: {
                abort: () => console.log("Abort!")
            }
        };
    }

    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
        // Fetch the module, and instantiate it as it is downloading
        response = await WebAssembly.instantiateStreaming(
            fetch(wasmModuleUrl),
            importObject
        );
    } else {
        // Fallback to using fetch to download the entire module
        // And then instantiate the module
        const fetchAndInstantiateTask = async () => {
            const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
                response.arrayBuffer()
            );
            return WebAssembly.instantiate(wasmArrayBuffer, importObject);
        };
        response = await fetchAndInstantiateTask();
    }

    return response;
};

const getWasmRoundRobinDuration = async () => {
    const wasmModule = await wasmBrowserInstantiate("../wasm/round-robin.wasm");

    const before = Date.now();
    wasmModule.instance.exports.getRoundRobinScheduling(8000);
    const after = Date.now();

    return (after - before) / 1000;
};

function generatePlayers(n) {
    const players = [];
    for (let i = 0; i < n; i++) {
        players.push({name: `Player ${i}`})
    }
    return players;
}


function generateRounds(players) {
    const numberOfRounds = players.length - 1;
    const rounds = [];
    for (let i = 0; i < numberOfRounds; i++) {
        const round = []

        for (let j = 0; j < players.length / 2; j++) {
            round.push(`${players[j].name} - ${players[players.length - 1 - j].name}`)
        }

        players.splice(1, 0, players[15]);
        players.pop();
        rounds.push(round);
    }

    return rounds;
}

function getRoundRobinSchedulingDuration() {
    const before = Date.now();
    const players = generatePlayers(8000);
    generateRounds(players);
    const after = Date.now();
    return (after - before) / 100;
}

async function runComparison() {
    const jsDuration = getRoundRobinSchedulingDuration();
    const wasmDuration = await getWasmRoundRobinDuration();

    document.querySelector("#jsDuration").outerHTML = `<div class="seconds" id="jsDuration">${jsDuration}s</div>`;
    document.querySelector("#wasmDuration").outerHTML = `<div class="seconds" id="wasmDuration">${wasmDuration}s</div>`;
}

document.querySelector("#run").addEventListener("click", runComparison);

