const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");

let chart;


async function getCountryData(country) {
  const base = "https://disease.sh/v3/covid-19";

  
  const currentRes = await fetch(
    `${base}/countries/${encodeURIComponent(country)}?strict=true`
  );
  if (!currentRes.ok) throw new Error("not-found");
  const snap = await currentRes.json();

  
  const histRes = await fetch(
    `${base}/historical/${encodeURIComponent(country)}?lastdays=120`
  );
  const hist = await histRes.json();

  return { snap, hist };
}


function number(n) {
  return Number(n || 0).toLocaleString("en-IN");
}


function renderSnapshot(s) {
  document.getElementById("country").textContent = s.country;
  document.getElementById("flag").src = s.countryInfo?.flag || "";
  document.getElementById("updated").textContent = `Updated: ${new Date(
    s.updated
  ).toLocaleString()}`;

  document.getElementById("cases").textContent = number(s.cases);
  document.getElementById("active").textContent = number(s.active);
  document.getElementById("recovered").textContent = number(s.recovered);
  document.getElementById("deaths").textContent = number(s.deaths);
  document.getElementById("todayCases").textContent = number(s.todayCases);
  document.getElementById("todayDeaths").textContent = number(s.todayDeaths);
  document.getElementById("critical").textContent = number(s.critical);

  
  gsap.from(".card", {
    opacity: 0,
    y: 18,
    stagger: 0.08,
    duration: 0.5,
    ease: "power2.out",
  });
  gsap.from(".country-info img", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)",
  });
}


function renderChart(hist) {
  const tl = hist?.timeline || hist;
  const cases = tl.cases || {};
  const deaths = tl.deaths || {};
  const recovered = tl.recovered || {};

  const labels = Object.keys(cases);
  const dataCases = labels.map((d) => cases[d] ?? 0);
  const dataDeaths = labels.map((d) => deaths[d] ?? 0);
  const dataRecovered = labels.map((d) => recovered[d] ?? 0);
  const dataActive = dataCases.map(
    (c, i) => Math.max(0, c - (dataDeaths[i] || 0) - (dataRecovered[i] || 0))
  );

  const ctx = document.getElementById("trend");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Cumulative Total Cases", data: dataCases, borderWidth: 2, tension: 0.25 },
        { label: "Active Cases", data: dataActive, borderWidth: 2, tension: 0.25 },
        { label: "Recovered", data: dataRecovered, borderWidth: 2, tension: 0.25 },
        { label: "Deaths", data: dataDeaths, borderWidth: 2, tension: 0.25 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${number(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => number(v) } },
        x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
      },
    },
  });

  gsap.from("#trend", { opacity: 0, duration: 0.6 });
}


async function handleSearch(country) {
  try {
    const { snap, hist } = await getCountryData(country);
    renderSnapshot(snap);
    renderChart(hist);
  } catch (e) {
    alert("Country not found. Try again!");
  }
}


searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim();
  if (q) handleSearch(q);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim();
    if (q) handleSearch(q);
  }
});


handleSearch("India");
