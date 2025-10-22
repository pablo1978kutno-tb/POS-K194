const CHEST_POINTS = {
  "Olympus": 1500,
  "Crypt": 1000,
  "RoTA": 800,
  "Heroic": 600,
  "Epic Kill": 400,
  "Citadel": 500
};

let WEEKLY_POS_THRESHOLD = 4000;

const RANK_COLORS = {
  "Szef": "#FFD700",
  "Zwiadowca": "#1E90FF",
  "Wojownik": "#32CD32",
  "Rekrut": "#CCCCCC"
};

const allMembers = [
  {
    name: "PoseidonKing",
    title: "Szef",
    chests: [
      { date: "2025-10-15", type: "Olympus" },
      { date: "2025-10-18", type: "Crypt" },
      { date: "2025-10-20", type: "RoTA" }
    ],
    armyLevel: { G: 4, S: 3, M: 2, E: 5 }
  },
  {
    name: "AquaScout",
    title: "Zwiadowca",
    chests: [
      { date: "2025-10-16", type: "Heroic" },
      { date: "2025-10-19", type: "Epic Kill" }
    ],
    armyLevel: { G: 3, S: 2, M: 1, E: 2 }
  },
  {
    name: "TridentWarrior",
    title: "Wojownik",
    chests: [
      { date: "2025-10-17", type: "Citadel" },
      { date: "2025-10-21", type: "Crypt" }
    ],
    armyLevel: { G: 2, S: 1, M: 0, E: 1 }
  },
  {
    name: "SeaReaper",
    title: "Rekrut",
    chests: [
      { date: "2025-10-14", type: "RoTA" }
    ],
    armyLevel: { G: 1, S: 0, M: 0, E: 0 }
  }
];

function formatPlayerName(player) {
  const color = RANK_COLORS[player.title] || "#000";
  return `<span style="color:${color}">${player.name} [${player.title}]</span>`;
}

function renderTable() {
  const tbody = document.getElementById("player-table-body");
  tbody.innerHTML = "";

  allMembers.forEach((member, index) => {
    const totalPoints = member.chests.reduce((sum, chest) => sum + (CHEST_POINTS[chest.type] || 0), 0);
    const belowThreshold = totalPoints < WEEKLY_POS_THRESHOLD;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatPlayerName(member)} ${belowThreshold ? "⚠️" : ""}</td>
      <td>${totalPoints}</td>
      <td>${belowThreshold ? "⚠️ Niski" : "✅ OK"}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderWeeklyReport() {
  const rangeDays = parseInt(document.getElementById("report-range").value);
  const tbody = document.getElementById("weekly-report-table");
  tbody.innerHTML = "";

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - rangeDays);

  const reportData = allMembers.map(member => {
    const points = member.chests
      .filter(chest => new Date(chest.date) >= startDate)
      .reduce((sum, chest) => sum + (CHEST_POINTS[chest.type] || 0), 0);

    return {
      name: member.name,
      title: member.title,
      points,
      status: points >= WEEKLY_POS_THRESHOLD ? "✅ OK" : "⚠️ Niski"
    };
  });

  reportData.sort((a, b) => b.points - a.points);

  reportData.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><span style="color:${RANK_COLORS[entry.title] || "#000"}">${entry.name} [${entry.title}]</span></td>
      <td>${entry.points}</td>
      <td>${entry.status}</td>
    `;
    tbody.appendChild(row);
  });

  renderWeeklyReportChart(reportData, rangeDays);
}

function renderWeeklyReportChart(data, rangeDays) {
  const ctx = document.getElementById("weeklyReportChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: `Punkty POS (${rangeDays} dni)`,
        data: data.map(d => d.points),
