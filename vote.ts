#! usr/ env node
import inquirer from 'inquirer';

interface VoteCount {
    [key: string]: number;
}

interface ProvincialVoteCount {
    [province: string]: VoteCount;
}

let nationalVotes: VoteCount = { PTI: 0, PMLN: 0, PPP: 0 };
let provincialVotes: ProvincialVoteCount = {
    Sindh: { PTI: 0, PMLN: 0, PPP: 0 },
    Punjab: { PTI: 0, PMLN: 0, PPP: 0 },
    KPK: { PTI: 0, PMLN: 0, PPP: 0 },
    Balochistan: { PTI: 0, PMLN: 0, PPP: 0 }
};

function recordVote(nationalChoice: string, provincialChoice: string, provincialVote: string) {
    nationalVotes[nationalChoice]++;
    provincialVotes[provincialChoice][provincialVote]++;
}

function displayResults() {
    // Determine the winner of the National Assembly
    let nationalWinner = '';
    let maxNationalVotes = 0;
    for (const candidate in nationalVotes) {
        if (nationalVotes[candidate] > maxNationalVotes) {
            maxNationalVotes = nationalVotes[candidate];
            nationalWinner = candidate;
        }
    }
    console.log(`${nationalWinner} wins the election with ${maxNationalVotes} total votes.`);
}

async function main() {
    let anotherVoter = true;

    while (anotherVoter) {
        const nationalAssemblyVote = await inquirer.prompt({
            type: 'list',
            name: 'nationalChoice',
            message: 'Vote for National Assembly:',
            choices: ['PTI', 'PMLN', 'PPP']
        });

        const provinceChoice = await inquirer.prompt({
            type: 'list',
            name: 'provinceChoice',
            message: 'Choose your province:',
            choices: ['Sindh', 'Punjab', 'KPK', 'Balochistan']
        });

        const provincialAssemblyVote = await inquirer.prompt({
            type: 'list',
            name: 'provincialChoice',
            message: 'Vote for Provincial Assembly:',
            choices: ['PTI', 'PMLN', 'PPP']
        });

        recordVote(nationalAssemblyVote.nationalChoice, provinceChoice.provinceChoice, provincialAssemblyVote.provincialChoice);

        console.log("Vote recorded successfully.");

        const anotherVoterResponse = await inquirer.prompt({
            type: 'confirm',
            name: 'anotherVoter',
            message: 'Is there another voter?',
            default: false
        });

        anotherVoter = anotherVoterResponse.anotherVoter;
    }

    displayResults();
}

main();
