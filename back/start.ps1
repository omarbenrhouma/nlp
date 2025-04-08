Write-Host "🚀 Lancement du projet Flask NLP..." -ForegroundColor Cyan

# 1. Activation du venv
Write-Host "🔁 Activation de l'environnement virtuel..."
. .\venv\Scripts\Activate.ps1

# 2. Vérifie si Flask est installé dans le bon environnement
$pipList = & .\venv\Scripts\python.exe -m pip list
if ($pipList -notmatch "Flask") {
    Write-Host "📦 Installation des dépendances principales..." -ForegroundColor Yellow
    & .\venv\Scripts\python.exe -m pip install flask flask-cors pymongo PyMuPDF spacy scikit-learn
}

# 3. Téléchargement du modèle NLP si nécessaire
Write-Host "📥 Vérification du modèle spaCy..."
try {
    & .\venv\Scripts\python.exe -c "import spacy; spacy.load('en_core_web_sm')"
} catch {
    Write-Host "⬇️ Téléchargement du modèle 'en_core_web_sm'..."
    & .\venv\Scripts\python.exe -m spacy download en_core_web_sm
}

# 4. Lancement du serveur Flask
Write-Host "✅ Démarrage de l'application Flask..." -ForegroundColor Green
& .\venv\Scripts\python.exe app.py

# to run the script, use the command:
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# .\start.ps1
