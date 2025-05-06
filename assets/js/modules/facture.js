document.addEventListener("DOMContentLoaded", function () {
    chargerFactureTable();
    chargerModesPaiement();
    chargerEtatFacture();

    fetch("http://localhost/Gestion_Vente/php/gestion/facture.php?action=getFactures")
        .then(response => response.json())
        .then(factures => {
            let selectFacture = document.getElementById("id_facture_selected");
            selectFacture.innerHTML = "<option value=''>Sélectionner une facture</option>";

            factures.forEach(facture => {
                selectFacture.innerHTML += `<option value="${facture.id_facture}">${facture.id_facture}</option>`;
            });

            // Charger automatiquement la première facture si disponible
            if (factures.length > 0) {
                chargerDetailsFacture(factures[0].id_facture);
            }

            selectFacture.addEventListener("change", function () {
                chargerDetailsFacture(this.value);
            });
        })
        .catch(error => console.error("Erreur lors du chargement des factures :", error));
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

            let achatsTable = $("#achatsTable");
            achatsTable.empty();
            data.achats.forEach(achat => {
                achatsTable.append(`
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
    fetch("http://localhost/Gestion_Vente/php/gestion/facture.php?action=getFactureTable")
        .then(response => response.json())
        .then(data => {
            let facturesTable = document.getElementById("facturesTable");
            facturesTable.innerHTML = "";

            if (data.error) {
                facturesTable.innerHTML = `<tr><td colspan="8">${data.error}</td></tr>`;
                return;
            }

            data.factures.forEach(facture => {
                facturesTable.innerHTML += `
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
                `;
            });
        })
        .catch(error => console.error("Erreur AJAX :", error));
}

// Appeler cette fonction au chargement de la page document.addEventListener("DOMContentLoaded", chargerFactureTable);

function chargerModesPaiement() {
    let selectMode = document.getElementById("mode_payement_update_selected");
    selectMode.innerHTML = "<option value=''>Sélectionner un mode</option>";

    let modes = ["Especes", "Carte bancaire", "Cheque"];

    modes.forEach(mode => {
        selectMode.innerHTML += `<option value="${mode}">${mode}</option>`;
    });
}

// Appeler cette fonction au chargement de la page document.addEventListener("DOMContentLoaded", chargerModesPaiement);

function chargerEtatFacture() {
    let selectEtat = document.getElementById("etat_update_selected");
    selectEtat.innerHTML = "<option value=''>Sélectionner un état</option>";

    let etats = ["EN ATTENTE", "PAYEE"];

    etats.forEach(etat => {
        selectEtat.innerHTML += `<option value="${etat}">${etat}</option>`;
    });
}

// Appeler cette fonction au chargement de la page document.addEventListener("DOMContentLoaded", chargerEtatFacture);

function remplirFormulaireModification(id_facture, id_client, id_employe, date_facturation, mode_paiement, montant_total, etat_facture) {
    // Sélection des champs du formulaire de modification
    document.getElementById("id_facture_update").value = id_facture || "";
    document.getElementById("id_client_update").value = id_client || "";
    document.getElementById("id_employe_update").value = id_employe || "";
    document.getElementById("date_update").value = date_facturation || "";
    document.getElementById("montant_total").value = montant_total || "";

    // Vérifier si le mode de paiement est valide
    let selectModePaiement = document.getElementById("mode_payement_update_selected");
    if (mode_paiement && [...selectModePaiement.options].some(option => option.value === mode_paiement)) {
        selectModePaiement.value = mode_paiement;
    } else {
        alert(`Mode de paiement introuvable : ${mode_paiement}`);
        selectModePaiement.value = ""; // Valeur par défaut si non trouvée
    }

    // Vérifier si l'état de la facture est valide
    let selectEtatFacture = document.getElementById("etat_update_selected");
    if (etat_facture && [...selectEtatFacture.options].some(option => option.value === etat_facture)) {
        selectEtatFacture.value = etat_facture;
    } else {
        alert(`État de facture introuvable : ${etat_facture}`);
        selectEtatFacture.value = ""; // Valeur par défaut si non trouvée
    }
}

function reinitialiserFormulaireModification() {
    // Réinitialisation des champs du formulaire
    document.getElementById("id_facture_update").value = "";
    document.getElementById("id_client_update").value = "";
    document.getElementById("id_employe_update").value = "";
    document.getElementById("date_update").value = "";
    document.getElementById("montant_total").value = "";

    // Réinitialisation des sélections
    document.getElementById("mode_payement_update_selected").selectedIndex = 0;
    document.getElementById("etat_update_selected").selectedIndex = 0;
}

// événement "Annuler" pour déclencher la réinitialisation
document.querySelector(".cancel").addEventListener("click", reinitialiserFormulaireModification);

// creation et ouverture fichier
document.querySelector(".voirFichierTxt").addEventListener("click", function () {
    let id_facture = document.getElementById("id_facture_selected").value;

    if (!id_facture) {
        alert("Veuillez sélectionner une facture !");
        return;
    }

    fetch(`http://localhost/Gestion_Vente/php/gestion/facture.php?action=generateTxt&id_facture=${id_facture}`)
        .then(response => response.json())
        .then(data => {
            console.log("Réponse du serveur :", data);
            if (data.success) {
                alert(`Fichier généré avec succès : ${data.file}`);

                // Vérifier si le fichier existe avant de l'ouvrir
                fetch(data.file, { method: "HEAD" })
                    .then(response => {
                        if (response.ok) {
                            window.open(data.file, "_blank"); // Ouvre le fichier TXT après sa création
                        } else {
                            alert("Le fichier n'existe pas ou est inaccessible !");
                        }
                    })
                    .catch(error => {
                        console.error("Erreur lors de la vérification du fichier :", error);
                        alert("Une erreur est survenue lors de l'accès au fichier.");
                    });
            } else {
                alert("Erreur lors de la génération du fichier.");
            }
        })
        .catch(error => {
            console.error("Erreur AJAX :", error);
            alert("Une erreur réseau est survenue.");
        });
});

function telechargerFacture() {
    let id_facture = document.getElementById("id_facture_selected").value;
    if (!id_facture) {
        alert("Sélectionnez une facture avant de télécharger !");
        return;
    }

    // Vérifier si le fichier existe
    fetch(`http://localhost/Gestion_Vente/php/gestion/facture.php?action=checkFileTxt&id_facture=${id_facture}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la vérification du fichier.");
            }
            return response.json();
        })
        .then(data => {
            if (data.exists) {
                // Si le fichier existe, le télécharger
                telechargerFichier(id_facture);
            } else {
                alert("Le fichier n'existe pas encore. Veuillez le générer en cliquant sur 'Voir le fichier TXT' avant de le télécharger.");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la vérification du fichier :", error);
            alert("Une erreur est survenue lors de la vérification du fichier.");
        });
}

function telechargerFichier(id_facture) {
    fetch(`http://localhost/Gestion_Vente/php/gestion/facture.php?action=download&id_facture=${id_facture}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement de la facture.");
            }
            return response.blob();
        })
        .then(blob => {
            // Créer un lien temporaire pour télécharger le fichier
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `Facture_${id_facture}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Erreur lors du téléchargement de la facture :", error);
            alert("Une erreur est survenue lors du téléchargement de la facture.");
        });
}

function modifierFactureParId() {
    let id_facture = document.getElementById("id_facture_update").value;
    let id_client = document.getElementById("id_client_update").value;
    let id_employe = document.getElementById("id_employe_update").value;
    let date_facturation = document.getElementById("date_update").value;
    let mode_paiement = document.getElementById("mode_payement_update_selected").value;
    let montant_total = document.getElementById("montant_total").value;
    let etat_facture = document.getElementById("etat_update_selected").value;

    if (!id_facture || !id_client || !id_employe || !date_facturation || !mode_paiement || !montant_total || !etat_facture) {
        alert("Veuillez remplir tous les champs avant de modifier la facture !");
        return;
    }

    let data = {
        id_facture,
        id_client,
        id_employe,
        date_facturation,
        mode_paiement,
        montant_total,
        etat_facture
    };

    fetch("http://localhost/Gestion_Vente/php/gestion/facture.php?action=update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Facture modifiée avec succès !");
                chargerFactureTable(); // Recharger la table des factures
                reinitialiserFormulaireModification(); // Réinitialiser le formulaire
            } else {
                alert("Erreur lors de la modification de la facture : " + result.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la modification de la facture :", error);
            alert("Une erreur réseau est survenue.");
        });
}

//document.querySelector(".update").addEventListener("click", modifierFactureParId);
$(".update").on("click", modifierFactureParId);
