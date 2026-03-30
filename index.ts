type TransitionMap = Record<string, Record<string, number>>;

const buildTransitions = (input: string) => {
    const map: TransitionMap = {};

    for (let i = 0; (i < input.length - 1); i++) {
        const current = input[i]
        const next = input[i + 1]
        
        if (!map[current]) {
            map[current] = {};
        }

        if (map[current][next] === undefined) {
            map[current][next] = 0;
        }

        map[current][next] += 1;
    }

    return map;
}

const scoreTransitions = (transitions: TransitionMap) => {
    const scored: TransitionMap = structuredClone(transitions);
    
    for (const [from, to] of Object.entries(transitions)) {
        let total = 0;
        Object.values(to).forEach((count) => total += count);

        for (const [letter, count] of Object.entries(to)) {
            scored[from][letter] = count / total;
        }
    }

    return scored;
}

const inputs: Record<string, string[]> = {
    "grng": [
        "asodhsajhdjklashjdaklsascdasdasdqwedasdd",
        "ashjkdashjkgdjkhsajkdhasjkddasdsqwdsad",
        "asmndvasnmdvgjashgvdhjkasghdhjkhqsasdsadas",
        "asghbdgsahjsadhjkhkqwilhdjjksadasddasdasd",
        "awihsdgbhahksdkhjhqwkjldnjkshbalkdjnasdsad",
        "asjkdghbjkweahdqweiodhgjksahklcjhasdjkdhedqsl;d",
        "ashjgdyuqwihewiouiwehreioudfwouiyfoisdjoweuiuisdfjiloasjdolis",
        "sljkahndijkhdlasjhdioasjdoasjd",
        "askjdbgqwuihJKHiajkjsdlkjadlsjladja",
        "klasjfhnsdklrpqwepodjkpskadjokls",
        "oaskldjhuiqwjodasjkhdiopasjkxjnoapsjdjwhdoiqwjodkasjoadjoslk",
        "lqwjhbriu3yroqwheuidshbakjdnl",
        "askdjbahjkebqwjkbdkas",
        "kjabnskdjhquiowhoiehbndbndbndsaklkas",
        "a;klsudjpqw[aeldklsaje;'sdkifklsjdfklhsdojioasdufhioas",
        "lasdlashjdashdkjaslhcoiasjsiojcas",
        ".ZKmcxhnasiodpweuquioduasiljdlasjkopd;as"
    ],

    "kushai": [
        "'PAOwjd]POwJDP[jwDP[jwDP|jWDPOJw{D",
        "\\APWOD['WDJP['ojwDP['|ojw]PODkWD[#P~w",
        "lpwosd@OWd[#pWKd[#|WAdpo|KAW}~dpk|}D~",
        "#{wpkd['OWJdp[Wd[{wpokD}PAKWdp]oKOWAD]",
        "APOWkjd]pWAKd]AWDpJKA{wdpoJAWd",
        "pwioj{waodj[AWJdP}AWdp]OJAW}{dpo",
        "'apwojsd[AOWJd[AJWd][oJAW}{dojwdoj",
        "}PAOwkd[OAJWDPOJAwdipojWAPODjWA{D",
        "kjhnishwsnw9uizniwnri0usnwizsuniunsiwnjhiwn9zuijnaw9izuanw9un\\z9qa28un8",
        "9\\u2n8\\un28\\un28uh\\82uj80u280\\u2j80\\un29\\u8nq2",
        "09u8\\n2un\\08u2eh0\\*Uq2n0\\iu2hei\\uh3priohp;oijh;i4jf;ali4jf;",
        "alejic;.elirjc.erhlafkuhealuhuyswbeu9shb"
    ]
}

type Model = {
    name: string;
    scored: TransitionMap;
}[];

const model: Model = Object.entries(inputs).map(([name, inputs]) => {
    const input = inputs.map((s) => s.trim()).join("");
    const transitions = buildTransitions(input);
    const scored = scoreTransitions(transitions);
    return { name, scored };
});

const predictName = (input: string, m: Model) => {
    const scores = m.map(({ name, scored }) => {
        let score = 0;

        for (let i = 0; i < input.length - 1; i++) {
            const current = input[i];
            const next = input[i + 1];
            score += Math.log(scored[current]?.[next] ?? 1e-9);
        }

        score /= (input.length - 1);

        return { name, score };
    });

    scores.sort((a, b) => b.score - a.score);

    const best = scores[0];
    const second = scores[1];

    const confidence = 1 / (1 + Math.exp(second.score - best.score));

    return { name: best.name, confidence };
}


while (true) {
    const input = prompt("enter a string to predict its name (or 'exit' to quit):");
    if (!input || input.trim() === "") continue;
    if (input.toLowerCase() === "exit") break;
    if (input.length < 10) {
        console.log("please enter a longer string (at least 10 characters)");
        continue;
    }

    const prediction = predictName(input, model);
    console.log(`prediction: ${prediction.name} (confidence: ${(prediction.confidence * 100).toFixed(2)}%)`);
}