#!/bin/bash
export BROWSER=firefox

# Load NVM if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd "/home/ciro/Escritorio/proyectos/app tracker de estudio" || { echo "No se pudo entrar a la carpeta"; read; exit 1; }

# If the app is already listening on port 5173, just open it
if fuser 5173/tcp >/dev/null 2>&1; then
    echo "¡La aplicación ya está ejecutándose en el puerto 5173!"
    echo "Abriendo Firefox..."
    firefox "http://localhost:5173/" &
    exit 0
fi

echo "Iniciando App Tracker de Estudio..."
npm run dev -- --open

echo "Servidor detenido. Presiona ENTER para cerrar."
read
