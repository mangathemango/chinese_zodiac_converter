let zodiacData = [];

// Load zodiac data
fetch("data.json")
	.then(res => res.json())
	.then(data => { zodiacData = data })
	.catch(err => console.error("Cannot fetch data.json: " + err));

// Load history from localStorage
let historyData = JSON.parse(localStorage.getItem('zodiacHistory')) || [];

const isDateBetweenDateStrings = (date, startDateString, endDateString) => {
	let startDate = new Date(startDateString);
	let endDate = new Date(endDateString);
	return date.valueOf() >= startDate.valueOf() && date.valueOf() <= endDate.valueOf();
}

const getZodiacData = (birthDate) => {
	return zodiacData.find(data => isDateBetweenDateStrings(birthDate, data["Start Date"], data["End Date"]));
}

const saveToHistory = (name, birthDate, zodiacInfo) => {
	const entry = {
		name,
		birthDate: birthDate,
		zodiac: zodiacInfo.Zodiac,
		element: zodiacInfo.Element,
		qualities: zodiacInfo.Qualities,
		weaknesses: zodiacInfo.Weaknesses,
		mostCompatible: zodiacInfo["Most Compatible"],
		leastCompatible: zodiacInfo["Least Compatible"]
	};

	historyData.push(entry);
	localStorage.setItem('zodiacHistory', JSON.stringify(historyData));
	updatePersonSelect();
	updateHistoryList();
}

const deleteHistoryEntry = (index) => {
		historyData.splice(index, 1);
		localStorage.setItem('zodiacHistory', JSON.stringify(historyData));
		updatePersonSelect();
		updateHistoryList();
		document.getElementById('compatibility-results').innerHTML = '';
}

const updateHistoryList = () => {
	const historyList = document.getElementById('history-list');
	historyList.innerHTML = '';

	if (historyData.length === 0) {
		historyList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No entries in history</p>';
		return;
	}

	historyData.forEach((entry, index) => {
		entry.birthDate = new Date(entry.birthDate); // Ensure birthDate is a Date object
		const historyEntry = document.createElement('div');
		historyEntry.className = 'history-entry';

		const info = document.createElement('div');
		info.className = 'history-info';
		info.innerHTML = `
            <span class="history-name">${entry.name}</span>
            <span class="history-zodiac">${entry.birthDate.toDateString()} - ${entry.zodiac} (${entry.element})</span>
        `;

		const deleteBtn = document.createElement('button');
		deleteBtn.className = 'mode-btn danger delete-entry-btn';
		deleteBtn.textContent = 'Delete';
		deleteBtn.onclick = () => deleteHistoryEntry(index);

		historyEntry.appendChild(info);
		historyEntry.appendChild(deleteBtn);
		historyList.appendChild(historyEntry);
	});
}

const updatePersonSelect = () => {
	const select = document.getElementById('person-select');
	select.innerHTML = '<option value="">Choose a person</option>';
	historyData.forEach((entry, index) => {
		const option = document.createElement('option');
		option.value = index;
		option.textContent = entry.name;
		select.appendChild(option);
	});
}

const checkCompatibility = (person1, person2) => {
	const isNotCompatible = person1.leastCompatible.includes(person2.zodiac);
	const isCompatible = person1.mostCompatible.includes(person2.zodiac);

	return isCompatible ?
		`Compatible with ${person2.name} (${person2.zodiac})` :
		isNotCompatible ?
			`Not compatible with ${person2.name} (${person2.zodiac})` :
			`Neutral with ${person2.name} (${person2.zodiac})`
}

const displayCompatibilityResults = (selectedIndex) => {
	const resultsDiv = document.getElementById('compatibility-results');
	resultsDiv.innerHTML = '';

	if (selectedIndex === '') return;

	const selectedPerson = historyData[selectedIndex];

	historyData.forEach((person, index) => {
		if (index === parseInt(selectedIndex)) return;

		const compatibility = checkCompatibility(selectedPerson, person);
		const card = document.createElement('div');
		card.className = `compatibility-card ${compatibility.includes("Not compatible") ? 'incompatible' :
			compatibility.includes("Compatible") ? 'compatible' : 'neutral'}`;
		card.textContent = compatibility;
		resultsDiv.appendChild(card);
	});

	// const entry = {
	// 	name,
	// 	birthDate: birthDate.toDateString(),
	// 	zodiac: zodiacInfo.Zodiac,
	// 	element: zodiacInfo.Element,
	// 	qualities: zodiacInfo.Qualities,
	// 	weaknesses: zodiacInfo.Weaknesses,
	// 	mostCompatible: zodiacInfo["Most Compatible"],
	// 	leastCompatible: zodiacInfo["Least Compatible"]
	// }
	document.getElementById("name").value = selectedPerson.name;
	document.getElementById("birthdate").value = selectedPerson.birthDate.toISOString().split('T')[0];
	document.getElementById("animal").textContent = selectedPerson.zodiac;
	document.getElementById("element").textContent = selectedPerson.element;
	document.getElementById("qualities").textContent = selectedPerson.qualities;
	document.getElementById("weaknesses").textContent = selectedPerson.weaknesses;
	document.getElementById("most-compatible").textContent = selectedPerson.mostCompatible;
	document.getElementById("least-compatible").textContent = selectedPerson.leastCompatible;
	document.getElementById("result-image").src = `assets/${selectedPerson.zodiac}.gif`;
	document.getElementById("result").classList.remove("hidden");
}

// Event Listeners
document.getElementById("zodiacForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const name = document.getElementById("name").value.trim();
	const birthDate = new Date(document.getElementById("birthdate").value);
	if (isNaN(birthDate.getTime()) || !name) return;

	const yearData = getZodiacData(birthDate);
	if (!yearData) return;

	document.getElementById("animal").textContent = yearData["Zodiac"];
	document.getElementById("element").textContent = yearData["Element"];
	document.getElementById("qualities").textContent = yearData["Qualities"];
	document.getElementById("weaknesses").textContent = yearData["Weaknesses"];
	document.getElementById("most-compatible").textContent = yearData["Most Compatible"];
	document.getElementById("least-compatible").textContent = yearData["Least Compatible"];
	document.getElementById("result").classList.remove("hidden");

	saveToHistory(name, birthDate, yearData);
	updatePersonSelect()
	updateHistoryList();
	displayCompatibilityResults(historyData.length - 1);
});

document.getElementById('person-select').addEventListener('change', (e) => {
	displayCompatibilityResults(e.target.value);
});

// Initialize
updatePersonSelect();
updateHistoryList();
