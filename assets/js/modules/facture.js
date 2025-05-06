$(document).ready(function () {
    chargerFactureTable();
    chargerModesPaiement();
    chargerEtatFacture();

    $.getJSON("http://localhost/Gestion_Vente/php/gestion/facture.php?action=getFactures", function (factures) {
        let $selectFacture = $("#id_facture_selected");
        $selectFacture.html("<option value=''>Sélectionner une facture</option>");

        factures.forEach(facture => {
            $selectFacture.append(`<option value="${facture.id_facture}">${facture.id_facture}</option>`);
        });

        if (factures.length > 0) {
            chargerDetailsFacture(factures[0].id_facture);
        }

        $selectFacture.on("change", function () {
            chargerDetailsFacture($(this).val());
        });
    }).fail(function (error) {
        console.error("Erreur lors du chargement des factures :", error);
    });
});

function chargerDetailsFacture(id_facture) {
    if (!id_facture) return;

    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/facture.php?action=getDetails&id_facture=${id_facture}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            $("#factureDetails").html(`
                <tr>
                    <td>${data.id_facture}</td>
                    <td>${data.date_facturation}</td>
                    <td>${data.mode_paiement}</td>
                    <td>${data.montant_total} €</td>
                </tr>
            `);

            $("#clientDetails").html(`
                <tr>
                    <td>${data.id_client}</td>
                    <td>${data.nom_client}</td>
                    <td>${data.prenom_client}</td>
                    <td>${data.cin_client}</td>
                    <td>${data.telephone}</td>
                    <td>${data.email}</td>
                </tr>
            `);

            $("#employeDetails").html(`
                <tr>
                    <td>${data.id_employe}</td>
                    <td>${data.nom_employe}</td>
                    <td>${data.prenom_employe}</td>
                    <td>${data.telephone_employe}</td>
                    <td>${data.email_employe}</td>
                </tr>
            `);

            let $achatsTable = $("#achatsTable");
            $achatsTable.empty();
            data.achats.forEach(achat => {
                $achatsTable.append(`
                    <tr>
                        <td>${achat.id_vehicule}</td>
                        <td>${achat.categorie}</td>
                        <td>${achat.marque}</td>
                        <td>${achat.model}</td>
                        <td>${achat.quantite}</td>
                        <td>${achat.prix_total} €</td>
                    </tr>
                `);
            });
        },
        error: function (error) {
            console.error("Erreur AJAX :", error);
        }
    });
}

function chargerFactureTable() {
    $.getJSON("http://localhost/Gestion_Vente/php/gestion/facture.php?action=getFactureTable", function (data) {
        let $facturesTable = $("#facturesTable");
        $facturesTable.empty();

        if (data.error) {
            $facturesTable.html(`<tr><td colspan="8">${data.error}</td></tr>`);
            return;
        }

        data.factures.forEach(facture => {
            $facturesTable.append(`
                <tr>
                    <td>${facture.id_facture}</td>
                    <td>${facture.id_client}</td>
                    <td>${facture.id_employe}</td>
                    <td>${facture.date_facturation}</td>
                    <td>${facture.mode_paiement}</td>
                    <td>${facture.montant_total} €</td>
                    <td>${facture.etat_facture}</td>
                    <td>
                        <button class="update" onclick="remplirFormulaireModification(${facture.id_facture}, ${facture.id_client}, ${facture.id_employe}, '${facture.date_facturation}', '${facture.mode_paiement}', ${facture.montant_total}, '${facture.etat_facture}')">Modifier</button>
                    </td>
                </tr>
            `);
        });
    }).fail(function (error) {
        console.error("Erreur AJAX :", error);
    });
}

function chargerModesPaiement() {
    let $selectMode = $("#mode_payement_update_selected");
    $selectMode.html("<option value=''>Sélectionner un mode</option>");

    let modes = ["Especes", "Carte bancaire", "Cheque"];
    modes.forEach(mode => {
        $selectMode.append(`<option value="${mode}">${mode}</option>`);
    });
}

function chargerEtatFacture() {
    let $selectEtat = $("#etat_update_selected");
    $selectEtat.html("<option value=''>Sélectionner un état</option>");

    let etats = ["EN ATTENTE", "PAYEE"];
    etats.forEach(etat => {
        $selectEtat.append(`<option value="${etat}">${etat}</option>`);
    });
}

