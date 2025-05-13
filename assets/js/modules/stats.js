document.addEventListener("DOMContentLoaded", function() {
    let charts = {}; // Stocke les instances des graphiques

    function resetCanvas(canvasId) {
        const canvasContainer = document.getElementById(canvasId + "-container");

        if (!canvasContainer) {
            console.error(`Erreur : '${canvasId}-container' introuvable !`);
            return;
        }

        canvasContainer.innerHTML = `<canvas id="${canvasId}" width="800" height="400"></canvas>`;
    }

    function generateColors(count) {
        let colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
        }
        return colors;
    }

    function createChart(canvasId, type, label, data, isSingleValue = false) {
        if (!data || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0)) {
            console.warn(`⚠ Données vides pour '${canvasId}', mais le graphique sera affiché.`);
            return;
        }

        resetCanvas(canvasId);
        const ctx = document.getElementById(canvasId).getContext("2d");

        if (charts[canvasId]) {
            charts[canvasId].destroy();
        }

        let maxValue = isSingleValue ? data.total_clients + 10 : Math.max(...data.map(item => parseFloat(item.total_ventes || item.total_achats || item.stock_total))) + 10;

        charts[canvasId] = new Chart(ctx, {
            type: type,
            data: {
                labels: isSingleValue ? ["Total Clients"] : data.map(item => item.mois || item.marque || item.nom_employe),
                datasets: [{
                    label: label,
                    data: isSingleValue ? [data.total_clients || 0] : data.map(item => parseFloat(item.total_ventes || item.total_achats || item.stock_total)),
                    backgroundColor: generateColors(data.length),
                    borderColor: "#fff",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxValue,
                        ticks: {
                            stepSize: Math.ceil(maxValue / 5),
                            callback: function(value) {
                                return value + (canvasId === "clientsChart" ? " clients" : "");
                            }
                        }
                    }
                }
            }
        });
    }

    function updateStatsTable(data) {
        const tableBody = document.getElementById("statsTableBody");
        tableBody.innerHTML = "";

        data.ventes.forEach((vente, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vente.mois}</td>
                <td>${vente.total_ventes}</td>
                <td>${data.clients_total.total_clients}</td>
                <td>${data.vehicules.length}</td>
                <td>${data.employes_ventes[index]?.nom_employe || 'N/A'} ${data.employes_ventes[index]?.prenom_employe || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function fetchStats() {
        fetch("../php/gestion/statistique.php")
            .then(response => response.json())
            .then(data => {
                if (!data || Object.keys(data).length === 0) {
                    throw new Error("Les données statistiques sont vides ou incorrectes.");
                }

                createChart("statsChart", "bar", "Ventes mensuelles", data.ventes);
                createChart("clientsChart", "line", "Clients inscrits", data.clients_total, true);
                createChart("vehiculesChart", "pie", "Stock des véhicules", data.vehicules);
                createChart("employesChart", "doughnut", "Performances des employés", data.employes_ventes);

                updateStatsTable(data);
            })
            .catch(error => console.error("Erreur récupération stats :", error.message));
    }

    // Chargement initial
    fetchStats();
});
