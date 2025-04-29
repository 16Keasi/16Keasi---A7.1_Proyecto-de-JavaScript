// Elementos del DOM
const tablero = document.getElementById("tablero");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const numPlayersSelect = document.getElementById("numPlayers");
const user1Input = document.getElementById("user1");
const user2Input = document.getElementById("user2");
const user1Name = document.getElementById("user1Name");
const user2Name = document.getElementById("user2Name");
const turnoTexto = document.getElementById("turno");
const tiempoTurnoInput = document.getElementById("tiempoTurno");
const tamanoTablero = document.getElementById("tamanoTablero");
const fxSound = new Audio("click_mp3.mp3");
const bgMusic = new Audio("musica.mp3");
bgMusic.loop = true;


// Variables de estado
let turno = 1;
let celdas = [];
let jugadores = 2;
let timer = null;
let totalCeldas = 64;

// Iniciar juego: genera el tablero, reinicia datos
function iniciarJuego() {
  jugadores = parseInt(numPlayersSelect.value);
  const size = parseInt(tamanoTablero.value);
  totalCeldas = size * size;
  tablero.style.gridTemplateColumns = `repeat(${size}, 40px)`;
  tablero.style.gridTemplateRows = `repeat(${size}, 40px)`;

  tablero.innerHTML = "";
  celdas = [];
  turno = 1;
  score1.textContent = "0";
  score2.textContent = "0";
  clearInterval(timer);

  // Reproduce o detiene música según el checkbox
if (document.getElementById("music").checked) {
  bgMusic.play();
} else {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}


   // Actualiza nombres en el marcador
  user1Name.innerHTML = `${user1Input.value || "Jugador 1"} (Azul): <span id="score1">0</span>`;
  user2Name.innerHTML = `${user2Input.value || "Jugador 2 / IA"} (Rojo): <span id="score2">0</span>`;

   // Crear celdas
  for (let i = 0; i < totalCeldas; i++) {
    const celda = document.createElement("div");
    celda.classList.add("cell");
    celda.dataset.index = i;
    celda.addEventListener("click", () => manejarTurno(i));
    tablero.appendChild(celda);
    celdas.push("");
  }

  turnoTexto.textContent = `Turno: ${user1Input.value || "Jugador 1"}`;
  iniciarTemporizador();
}

// Lógica de cada jugada
function manejarTurno(index) {
  if (document.getElementById("fxSound").checked) {
    fxSound.play();
  }
  
  if (celdas[index] !== "") return;

  const celda = tablero.children[index];
  if (turno === 1) {
    celda.classList.add("azul");
    celdas[index] = "azul";
    turno = 2;
  } else {
    celda.classList.add("rojo");
    celdas[index] = "rojo";
    turno = 1;
  }

  actualizarPuntajes();
  if (juegoTerminado()) return;

  turnoTexto.textContent = `Turno: ${turno === 1 ? user1Input.value || "Jugador 1" : user2Input.value || "Jugador 2 / IA"}`;
  iniciarTemporizador();

  // Si es IA, mueve automáticamente
  if (jugadores === 1 && turno === 2) {
    setTimeout(jugadaIA, 500);
  }
}

// Jugada de la IA: elige celda vacía al azar
function jugadaIA() {
  const vacias = celdas.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (vacias.length === 0) return;

  const eleccion = vacias[Math.floor(Math.random() * vacias.length)];
  manejarTurno(eleccion);
}

// Contar puntuaciones
function actualizarPuntajes() {
  const p1 = celdas.filter(c => c === "azul").length;
  const p2 = celdas.filter(c => c === "rojo").length;
  document.getElementById("score1").textContent = p1;
  document.getElementById("score2").textContent = p2;
}

// Detectar fin del juego
function juegoTerminado() {
  const llenas = celdas.filter(c => c !== "").length;
  if (llenas === totalCeldas) {
    clearInterval(timer);
    const p1 = celdas.filter(c => c === "azul").length;
    const p2 = celdas.filter(c => c === "rojo").length;
    let ganador = "Empate!";
    if (p1 > p2) ganador = `${user1Input.value || "Jugador 1"} gana!`;
    if (p2 > p1) ganador = `${user2Input.value || "Jugador 2 / IA"} gana!`;
    setTimeout(() => alert("Fin del juego - " + ganador), 200);
    return true;
  }
  return false;
}

// Temporizador de cada turno
function iniciarTemporizador() {
  clearInterval(timer);
  let tiempo = parseInt(tiempoTurnoInput.value);
  timer = setInterval(() => {
    tiempo--;
    turnoTexto.textContent = `Turno: ${turno === 1 ? user1Input.value || "Jugador 1" : user2Input.value || "Jugador 2 / IA"} (${tiempo}s)`;
    if (tiempo <= 0) {
      clearInterval(timer);
      if (jugadores === 1 && turno === 2) {
        jugadaIA();
      } else {
        turno = turno === 1 ? 2 : 1;
        turnoTexto.textContent = `Turno: ${turno === 1 ? user1Input.value || "Jugador 1" : user2Input.value || "Jugador 2 / IA"}`;
        iniciarTemporizador();
      }
    }
  }, 1000);
}

// Reiniciar todo
function reiniciarJuego() {
  iniciarJuego();
}

bgMusic.pause();
bgMusic.currentTime = 0;
