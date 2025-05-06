$(document).ready(function () {
    console.log("employe.js est chargé !");
    fetchEmployes();

    // Ajout d'un employé
    $("#addEmployeForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter cet employé ? Vérifiez les informations avant validation.")) {
            let formData = {
                nom_employe: $("#nom_employe").val(),
                prenom_employe: $("#prenom_employe").val(),
                cin_employe: $("#cin_employe").val(),
                adresse_employe: $("#adresse_employe").val(),
                telephone_employe: $("#telephone_employe").val(),
                email_employe: $("#email_employe").val(),
                mot_de_passe: $("#mot_de_passe").val(),
                poste_employe: $("#poste_employe").val(),
                salaire: $("#salaire").val(),
                date_embauche: $("#date_embauche").val()
            };

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/employe.php?action=create",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        fetchEmployes();
                        $("#addEmployeForm")[0].reset();
                        alert("Employé ajouté avec succès !");
                    } else {
                        alert("Erreur lors de l'ajout.");
                    }
                }
            });
        }
    });

    // Modification d'un employé
    $("#updateEmployeForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier cet employé ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_employe: $("#id_employe_update").val(),
                nom_employe: $("#nom_update").val(),
                prenom_employe: $("#prenom_update").val(),
                cin_employe: $("#cin_update").val(),
                adresse_employe: $("#adresse_update").val(),
                telephone_employe: $("#telephone_update").val(),
                email_employe: $("#email_update").val(),
                poste_employe: $("#poste_update").val(),
                salaire: $("#salaire_update").val(),
                date_embauche: $("#date_embauche_update").val()
            };

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/employe.php?action=update",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        fetchEmployes();
                        $("#updateEmployeForm")[0].reset();
                        alert("Employé modifié avec succès !");
                    } else {
                        alert("Erreur lors de la modification.");
                    }
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher les employés
function fetchEmployes() {
    $.ajax({
        url: "http://localhost/Gestion_Vente/php/gestion/employe.php?action=read",
        method: "GET",
        success: function (employes) {
            console.log("Données reçues :", employes);
            let tableBody = $("#employesTable");
            tableBody.empty();

            if (!employes || employes.length === 0) {
                tableBody.html("<tr><td colspan='12'>Aucun employé trouvé</td></tr>");
                return;
            }

            employes.forEach(e => {
                tableBody.append(`
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
                `);
            });
        },
        error: function (error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

// Fonction pour supprimer un employé avec confirmation
function deleteEmploye(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.")) {
        $.ajax({
            url: `http://localhost/Gestion_Vente/php/gestion/employe.php?action=delete&id=${id}`,
            method: "GET",
            success: function (data) {
                if (data.success) {
                    fetchEmployes();
                    alert("Employé supprimé avec succès !");
                } else {
                    alert("Erreur lors de la suppression.");
                }
            }
        });
    }
}

// Fonction pour remplir le formulaire de modification et faire défiler
function fillUpdateForm(id, nom, prenom, cin, adresse, telephone, email, poste, salaire, date_embauche) {
    $("#id_employe_update").val(id);
    $("#nom_update").val(nom);
    $("#prenom_update").val(prenom);
    $("#cin_update").val(cin);
    $("#adresse_update").val(adresse);
    $("#telephone_update").val(telephone);
    $("#email_update").val(email);
    $("#poste_update").val(poste);
    $("#salaire_update").val(salaire);
    $("#date_embauche_update").val(date_embauche);

    // défiler vers le formulaire de mise à jour
    $("html, body").animate({
        scrollTop: $("#updateEmployeForm").offset().top
    }, "smooth");
}

// Fonction pour rechercher des employés
function searchEmployes() {
    let input = $("#searchInput").val().trim().toLowerCase();
    $("#employesTable tr").each(function () {
        let matchFound = $(this).find("td").slice(0, -1).toArray().some(cell => $(cell).text().trim().toLowerCase().includes(input));
        $(this).toggle(matchFound);
    });
}
