var year = String(new Date().getFullYear());
document.getElementById("year").textContent = year;
var yearRail = document.getElementById("year-rail");
if (yearRail) yearRail.textContent = year;
