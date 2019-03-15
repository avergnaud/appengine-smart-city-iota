
gcloud app deploy

runtime: nodejs
env: flex
env_variables:
  authorized_google_id: "..."
  SEED: "..."

https://console.cloud.google.com/logs/viewer?project=smart-city-iota

peut arriver :
l'id token de l'authentification Google a expiré (mauvaise gestion d'erreur pour le moment)