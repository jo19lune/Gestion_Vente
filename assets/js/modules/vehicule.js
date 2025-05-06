
document.addEventListener("DOMContentLoaded", function () {
    console.log("vehicule.js est chargé !");
    fetchVehicules();

    // Ajout d'un véhicule
    document.getElementById("addVehiculeForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter ce véhicule ? Vérifiez les informations avant validation.")) {
            let formData = {
                marque: document.getElementById("marque").value,
                model: document.getElementById("modele").value,
                cylindree: document.getElementById("cylindree").value,
                moteur: document.getElementById("moteur").value,
                categorie: document.getElementById("categorie").value,
                stock: document.getElementById("stock").value,
                prix_u: document.getElementById("prix_u").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/vehicule.php?action=create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchVehicules();
                    document.getElementById("addVehiculeForm").reset();
                    alert("Véhicule ajouté avec succès !");
                } else {
                    alert("Erreur lors de l'ajout.");
                }
            });
        }
    });

    // Modification d'un véhicule
    document.getElementById("updateVehiculeForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier ce véhicule ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_vehicule: document.getElementById("id_vehicule_update").value,
                marque: document.getElementById("marque_update").value,
                model: document.getElementById("modele_update").value,
                cylindree: document.getElementById("cylindree_update").value,
                moteur: document.getElementById("moteur_update").value,
                categorie: document.getElementById("categorie_update").value,
                stock: document.getElementById("stock_update").value,
                prix_u: document.getElementById("prix_u_update").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/vehicule.php?action=update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchVehicules();
                    document.getElementById("updateVehiculeForm").reset();
                    alert("Véhicule modifié avec succès !");
                } else {
                    alert("Erreur lors de la modification.");
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher les véhicules
function fetchVehicules() {
    fetch("http://localhost/Gestion_Vente/php/gestion/vehicule.php?action=read")
        .then(response => response.json())
        .then(vehicules => {
            console.log("Données reçues :", vehicules);
            let tableBody = document.getElementById("vehiculesTable");
            tableBody.innerHTML = "";

            if (!vehicules || vehicules.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='9'>Aucun véhicule trouvé</td></tr>";
                return;
            }

            vehicules.forEach(v => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${v.id_vehicule}</td>
                        <td>${v.marque}</td>
                        <td>${v.model}</td>
                        <td>${v.cyl}</td>
                        <td>${v.moteur}</td>
                        <td>${v.categorie}</td>
                        <td>${v.stock}</td>
                        <td>${v.prix_u} €</td>
                        <td>
                            <button class="delete" onclick="deleteVehicule(${v.id_vehicule})">Supprimer</button>
                            <button class="update" onclick="fillUpdateForm(${v.id_vehicule}, '${v.marque}', '${v.model}', ${v.cyl}, '${v.moteur}', '${v.categorie}', ${v.stock}, ${v.prix_u})">Modifier</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Erreur AJAX :", error));
}

// Fonction pour remplir le formulaire de modification
function fillUpdateForm(id, marque, modele, cylindree, moteur, categorie, stock, prix_u) {
    document.getElementById("id_vehicule_update").value = id;
    document.getElementById("marque_update").value = marque;
    document.getElementById("modele_update").value = modele;
    document.getElementById("cylindree_update").value = cylindree;
    document.getElementById("moteur_update").value = moteur;
    document.getElementById("categorie_update").value = categorie;
    document.getElementById("stock_update").value = stock;
    document.getElementById("prix_u_update").value = prix_u;

    // Défilement vers le formulaire de modification
    document.getElementById("updateVehiculeForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Fonction pour rechercher des vehicules
function searchVehicules() {
    let input = document.getElementById("searchVehiculeInput").value.trim().toLowerCase();
    let rows = document.querySelectorAll("#vehiculesTable tr");

    rows.forEach(row => {
        let matchFound = Array.from(row.cells).slice(0, -1).some(cell => 
            cell.textContent.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(input)
        );
        row.style.display = matchFound ? "" : "none";
    });
}
