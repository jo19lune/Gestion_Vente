$(document).ready(function () {
    console.log("achat.js est chargé !");
    getLastFactureId();
    fetchAchats();

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
                        fetchAchatsParFacture();
                        calculerPrixTotalUpdate();
                        $("#id_facture").val(formData.id_facture);
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

    function afficherTfoot() {
        $(".actionValide").show();
    }

    $(".valider").on("click", function () {
        let id_client = $("#id_client").val();
        let id_employe = $("#id_employe").val();
        let montant_total = $("#montant_total").val();
    
        if (!id_client || !id_employe || montant_total <= 0) {
            alert("Impossible de créer une facture sans données valides !");
            return;
        }

        $.ajax({
            url: "http://localhost/Gestion_Vente/php/gestion/facture.php?action=create",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                id_client: id_client,
                id_employe: id_employe,
                montant_total: montant_total
            }),
            success: function (data) {
                console.log("Réponse du serveur :", data);
    
                if (data.success) {
                    alert(`Facture créée avec succès ! ID Facture : ${data.id_facture}`);
                    $("#id_facture").val(data.id_facture);
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
                        fetchAchats();
                        cacherTfoot();
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

    function cacherTfoot() {
        $(".actionValide").hide();
    }

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

function fetchAchatsParFacture() {
    let id_facture = $("#id_facture").val();
    
    if (!id_facture) return;

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

$("#addAchatForm").on("submit", function () {
    setTimeout(calculerMontantTotal, 1000);
});

$(".valider").on("click", calculerMontantTotal);
$(".annuler").on("click", calculerMontantTotal);

function searchAchats() {
    let input = $("#searchAchatInput").val().toLowerCase();
    let rows = $("#achatsTable tr");

    rows.each(function () {
        let found = false;
        $(this).find("td").each(function () {
            if ($(this).text().toLowerCase().includes(input)) {
                found = true;
                return false; 
            }
        });
        $(this).toggle(found);
    });
}

function chargerLesAchats() {
    let id_facture = $("#id_facture").val();

    let rows = $("#achatsTable tr");
    let factureExists = false;

    rows.each(function () {
        let factureIdCell = $(this).find("td:nth-child(4)"); 
        if (factureIdCell.text() === id_facture) {
            factureExists = true;
            return false; 
        }
    });

    if (!factureExists) {
        fetchAchats();
    } else {
        fetchAchatsParFacture();
    }
}
