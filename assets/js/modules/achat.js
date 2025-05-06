$(document).ready(function () {
    console.log("achat.js est chargé !");
    getLastFactureId(); // Récupérer l'ID de la dernière facture au chargement
    fetchAchats(); // Charger toutes les ventes au démarrage

    // Ajout d'une vente
    $("#addAchatForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment ajouter cette vente ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_client: $("#id_client").val(),
                id_employe: $("#id_employe").val(),
                id_facture: $("#id_facture").val(),
                id_vehicule: $("#id_vehicule").val(),
                quantite: $("#quantite").val(),
                date_vente: $("#date_vente").val(),
                prix_total: $("#prix_total").val()
            };

            if (Object.values(formData).some(val => val === "")) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/achat.php?action=create",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        alert("Vente ajoutée avec succès !");
                        afficherTfoot();
                        fetchAchatsParFacture(); // Charge uniquement les achats liés à cette facture
                        calculerPrixTotalUpdate();
                        $("#id_facture").val(formData.id_facture); // Rétablir l’ID facture après l’ajout
                    } else {
                        alert("Erreur lors de l'ajout.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Erreur AJAX :", error);
                }
            });
        }
    });

    // Affichage et gestion du tfoot
    function afficherTfoot() {
        $(".actionValide").show(); // Rendre visible seulement après un ajout
    }

    // Actions pour Valider
    $(".valider").on("click", function () {
        let id_facture = $("#id_facture").val();
        let montant_total = $("#montant_total").val();

        if (!id_facture || montant_total <= 0) {
            alert("Impossible de créer une facture sans montant valide !");
            return;
        }

        $.ajax({
            url: "http://localhost/Gestion_Vente/php/gestion/facture.php?action=create",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                id_facture: id_facture,
                montant_total: montant_total
            }),
            success: function (data) {
                if (data.success) {
                    alert("Facture créée avec succès !");
                    fetchAchats();
                    cacherTfoot();
                } else {
                    alert("Erreur lors de la création de la facture.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur AJAX :", error);
                alert("Erreur AJAX : " + error);
            }
        });
    });

    // Action pour Annuler
    $(".annuler").on("click", function () {
        let id_facture = $("#id_facture").val();

        if (!id_facture) {
            alert("Aucune facture sélectionnée !");
            return;
        }

        if (confirm(`Voulez-vous vraiment supprimer toutes les ventes associées à la facture ${id_facture} ?`)) {
            $.ajax({
                url: `http://localhost/Gestion_Vente/php/gestion/achat.php?action=deleteByFacture&id_facture=${id_facture}`,
                method: "GET",
                success: function (data) {
                    if (data.success) {
                        alert("Toutes les ventes liées à cette facture ont été supprimées !");
                        fetchAchats(); // Recharge toutes les ventes
                        cacherTfoot(); // Masquer les boutons
                    } else {
                        alert("Erreur lors de la suppression des ventes.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Erreur AJAX lors de la suppression :", error);
                    alert("Erreur AJAX lors de la suppression : " + error);
                }
            });
        }
    });

    // Cacher les boutons valider et annuler
    function cacherTfoot() {
        $(".actionValide").hide(); // Cacher après validation ou annulation
    }

    // Modification d'une vente
    $("#updateAchatForm").on("submit", function (event) {
        event.preventDefault();

        if (confirm("Voulez-vous vraiment modifier cette vente ? Vérifiez les informations avant validation.")) {
            let formData = {
                id_vente: $("#id_vente_update").val(),
                id_client: $("#id_client_update").val(),
                id_employe: $("#id_employe_update").val(),
                id_facture: $("#id_facture_update").val(),
                id_vehicule: $("#id_vehicule_update").val(),
                quantite: $("#quantite_update").val(),
                date_vente: $("#date_vente_update").val(),
                prix_total: $("#prix_total_update").val()
            };

            if (Object.values(formData).some(val => val === "")) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            $.ajax({
                url: "http://localhost/Gestion_Vente/php/gestion/achat.php?action=update",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.success) {
                        chargerLesAchats();
                        $("#updateAchatForm")[0].reset();
                        alert("Vente modifiée avec succès !");
                    } else {
                        alert("Erreur lors de la modification.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Erreur AJAX :", error);
                    alert("Erreur AJAX lors de la modification : " + error);
                }
            });
        }
    });
});

