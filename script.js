let zodiacData = [];
fetch("data.json")
	.then(res => res.json())
	.then(data => { zodiacData = data })
	.catch(err => console.error("Cannot fetch data.json: " + err))

const isDateBetweenDateStrings = (date, startDateString, endDateString) => {
	let startDate = new Date(startDateString);
	let endDate = new Date(endDateString);
	return date.valueOf() >= startDate.valueOf() && date.valueOf() <= endDate.valueOf()
}


document.getElementById("zodiacForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const birthDate = new Date(document.getElementById("birthdate").value);
	const year = birthDate.getFullYear();

	if (isNaN(year)) return;
	let yearData = zodiacData.find(data => isDateBetweenDateStrings(birthDate, data["Start Date"], data["End Date"]));
	document.getElementById("animal").textContent = yearData["Zodiac"];
	document.getElementById("element").textContent = yearData["Element"]
	document.getElementById("qualities").textContent = yearData["Qualities"];
	document.getElementById("weaknesses").textContent = yearData["Weaknesses"];
	document.getElementById("most-compatible").textContent = yearData["Most Compatible"];
	document.getElementById("least-compatible").textContent = yearData["Least Compatible"];
	document.getElementById("result").classList.remove("hidden");
});
