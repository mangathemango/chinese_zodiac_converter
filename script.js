let zodiacData = [];
fetch("data.json")
    .then(res => res.json())
    .then(data => {zodiacData = data})
    .catch(err => console.error("Cannot fetch data.json: " + err))

document.getElementById("zodiacForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const birthDate = new Date(document.getElementById("birthdate").value);
  const year = birthDate.getFullYear();

  if (isNaN(year)) return;
  let yearData = zodiacData.find(data => data["Year"] == year);
  document.getElementById("animal").textContent = yearData["Zodiac"];
  document.getElementById("description").textContent = yearData["Personality Traits"];
  document.getElementById("element").textContent = yearData["Element"]
  document.getElementById("result").classList.remove("hidden");
});
