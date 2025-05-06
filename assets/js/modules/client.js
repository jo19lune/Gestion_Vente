document.addEventListener("DOMContentLoaded", function () {
    console.log("client.js est chargé !");
    fetchClients();

    // Ajout d'un client
    document.getElementById("addClientForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter ce client ? Vérifiez les informations avant validation.")) {
            let formData = {
                nom_client: document.getElementById("nom_client").value,
                prenom_client: document.getElementById("prenom_client").value,
                cin_client: document.getElementById("cin_client").value,
                adresse: document.getElementById("adresse_client").value,
                telephone: document.getElementById("telephone_client").value,
                email: document.getElementById("email_client").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/client.php?action=create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchClients();
                    document.getElementById("addClientForm").reset();
                    alert("Client ajouté avec succès !");
                } else {
                    alert("Erreur lors de l'ajout.");
                }
            });
        }
    });

    // Modification d'un client
    document.getElementById("updateClientForm").addEventListener("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier ce client ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_client: document.getElementById("id_client_update").value,
                nom_client: document.getElementById("nom_update").value,
                prenom_client: document.getElementById("prenom_update").value,
                cin_client: document.getElementById("cin_update").value,
                adresse: document.getElementById("adresse_update").value,
                telephone: document.getElementById("telephone_update").value,
                email: document.getElementById("email_update").value
            };

            fetch("http://localhost/Gestion_Vente/php/gestion/client.php?action=update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                if (data.success) {
                    fetchClients();
                    document.getElementById("updateClientForm").reset();
                    alert("Client modifié avec succès !");
                } else {
                    alert("Erreur lors de la modification.");
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher les clients
function fetchClients() {
    fetch("http://localhost/Gestion_Vente/php/gestion/client.php?action=read")
        .then(response => response.json())
        .then(clients => {
            console.log("Données reçues :", clients);
            let tableBody = document.getElementById("clientsTable");
            tableBody.innerHTML = "";

            if (!clients || clients.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='8'>Aucun client trouvé</td></tr>";
                return;
            }

            clients.forEach(c => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${c.id_client}</td>
                        <td>${c.nom_client}</td>
                        <td>${c.prenom_client}</td>
                        <td>${c.cin_client}</td>
                        <td>${c.adresse}</td>
                        <td>${c.telephone}</td>
                        <td>${c.email}</td>
                        <td>
                            <button class="delete" onclick="deleteClient(${c.id_client})">Supprimer</button>
                            <button class="update" onclick="fillUpdateForm(${c.id_client}, '${c.nom_client}', '${c.prenom_client}', '${c.cin_client}', '${c.adresse}', '${c.telephone}', '${c.email}')">Modifier</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Erreur AJAX :", error));
}

// Fonction pour supprimer un client avec confirmation
function deleteClient(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.")) {
        fetch(`http://localhost/Gestion_Vente/php/gestion/client.php?action=delete&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchClients();
                    alert("Client supprimé avec succès !");
                } else {
                    alert("Erreur lors de la suppression.");
                }
            });
    }
}

// Fonction pour remplir le formulaire de modification et faire défiler
function fillUpdateForm(id, nom, prenom, cin, adresse, telephone, email ) {
    document.getElementById("id_client_update").value = id;
    document.getElementById("nom_update").value = nom;
    document.getElementById("prenom_update").value = prenom;
    document.getElementById("cin_update").value = cin;
    document.getElementById("adresse_update").value = adresse;
    document.getElementById("telephone_update").value = telephone;
    document.getElementById("email_update").value = email;

    // défiler vers le formulaire de modification
    document.getElementById("updateClientForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

// Fonction pour rechercher des clients
function searchClients() {
    let input = document.getElementById("searchClientInput").value.trim().toLowerCase();
    let rows = document.querySelectorAll("#clientsTable tr");

    rows.forEach(row => {
        let matchFound = Array.from(row.cells).slice(0, -1).some(cell => cell.textContent.trim().toLowerCase().includes(input));
        row.style.display = matchFound ? "" : "none";
    });
}
