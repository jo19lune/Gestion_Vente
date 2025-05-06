document.addEventListener("DOMContentLoaded", function () {
    console.log("employe.js est chargé !");
    fetchEmployes();

    // Ajout d'un employé
    document.getElementById("addEmployeForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter cet employé ? Vérifiez les informations avant validation.")) {
            let formData = {
                nom_employe: document.getElementById("nom_employe").value,
                prenom_employe: document.getElementById("prenom_employe").value,
                cin_employe: document.getElementById("cin_employe").value,
                adresse_employe: document.getElementById("adresse_employe").value,
                telephone_employe: document.getElementById("telephone_employe").value,
                email_employe: document.getElementById("email_employe").value,
                mot_de_passe: document.getElementById("mot_de_passe").value,
                poste_employe: document.getElementById("poste_employe").value,
                salaire: document.getElementById("salaire").value,
                date_embauche: document.getElementById("date_embauche").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/employe.php?action=create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchEmployes();
                    document.getElementById("addEmployeForm").reset();
                    alert("Employé ajouté avec succès !");
                } else {
                    alert("Erreur lors de l'ajout.");
                }
            });
        }
    });

    // Modification d'un employé
    document.getElementById("updateEmployeForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier cet employé ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_employe: document.getElementById("id_employe_update").value,
                nom_employe: document.getElementById("nom_update").value,
                prenom_employe: document.getElementById("prenom_update").value,
                cin_employe: document.getElementById("cin_update").value,
                adresse_employe: document.getElementById("adresse_update").value,
                telephone_employe: document.getElementById("telephone_update").value,
                email_employe: document.getElementById("email_update").value,
                poste_employe: document.getElementById("poste_update").value,
                salaire: document.getElementById("salaire_update").value,
                date_embauche: document.getElementById("date_embauche_update").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/employe.php?action=update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchEmployes();
                    document.getElementById("updateEmployeForm").reset();
                    alert("Employé modifié avec succès !");
                } else {
                    alert("Erreur lors de la modification.");
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher les employés
function fetchEmployes() {
    fetch("http://localhost/Gestion_Vente/php/gestion/employe.php?action=read")
        .then(response => response.json())
        .then(employes => {
            console.log("Données reçues :", employes);
            let tableBody = document.getElementById("employesTable");
            tableBody.innerHTML = "";

            if (!employes || employes.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='12'>Aucun employé trouvé</td></tr>";
                return;
            }

            employes.forEach(e => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${e.id_employe}</td>
                        <td>${e.nom_employe}</td>
                        <td>${e.prenom_employe}</td>
                        <td>${e.cin_employe}</td>
                        <td>${e.adresse_employe}</td>
                        <td>${e.telephone_employe}</td>
                        <td>${e.email_employe}</td>
                        <td>${e.poste_employe}</td>
                        <td>${e.salaire}</td>
                        <td>${e.date_embauche}</td>
                        <td>
                            <button class="delete" onclick="deleteEmploye(${e.id_employe})">Supprimer</button>
                            <button class="update" onclick="fillUpdateForm(${e.id_employe}, '${e.nom_employe}', '${e.prenom_employe}', '${e.cin_employe}', '${e.adresse_employe}', '${e.telephone_employe}', '${e.email_employe}', '${e.poste_employe}', ${e.salaire}, '${e.date_embauche}')">Modifier</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Erreur AJAX :", error));
}

// Fonction pour supprimer un employé avec confirmation
function deleteEmploye(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.")) {
        fetch(`http://localhost/Gestion_Vente/php/gestion/employe.php?action=delete&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchEmployes();
                    alert("Employé supprimé avec succès !");
                } else {
                    alert("Erreur lors de la suppression.");
                }
            });
    }
}

// Fonction pour remplir le formulaire de modification et faire défiler
function fillUpdateForm(id, nom, prenom, cin, adresse, telephone, email, poste, salaire, date_embauche) {
    document.getElementById("id_employe_update").value = id;
    document.getElementById("nom_update").value = nom;
    document.getElementById("prenom_update").value = prenom;
    document.getElementById("cin_update").value = cin;
    document.getElementById("adresse_update").value = adresse;
    document.getElementById("telephone_update").value = telephone;
    document.getElementById("email_update").value = email;
    document.getElementById("poste_update").value = poste;
    document.getElementById("salaire_update").value = salaire;
    document.getElementById("date_embauche_update").value = date_embauche;

    // défiler vers le formulaire de mise à jour
    document.getElementById("updateEmployeForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Fonction pour rechercher des employés
function searchEmployes() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let rows = document.querySelectorAll("#employesTable tr");

    rows.forEach(row => {
        let matchFound = Array.from(row.cells).slice(0, -1).some(cell => cell.textContent.trim().toLowerCase().includes(input));
        row.style.display = matchFound ? "" : "none";
    });
}
