const inquirer = require('inquirer');
const readlineSync = require('readline-sync');

const words = require('./words.js');
const stages = require('./stages.js');

const prompt = inquirer.createPromptModule();
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

console.clear();
prompt({
    name: 'hangman',
    message: 'Select an option',
    loop: true,
    type: 'list',
    choices: [
        { name: 'Start new Game', value: 'sng' },
        { name: 'Exit', value: 'exit' }
    ]
}).then(async(answr) => {
    if (answr.hangman == 'exit') return process.exit(1);

    if (answr.hangman == 'sng') {
        console.clear();
        const word = words[Math.floor(Math.random() * words.length)];
        const hangmanStatus = [];

        word.array.forEach(async(data) => {
            if (hangmanStatus.length == word.array.length) return;
            hangmanStatus.push('_')
        });

        const guessedLetters = [];
        let guessedAmount = 0;
        let failedGuesses = 0;

        const a = [];
        word.array.forEach(async(data) => {
            if (a.includes(data)) return;
            a.push(data)
        });

        while (guessedAmount < a.length && failedGuesses <= 10) {
            console.clear();
            console.log(`You guessed ${guessedAmount} of the words. You have ${10 - failedGuesses} guesses left`);
            console.log('Don\'t forget its a;\n' + word.keyword + '\n');
            console.log(hangmanStatus.slice(1).join(' '));

            const guess = readlineSync.question(`${stages[failedGuesses]}`).charAt(0);

            if (guessedLetters.includes(guess)) {
                console.log('You already guessed that letter');
                failedGuesses++;
            } else if (word.array.includes(guess)) {
                console.log(`Success!! You guessed: ${guess}`);
                guessedLetters.push(guess);
                guessedAmount++;
                const nmbrs = [];
                var nmbr = 0;
                word.array.forEach(async(data) => { nmbr++; if (data == guess) { nmbrs.push(nmbr); } });
                console.log(nmbr);

                nmbrs.forEach(async(d) => { hangmanStatus[d] = guess; });
            } else {
                console.log('ahh! wrong answer D:');
                failedGuesses++;
            };
        };

        console.clear();
        console.log(hangmanStatus.slice(1).join(' '));
        if (failedGuesses >= 10) {
            console.log('RIP.. U died');
            console.log(stages[11]);
            wait(3000)
        } else {
            console.log('U won! :D');
            wait(3000);
        }
    }
})