// Fonction pour récupérer et afficher toutes les ventes
function fetchAchats() {
    $.ajax({
        url: "http://localhost/Gestion_Vente/php/gestion/achat.php?action=read",
        method: "GET",
        dataType: "json",
        success: function (ventes) {
            let tableBody = $("#achatsTable");
            if (!tableBody.length) return;

            tableBody.empty();

            if (!ventes || ventes.length === 0) {
                tableBody.append("<tr><td colspan='12'>Aucune vente trouvée</td></tr>");
                return;
            }

            ventes.forEach(v => {
                tableBody.append(`
                    <tr>
                        <td>${v.id_vente}</td>
                        <td>${v.id_client}</td>
                        <td>${v.id_employe}</td>
                        <td>${v.id_facture}</td>
                        <td>${v.id_vehicule}</td>
                        <td>${v.date_vente}</td>
                        <td>${v.categorie}</td>
                        <td>${v.marque}</td>
                        <td>${v.model}</td>
                        <td>${v.quantite}</td>
                        <td>${v.prix_total} €</td>
                        <td>
                            <button class="update" onclick="fillUpdateForm(${v.id_vente}, ${v.id_client}, ${v.id_employe}, ${v.id_facture}, ${v.id_vehicule}, ${v.quantite}, '${v.date_vente}', ${v.prix_total})">Modifier</button>
                            <button class="delete" onclick="deleteAchat(${v.id_vente})">Supprimer</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (xhr, status, error) {
            console.error("Erreur AJAX :", error);
            alert("Erreur AJAX lors de chargement des ventes : " + error);
        }
    });
}

// Fonction pour récupérer et afficher les ventes par facture en cours
function fetchAchatsParFacture() {
    let id_facture = $("#id_facture").val(); // Récupérer l'ID facture actuel
    
    if (!id_facture) return; // Si aucun ID facture n'est défini, ne pas afficher les données

    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/achat.php?action=read&facture_id=${id_facture}`,
        method: "GET",
        dataType: "json",
        success: function (ventes) {
            let tableBody = $("#achatsTable");
            if (!tableBody.length) return;

            tableBody.empty();

            if (!ventes || ventes.length === 0) {
                //tableBody.append(`<tr><td colspan='12'>Aucune vente trouvée pour cette facture (${id_facture})</td></tr>`);
                return;
            }

            ventes.forEach(v => {
                tableBody.append(`
                    <tr>
                        <td>${v.id_vente}</td>
                        <td>${v.id_client}</td>
                        <td>${v.id_employe}</td>
                        <td>${v.id_facture}</td>
                        <td>${v.id_vehicule}</td>
                        <td>${v.date_vente}</td>
                        <td>${v.categorie}</td>
                        <td>${v.marque}</td>
                        <td>${v.model}</td>
                        <td>${v.quantite}</td>
                        <td>${v.prix_total} €</td>
                        <td>
                            <button class="update" onclick="fillUpdateForm(${v.id_vente}, ${v.id_client}, ${v.id_employe}, ${v.id_facture}, ${v.id_vehicule}, ${v.quantite}, '${v.date_vente}', ${v.prix_total})">Modifier</button>
                            <button class="delete" onclick="deleteAchat(${v.id_vente})">Supprimer</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (xhr, status, error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

// Fonction pour remplir le formulaire de modification
function fillUpdateForm(id_vente, id_client, id_employe, id_facture, id_vehicule, quantite, date_vente, prix_total) {
    console.log("Valeurs reçues pour modification :", id_vente, id_employe, id_facture, prix_total);

    $("#id_vente_update").val(id_vente);
    $("#id_client_update").val(id_client);
    $("#id_employe_update").val(id_employe);
    $("#id_facture_update").val(id_facture);
    $("#id_vehicule_update").val(id_vehicule);
    $("#quantite_update").val(quantite);
    $("#date_vente_update").val(date_vente);
    $("#prix_total_update").val(prix_total);

    $("html, body").animate({ scrollTop: $("#updateAchatForm").offset().top }, "smooth");
}

// Fonction pour supprimer une vente avec jQuery
function deleteAchat(id_vente) {
    if (confirm("Voulez-vous vraiment supprimer cette vente ? Cette action est irréversible.")) {
        $.ajax({
            url: `http://localhost/Gestion_Vente/php/gestion/achat.php?action=delete&id=${id_vente}`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    chargerLesAchats();
                    alert("Vente supprimée avec succès !");
                } else {
                    alert("Erreur lors de la suppression.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur AJAX lors de la suppression :", error);
            }
        });
    }
}

// Fonction pour récupérer l'ID de la dernière facture avec jQuery
function getLastFactureId() {
    $.ajax({
        url: "http://localhost/Gestion_Vente/php/gestion/achat.php?action=getLastFacture",
        method: "GET",
        dataType: "json",
        success: function (data) {
            let factureInput = $("#id_facture");
            if (factureInput.length) factureInput.val(data.id_facture);
        },
        error: function (xhr, status, error) {
            console.error("Erreur lors de la récupération de l'ID Facture :", error);
        }
    });
}


$("#id_vehicule").on("change", calculerPrixTotal);
$("#quantite").on("input", calculerPrixTotal);

// Fonction pour calculer le prix total lors de l'ajout d'une vente
function calculerPrixTotal() {
    let idVehicule = $("#id_vehicule").val();
    let quantite = $("#quantite").val();

    if (!idVehicule || !quantite) return;

    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/vehicule.php?action=getPrice&id_vehicule=${idVehicule}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            if (data.prix_u) {
                $("#prix_total").val((quantite * data.prix_u).toFixed(2));
            } else {
                console.error("Erreur : Prix unitaire non trouvé");
            }
        },
        error: function (xhr, status, error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

$("#id_vehicule_update").on("change", calculerPrixTotalUpdate);
$("#quantite_update").on("input", calculerPrixTotalUpdate);

// Fonction pour calculer le prix total lors de la mise à jour d'une vente
function calculerPrixTotalUpdate() {
    let idVehicule = $("#id_vehicule_update").val();
    let quantite = $("#quantite_update").val();

    if (!idVehicule || !quantite) return;

    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/vehicule.php?action=getPrice&id_vehicule=${idVehicule}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            if (data.prix_u) {
                $("#prix_total_update").val((quantite * data.prix_u).toFixed(2));
            } else {
                console.error("Erreur : Prix unitaire non trouvé");
            }
        },
        error: function (xhr, status, error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

// Calcule le montant total d'une facture et met à jour le champ "montant_total".
function calculerMontantTotal() {
    let id_facture = $("#id_facture").val();

    if (!id_facture) {
        alert("Aucun ID de facture fourni pour le calcul du montant total.");
        return;
    }

    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/achat.php?action=getMontantTotal&id_facture=${id_facture}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            if (data && data.montant_total !== undefined) {
                let montantTotal = parseFloat(data.montant_total);

                if (!isNaN(montantTotal)) {
                    $("#montant_total").val(montantTotal.toFixed(2));
                } else {
                    alert("Montant total invalide : " + data.montant_total);
                    $("#montant_total").val("0.00");
                }
            } else {
                alert("Réponse inattendue du serveur : " + JSON.stringify(data));
                $("#montant_total").val("0.00");
            }
        },
        error: function (xhr, status, error) {
            alert("Erreur AJAX lors du calcul du montant total : " + error);
            $("#montant_total").val("0.00");
        }
    });
}

// Appeler la fonction après chaque ajout d'achat
$("#addAchatForm").on("submit", function () {
    setTimeout(calculerMontantTotal, 1000); // calcul après 1 seconde
});

// Mettre à jour le montant total aussi après validation ou annulation
$(".valider").on("click", calculerMontantTotal);
$(".annuler").on("click", calculerMontantTotal);

// Recherche d'une vente
function searchAchats() {
    let input = $("#searchAchatInput").val().toLowerCase();
    let rows = $("#achatsTable tr");

    rows.each(function () {
        let found = false;
        $(this).find("td").each(function () {
            if ($(this).text().toLowerCase().includes(input)) {
                found = true;
                return false; // Arrêter la boucle interne
            }
        });
        $(this).toggle(found);
    });
}

// fonction pour afficher les vente lie a la facture actuelle apres modification ou suppression de vente
function chargerLesAchats() {
    let id_facture = $("#id_facture").val(); // Récupérer l'ID facture actuel

    // compare l'ID de la facture actuelle avec l'ID de la facture de la vente a modifiée ou supprimer
    let rows = $("#achatsTable tr");
    let factureExists = false;

    rows.each(function () {
        let factureIdCell = $(this).find("td:nth-child(4)"); // Assuming the 4th column contains id_facture
        if (factureIdCell.text() === id_facture) {
            factureExists = true;
            return false; // Exit the loop early if a match is found
        }
    });

    if (!factureExists) {
        fetchAchats();
    } else {
        fetchAchatsParFacture();
    }
}


/*

document.addEventListener("DOMContentLoaded", function () {
    console.log("achat.js est chargé !");
    getLastFactureId(); // Récupérer l'ID de la dernière facture au chargement
    fetchAchats();

    // Ajout d'une vente
    let addForm = document.getElementById("addAchatForm");
    if (addForm) {
        addForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (confirm("Voulez-vous vraiment ajouter cette vente ? Vérifiez les informations avant validation.")) {
                let formData = {
                    id_client: document.getElementById("id_client").value,
                    id_employe: document.getElementById("id_employe").value,
                    id_facture: document.getElementById("id_facture").value,
                    id_vehicule: document.getElementById("id_vehicule").value,
                    quantite: document.getElementById("quantite").value,
                    date_vente: document.getElementById("date_vente").value,
                    prix_total: document.getElementById("prix_total").value
                };

                if (Object.values(formData).some(val => val === "")) {
                    alert("Veuillez remplir tous les champs obligatoires.");
                    return;
                }

                fetch("http://localhost/Gestion_Vente/php/gestion/achat.php?action=create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }).then(response => response.json()).then(data => {
                    if (data.success) {
                        fetchAchats();
                        document.getElementById("addAchatForm").reset();
                        alert("Vente ajoutée avec succès !");
                    } else {
                        alert("Erreur lors de l'ajout.");
                    }
                }).catch(error => console.error("Erreur AJAX :", error));
            }
        });
    }

    // Modification d'une vente
    let updateForm = document.getElementById("updateAchatForm");
    if (updateForm) {
        updateForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (confirm("Voulez-vous vraiment modifier cette vente ? Vérifiez les informations avant validation.")) {
                let formData = {
                    id_vente: document.getElementById("id_vente_update").value,
                    id_client: document.getElementById("id_client_update").value,
                    id_employe: document.getElementById("id_employe_update").value,
                    id_facture: document.getElementById("id_facture_update").value,
                    id_vehicule: document.getElementById("id_vehicule_update").value,
                    quantite: document.getElementById("quantite_update").value,
                    date_vente: document.getElementById("date_vente_update").value,
                    prix_total: document.getElementById("prix_total_update").value
                };

                if (Object.values(formData).some(val => val === "")) {
                    alert("Veuillez remplir tous les champs obligatoires.");
                    return;
                }

                fetch("http://localhost/Gestion_Vente/php/gestion/achat.php?action=update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }).then(response => response.json()).then(data => {
                    if (data.success) {
                        fetchAchats();
                        document.getElementById("updateAchatForm").reset();
                        alert("Vente modifiée avec succès !");
                    } else {
                        alert("Erreur lors de la modification.");
                    }
                }).catch(error => console.error("Erreur AJAX :", error));
            }
        });
    }
});

// Fonction pour récupérer et afficher les ventes
function fetchAchats() {
    fetch("http://localhost/Gestion_Vente/php/gestion/achat.php?action=read")
        .then(response => response.json())
        .then(ventes => {
            console.log("Données reçues :", ventes);
            let tableBody = document.getElementById("achatsTable");
            if (!tableBody) return;

            tableBody.innerHTML = "";

            if (!ventes || ventes.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='12'>Aucune vente trouvée</td></tr>";
                return;
            }

            ventes.forEach(v => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${v.id_vente}</td>
                        <td>${v.id_client}</td>
                        <td>${v.id_employe}</td>
                        <td>${v.id_facture}</td>
                        <td>${v.id_vehicule}</td>
                        <td>${v.date_vente}</td>
                        <td>${v.categorie}</td>
                        <td>${v.marque}</td>
                        <td>${v.model}</td>
                        <td>${v.quantite}</td>
                        <td>${v.prix_total} €</td>
                        <td>
                            <button class="update" onclick="fillUpdateForm(${v.id_vente}, ${v.id_client}, ${v.id_employe}, ${v.id_facture}, ${v.id_vehicule}, ${v.quantite}, '${v.date_vente}', ${v.prix_total})">Modifier</button>
                            <button class="delete" onclick="deleteAchat(${v.id_vente})">Supprimer</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Erreur AJAX :", error));
}
*/