function remplirFormulaireModification(id_facture, id_client, id_employe, date_facturation, mode_paiement, montant_total, etat_facture) {
    $("#id_facture_update").val(id_facture || "");
    $("#id_client_update").val(id_client || "");
    $("#id_employe_update").val(id_employe || "");
    $("#date_update").val(date_facturation || "");
    $("#montant_total").val(montant_total || "");

    let $selectModePaiement = $("#mode_payement_update_selected");
    if (mode_paiement && $selectModePaiement.find(`option[value="${mode_paiement}"]`).length) {
        $selectModePaiement.val(mode_paiement);
    } else {
        alert(`Mode de paiement introuvable : ${mode_paiement}`);
        $selectModePaiement.val("");
    }

    let $selectEtatFacture = $("#etat_update_selected");
    if (etat_facture && $selectEtatFacture.find(`option[value="${etat_facture}"]`).length) {
        $selectEtatFacture.val(etat_facture);
    } else {
        alert(`État de facture introuvable : ${etat_facture}`);
        $selectEtatFacture.val("");
    }
}

function reinitialiserFormulaireModification() {
    $("#id_facture_update, #id_client_update, #id_employe_update, #date_update, #montant_total").val("");
    $("#mode_payement_update_selected, #etat_update_selected").prop("selectedIndex", 0);
}

$(".cancel").on("click", reinitialiserFormulaireModification);

$(".voirFichierTxt").on("click", function () {
    let id_facture = $("#id_facture_selected").val();

    if (!id_facture) {
        alert("Veuillez sélectionner une facture !");
        return;
    }

    // Générer le fichier TXT via PHP
    $.getJSON(`http://localhost/Gestion_Vente/php/gestion/facture.php?action=generateTxt&id_facture=${encodeURIComponent(id_facture)}`)
        .done(function (data) {
            console.log("Réponse du serveur :", data);

            if (data.success && data.file) {
                alert(`Fichier généré avec succès : ${data.file}`);
                verifierEtOuvrirFichier(data.file);
            } else {
                alert("Erreur lors de la génération du fichier.");
            }
        })
        .fail(function (xhr, status, error) {
            console.error("Erreur AJAX :", error);
            alert("Une erreur réseau est survenue.");
        });
});

// Vérifier l'existence du fichier avant de l'ouvrir
function verifierEtOuvrirFichier(filePath) {
    $.ajax({
        url: filePath,
        type: "HEAD",
        success: function () {
            window.open(filePath, "_blank");
        },
        error: function () {
            alert("Le fichier n'existe pas ou est inaccessible !");
        }
    });
}


function telechargerFacture() {
    let id_facture = $("#id_facture_selected").val();
    if (!id_facture) {
        alert("Sélectionnez une facture avant de télécharger !");
        return;
    }

    $.getJSON(`http://localhost/Gestion_Vente/php/gestion/facture.php?action=checkFileTxt&id_facture=${id_facture}`, function (data) {
        if (data.exists) {
            telechargerFichier(id_facture);
        } else {
            alert("Le fichier n'existe pas encore. Veuillez le générer en cliquant sur 'Voir le fichier TXT' avant de le télécharger.");
        }
    }).fail(function (error) {
        console.error("Erreur lors de la vérification du fichier :", error);
        alert("Une erreur est survenue lors de la vérification du fichier.");
    });
}

function telechargerFichier(id_facture) {
    $.ajax({
        url: `http://localhost/Gestion_Vente/php/gestion/facture.php?action=download&id_facture=${id_facture}`,
        method: "GET",
        xhrFields: {
            responseType: "blob"
        },
        success: function (blob) {
            let url = window.URL.createObjectURL(blob);
            let a = $("<a>").attr({
                href: url,
                download: `Facture_${id_facture}.txt`
            }).appendTo("body");
            a[0].click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function (error) {
            console.error("Erreur lors du téléchargement de la facture :", error);
            alert("Une erreur est survenue lors du téléchargement de la facture.");
        }
    });
}

function modifierFactureParId() {
    let data = {
        id_facture: $("#id_facture_update").val(),
        id_client: $("#id_client_update").val(),
        id_employe: $("#id_employe_update").val(),
        date_facturation: $("#date_update").val(),
        mode_paiement: $("#mode_payement_update_selected").val(),
        montant_total: $("#montant_total").val(),
        etat_facture: $("#etat_update_selected").val()
    };

    if (Object.values(data).some(value => !value)) {
        alert("Veuillez remplir tous les champs avant de modifier la facture !");
        return;
    }

    $.ajax({
        url: "http://localhost/Gestion_Vente/php/gestion/facture.php?action=update",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.success) {
                alert("Facture modifiée avec succès !");
                chargerFactureTable();
                reinitialiserFormulaireModification();
            } else {
                alert("Erreur lors de la modification de la facture : " + result.message);
            }
        },
        error: function (error) {
            console.error("Erreur lors de la modification de la facture :", error);
            alert("Une erreur réseau est survenue.");
        }
    });
}

$(".update").on("click", modifierFactureParId);
