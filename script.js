
const comptesAutorises = [
    { identifiant: "demo", motdepasse: "france123", prenom: "Démo" },
    { identifiant: "julie", motdepasse: "bonjour2024", prenom: "Julie" },
    { identifiant: "mathieu", motdepasse: "soleil75", prenom: "Mathieu" },
    { identifiant: "emma", motdepasse: "formation!", prenom: "Emma" }
];

let tentativeConnexion = 0;
let utilisateurConnecte = null;

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("loginError");
    const boutonConnexion = document.querySelector("button[onclick='login()']");

    if (user === "" || pass === "") {
        errorBox.textContent = "Veuillez saisir vos identifiants.";
        return;
    }

    const compteTrouve = comptesAutorises.find(
        (compte) => compte.identifiant === user && compte.motdepasse === pass
    );

    if (compteTrouve) {
        utilisateurConnecte = compteTrouve.prenom;
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("formContainer").style.display = "block";
        document.getElementById("userGreeting").innerHTML = `👤 Connecté : <strong>${utilisateurConnecte}</strong>`;
        document.getElementById("welcomeMessage").innerHTML = `👋 Bonjour <strong>${utilisateurConnecte}</strong>, bienvenue sur votre espace France Travail.`;
        document.getElementById("logoutBtn").style.display = "inline-block";
    } else {
        tentativeConnexion++;
        errorBox.textContent = `Identifiant ou mot de passe incorrect. Tentative ${tentativeConnexion}/3`;

        if (tentativeConnexion >= 3) {
            errorBox.textContent = "❌ Trop de tentatives. Connexion verrouillée 30 secondes.";
            boutonConnexion.disabled = true;

            setTimeout(() => {
                boutonConnexion.disabled = false;
                tentativeConnexion = 0;
                errorBox.textContent = "";
            }, 30000);
        }
    }
}

function logout() {
    utilisateurConnecte = null;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("userGreeting").innerHTML = "";
    document.getElementById("welcomeMessage").innerHTML = "";
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("resultMessage").innerHTML = "";

    // Réinitialise les réponses du formulaire
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);

    // Revient au premier écran du formulaire
    document.querySelectorAll('.step').forEach(step => step.classList.remove("active"));
    document.querySelectorAll('.step').forEach(step => step.style.display = "none");
    document.querySelectorAll('.step')[0].classList.add("active");
    document.querySelectorAll('.step')[0].style.display = "block";
    currentStep = 0;
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").textContent = "Suivant →";
}

let currentStep = 0;
const steps = document.querySelectorAll('.step');

function changeStep(direction) {
    if (direction === 1 && !validateStep(currentStep)) {
        alert("Merci de répondre avant de continuer.");
        return;
    }

    steps[currentStep].classList.remove("active");
    steps[currentStep].style.display = "none";
    currentStep += direction;

    if (currentStep >= steps.length) {
        showResult();
        return;
    }

    steps[currentStep].classList.add("active");
    steps[currentStep].style.display = "block";

    document.getElementById("prevBtn").style.display = currentStep > 0 ? "inline-block" : "none";
    document.getElementById("nextBtn").textContent = (currentStep === steps.length - 1) ? "Valider" : "Suivant →";
}

function validateStep(step) {
    const radios = steps[step].querySelectorAll('input[type="radio"]');
    let valid = Array.from(radios).some(r => r.checked);

    // Si l'utilisateur a répondu "Oui" pour travailler, vérifier que les heures sont bien renseignées
    if (step === 0 && document.querySelector('input[name="step1"]:checked').value === "oui") {
        const heures = document.getElementById("heuresTravailles").value;
        if (!heures || heures <= 0) {
            alert("Veuillez entrer un nombre d'heures valides.");
            valid = false;
        }
    }

    return valid;
}

function showResult() {
    document.getElementById("actualisationForm").style.display = "none";
    document.getElementById("resultMessage").innerHTML =
      `✅ Actualisation de <strong>${utilisateurConnecte}</strong> terminée avec succès !<br><br><small>(simulation)</small>`;
}

function toggleHeuresField() {
    const heuresContainer = document.getElementById("heuresContainer");
    const radios = document.getElementsByName("step1");

    if (radios[0].checked) {
        heuresContainer.style.display = "block";  // Affiche le champ pour les heures
    } else {
        heuresContainer.style.display = "none";  // Masque le champ pour les heures
        document.getElementById("heuresTravailles").value = ""; // Réinitialise la valeur du champ
    }
}
