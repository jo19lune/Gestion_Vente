$(document).ready(function () {
    console.log("client.js est chargé !");
    fetchClients();

    // Ajout d'un client
    $("#addClientForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter ce client ? Vérifiez les informations avant validation.")) {
            let formData = {
                nom_client: $("#nom_client").val(),
                prenom_client: $("#prenom_client").val(),
                cin_client: $("#cin_client").val(),
                adresse: $("#adresse_client").val(),
                telephone: $("#telephone_client").val(),
                email: $("#email_client").val()
            };

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/client.php?action=create",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        fetchClients();
                        $("#addClientForm")[0].reset();
                        alert("Client ajouté avec succès !");
                    } else {
                        alert("Erreur lors de l'ajout.");
                    }
                }
            });
        }
    });

    // Modification d'un client
    $("#updateClientForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier ce client ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_client: $("#id_client_update").val(),
                nom_client: $("#nom_update").val(),
                prenom_client: $("#prenom_update").val(),
                cin_client: $("#cin_update").val(),
                adresse: $("#adresse_update").val(),
                telephone: $("#telephone_update").val(),
                email: $("#email_update").val()
            };

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/client.php?action=update",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        fetchClients();
                        $("#updateClientForm")[0].reset();
                        alert("Client modifié avec succès !");
                    } else {
                        alert("Erreur lors de la modification.");
                    }
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher les clients
function fetchClients() {
    $.ajax({
        url: "http://localhost/Gestion_Vente/php/gestion/client.php?action=read",
        method: "GET",
        dataType: "json",
        success: function (clients) {
            console.log("Données reçues :", clients);
            let tableBody = $("#clientsTable");
            tableBody.empty();

            if (!clients || clients.length === 0) {
                tableBody.html("<tr><td colspan='8'>Aucun client trouvé</td></tr>");
                return;
            }

            clients.forEach(c => {
                tableBody.append(`
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
                `);
            });
        },
        error: function (error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

// Fonction pour supprimer un client avec confirmation
function deleteClient(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.")) {
        $.ajax({
            url: `http://localhost/Gestion_Vente/php/gestion/client.php?action=delete&id=${id}`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    fetchClients();
                    alert("Client supprimé avec succès !");
                } else {
                    alert("Erreur lors de la suppression.");
                }
            },
            error: function () {
                alert("Erreur lors de la requête.");
            }
        });
    }
}

// Fonction pour remplir le formulaire de modification et faire défiler
function fillUpdateForm(id, nom, prenom, cin, adresse, telephone, email) {
    $("#id_client_update").val(id);
    $("#nom_update").val(nom);
    $("#prenom_update").val(prenom);
    $("#cin_update").val(cin);
    $("#adresse_update").val(adresse);
    $("#telephone_update").val(telephone);
    $("#email_update").val(email);

    // défiler vers le formulaire de modification
    $("html, body").animate({
        scrollTop: $("#updateClientForm").offset().top
    }, "slow");
}

// Fonction pour rechercher des clients
function searchClients() {
    let input = $("#searchClientInput").val().trim().toLowerCase();
    $("#clientsTable tr").each(function () {
        let matchFound = $(this).children("td").not(":last-child").toArray().some(cell => 
            $(cell).text().trim().toLowerCase().includes(input)
        );
        $(this).toggle(matchFound);
    });
}

/*
function searchClients() {
    let input = document.getElementById("searchClientInput").value.trim().toLowerCase();
    let rows = document.querySelectorAll("#clientsTable tr");

    rows.forEach(row => {
        let matchFound = Array.from(row.cells).slice(0, -1).some(cell => cell.textContent.trim().toLowerCase().includes(input));
        row.style.display = matchFound ? "" : "none";
    });
}
 */
