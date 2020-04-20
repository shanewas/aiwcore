const fs = require("fs");
const path = require("path");
const moment = require('moment');
const DataStore = require('nedb');
const async = require('async');

let botsList = new DataStore({ filename: `${path.join(__dirname, "../data/bots.db")}`, autoload: true });

// Add Bot Function
const addBot = function (botName, runTime, category) {
	const currentDateTime = getCurrentTime();
	// inserting new bot in db
	let bot = {
		// id: id,
		botName: botName,
		runTime: runTime,
		category: category,
		status: 'disabled',
		lastActive: currentDateTime
	}
	botsList.insert(bot, (err, doc) => {
		console.log('Inserted bot named: ', doc.botName, 'with ID', doc._id);
	});
};

// Delete Bot Function
const removeBot = function (botName) {
	botsList.remove({ botName: botName}, (err, doc) =>{
		console.log('Deleted', doc, 'bot(s)');
	});

	// saveBots(botsToKeep);
}

// Edit Bot Function
const editBot = function (botInfo) {
	const bots = loadBots();

	console.log('bot id in edit ='+botInfo.id);
	bots.forEach(function (bot) { 
		if (bot.id === botInfo.id) {
			// bot.botName = botInfo.botName;
			// bot.runTime = botInfo.runTime;
			// bot.category = botInfo.category;
			// bot.status = botInfo.status;
			let updatedField = Object.keys(botInfo);
			console.log('updated fields = ' + updatedField);
			updatedField.forEach((field) => {
				bot[field] = botInfo[field];					
			});
		}
	});

	saveBots(bots);
}

// Edit bot process
const editBotProcess = function (botInfo) {
	const bots = botsList;
	bots.forEach(function (bot) { 
		if (bot.id === botInfo.id) {
			bot.botName = botInfo.botName;
			bot.runTime = botInfo.runTime;
			bot.category = botInfo.category;
			bot.status = botInfo.status;
			bot.processSequence = botInfo.processSequence;
		}
	});

	saveBots(bots);
}

// List all Bots Function
// const listAllBots = function () {
// 		botsList.find({}, (err, doc) => {
// 			console.log(doc.length);
// 		});
	
// }

// Fetch single bot
const fetchBot = (id) => {
	const bots = loadBots();
	if (0 < id <= bots[bots.length-1].id) {
		const botToFetch = bots.find((bot) => bot.id === parseInt(id));
		console.log(botToFetch);
		return botToFetch;
	} else
		return botToFetch = '';
}

// Fetch BotList Function
const loadBots = function () {
	try {
		const dataBuffer = fs.readFileSync(`${path.join(__dirname, "botlist.json")}`);
		const dataJSON = dataBuffer.toString();
		return JSON.parse(dataJSON);
	} catch (err){
		return [];
	}
};

// Store BotList Function
const saveBots = function (bots) {
	const dataJSON = JSON.stringify(bots);
	fs.writeFileSync(`${path.join(__dirname, "botlist.json")}`, dataJSON);
};

// getting current time and date in local format
const getCurrentTime = () => {
	let date = moment().format('MMMM Do YYYY');
	let time = moment().format('h:mm:ss a');
	let currentDateTime = date + " at " + time;
	return currentDateTime;
}

module.exports = {
	addBot: addBot,
	removeBot: removeBot,
	editBot: editBot,
	// listAllBots: listAllBots,
	fetchBot: fetchBot,
	getCurrentTime: getCurrentTime,
	editBotProcess: editBotProcess
};

// addBot("mandarin", 1, "filler");
// console.log(fetchBot('carrot'));

// removeBot('banana');
// const bots = loadBots();
// console.log('last bot id = ' + bots[bots.length - 1].id);
// editBot('tomato',2,'filler');
// listAllBots();