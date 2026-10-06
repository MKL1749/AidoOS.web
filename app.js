/* =====================================================
   AIDOS
   AidoOS / AidoPC
===================================================== */


/* =====================================================
   ESTADO
===================================================== *aapp.js
↓
Ctrl + A
↓
borrar
↓
pegar el nuevo
↓
Commit changes

const state = {

  windows: new Map(),

  zIndex: 50,

  windowNumber: 0,

  currentDesktop: 1,

  installations:
    JSON.parse(
      localStorage.getItem(
        "aido_installations"
      ) || "{}"
    ),

  recent: [],

  desktops: {
    1: [],
    2: [],
    3: []
  }

};


/* =====================================================
   APLICACIONES
===================================================== */

const apps = {

  settings: {
    title: "Configuración",
    icon: "⚙️",
    render: renderSettings
  },

  browser: {
    title: "Aido NavegerPRO",
    icon: "🌐",
    render: renderBrowser
  },

  store: {
    title: "AidoStore",
    icon: "🛍️",
    render: renderStore
  },

  aidoia: {
    title: "AidoIA",
    icon: "🤖",
    render: renderAidoIA
  },

  office: {
    title: "AidoOffice",
    icon: "📘",
    render: renderOffice
  },

  games: {
    title: "AidoGames",
    icon: "🎮",
    render: renderGames
  },

  music: {
    title: "AidoMusic",
    icon: "🎵",
    render: renderMusic
  },

  aidophone: {
    title: "Aidophone",
    icon: "📱",
    render: renderAidophone
  },

  update: {
    title: "Aido Update",
    icon: "🔄",
    render: renderUpdate
  },

  notes: {
    title: "Notas",
    icon: "📝",
    render: renderNotes
  },

  calculator: {
    title: "Calculadora",
    icon: "🧮",
    render: renderCalculator
  },

  files: {
    title: "Explorador",
    icon: "📁",
    render: renderFiles
  },

  paint: {
    title: "Aido Paint",
    icon: "🎨",
    render: renderPaint
  }

};


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createStartMenu();

    updateClock();

    setInterval(
      updateClock,
      1000
    );

    setupEvents();

    showToast(
      "👋 Bienvenido a AidoOS, Aldeano"
    );

  }
);


/* =====================================================
   CREAR INICIO
===================================================== */

function createStartMenu() {

  const start =
    document.getElementById(
      "startApps"
    );

  const recent =
    document.getElementById(
      "recentApps"
    );

  start.innerHTML = "";

  Object.entries(apps)
    .forEach(
      ([id, app]) => {

        const button =
          document.createElement(
            "button"
          );

        button.className =
          "app-start-button";

        button.dataset.openApp =
          id;

        button.innerHTML = `
          <span class="app-start-icon">
            ${app.icon}
          </span>

          <span class="app-start-name">
            ${app.title}
          </span>
        `;

        start.appendChild(button);

      }
    );


  recent.innerHTML = "";

  const recientes = [
    "browser",
    "aidoia",
    "store"
  ];

  recientes.forEach(
    id => {

      const app = apps[id];

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "recent-item";

      item.dataset.openApp =
        id;

      item.innerHTML = `
        <span>${app.icon}</span>

        <div>
          <strong>${app.title}</strong>
          <small>Usado recientemente</small>
        </div>
      `;

      recent.appendChild(item);

    }
  );

}


/* =====================================================
   EVENTOS
===================================================== */

function setupEvents() {

  document.addEventListener(
    "click",
    event => {

      const open =
        event.target.closest(
          "[data-open-app]"
        );

      if (open) {

        event.stopPropagation();

        openApp(
          open.dataset.openApp
        );

        return;
      }


      const closePanel =
        event.target.closest(
          "[data-close-panel]"
        );

      if (closePanel) {

        document
          .getElementById(
            closePanel.dataset.closePanel
          )
          .classList.add(
            "hidden"
          );

        return;
      }


      const windowAction =
        event.target.closest(
          "[data-window-action]"
        );

      if (windowAction) {

        event.stopPropagation();

        const id =
          windowAction
            .closest(".aido-window")
            .dataset.id;

        const action =
          windowAction.dataset.windowAction;

        if (action === "close")
          closeWindow(id);

        if (action === "minimize")
          minimizeWindow(id);

        if (action === "suspend")
          suspendWindow(id);

        return;
      }

    }
  );


  document
    .getElementById("startButton")
    .onclick = () => {

      togglePanel(
        "startMenu"
      );

    };


  document
    .getElementById("taskSearchButton")
    .onclick = () => {

      togglePanel(
        "searchPanel"
      );

      setTimeout(
        () =>
          document
            .getElementById(
              "systemSearch"
            )
            .focus(),
        50
      );

    };


  document
    .getElementById("widgetsButton")
    .onclick = () =>
      togglePanel("widgetPanel");


  document
    .getElementById("networkButton")
    .onclick = () =>
      togglePanel("quickPanel");


  document
    .getElementById("volumeButton")
    .onclick = () =>
      togglePanel("quickPanel");


  document
    .getElementById("batteryButton")
    .onclick = () =>
      togglePanel("quickPanel");


  document
    .getElementById("desktopButton")
    .onclick = () =>
      togglePanel("desktopSwitcher");


  document
    .getElementById("clockButton")
    .onclick = () =>
      togglePanel("notificationPanel");


  document
    .getElementById("systemSearch")
    .addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          doSystemSearch(
            event.target.value
          );

        }

      }
    );


  document
    .getElementById("startSearch")
    .addEventListener(
      "input",
      filterStartApps
    );


  document
    .getElementById("showAllApps")
    .onclick = () => {

      document
        .getElementById(
          "startApps"
        )
        .scrollTop = 0;

    };


  document
    .getElementById("powerButton")
    .onclick = () => {

      showToast(
        "AidoPC no se puede apagar desde JSFiddle 😄"
      );

    };


  document
    .querySelectorAll(
      ".quick-toggle"
    )
    .forEach(
      button => {

        button.onclick = () => {

          button.classList.toggle(
            "active"
          );

        };

      }
    );


  document
    .querySelectorAll(
      "[data-desktop]"
    )
    .forEach(
      button => {

        button.onclick = () => {

          switchDesktop(
            Number(
              button.dataset.desktop
            )
          );

        };

      }
    );

}


/* =====================================================
   ABRIR APP
===================================================== */

function openApp(appId) {

  const app = apps[appId];

  if (!app) return;


  // Si ya está abierta, solo la enfocamos

  for (
    const [id, data]
    of state.windows
  ) {

    if (data.appId === appId) {

      restoreWindow(id);

      focusWindow(
        data.element
      );

      closeAllPanels();

      return;
    }

  }


  state.windowNumber++;

  const id =
    appId +
    "-" +
    state.windowNumber;


  const win =
    document.createElement(
      "div"
    );

  win.className =
    "aido-window";

  win.dataset.id = id;

  win.dataset.appId = appId;

  win.style.left =
    (
      80 +
      ((state.windowNumber * 35) % 250)
    ) + "px";

  win.style.top =
    (
      45 +
      ((state.windowNumber * 25) % 150)
    ) + "px";


  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">

        <span class="window-title-icon">
          ${app.icon}
        </span>

        <span>
          ${app.title}
        </span>

      </div>

      <div class="window-controls">

        <button
          class="window-control"
          data-window-action="minimize"
          title="Minimizar"
        >
          ─
        </button>

        <button
          class="window-control"
          data-window-action="suspend"
          title="Suspender"
        >
          ⏸
        </button>

        <button
          class="window-control close"
          data-window-action="close"
          title="Cerrar"
        >
          ×
        </button>

      </div>

    </div>

    <div class="window-content"></div>

    <div class="suspended-screen">

      <span style="font-size:35px">⏸</span>

      <strong>Aplicación suspendida</strong>

      <small>
        Pulsa la pestaña para reanudarla
      </small>

    </div>

  `;


  const content =
    win.querySelector(
      ".window-content"
    );

  content.innerHTML =
    app.render();


  document
    .getElementById(
      "windowLayer"
    )
    .appendChild(win);


  state.windows.set(
    id,
    {
      appId,
      element: win,
      minimized: false,
      suspended: false,
      desktop:
        state.currentDesktop
    }
  );


  state.desktops[
    state.currentDesktop
  ].push(id);


  makeDraggable(win);

  focusWindow(win);

  addRecent(appId);

  createTaskTab(
    id,
    app
  );

  closeAllPanels();


  if (appId === "games") {

    setTimeout(
      setupGames,
      100
    );

  }

}


/* =====================================================
   CERRAR
===================================================== */

function closeWindow(id) {

  const data =
    state.windows.get(id);

  if (!data) return;


  data.element.remove();

  state.windows.delete(id);


  Object.keys(
    state.desktops
  ).forEach(
    desktop => {

      state.desktops[desktop] =
        state.desktops[desktop]
          .filter(
            x => x !== id
          );

    }
  );


  const tab =
    document.querySelector(
      `.task-tab[data-id="${id}"]`
    );

  if (tab)
    tab.remove();

}


/* =====================================================
   MINIMIZAR
===================================================== */

function minimizeWindow(id) {

  const data =
    state.windows.get(id);

  if (!data) return;

  data.minimized = true;

  data.element.style.display =
    "none";

}


/* =====================================================
   RESTAURAR
===================================================== */

function restoreWindow(id) {

  const data =
    state.windows.get(id);

  if (!data) return;

  data.minimized = false;

  data.element.style.display =
    "flex";

  data.element.classList.remove(
    "suspended"
  );

  data.suspended = false;

  focusWindow(
    data.element
  );

}


/* =====================================================
   SUSPENDER
===================================================== */

function suspendWindow(id) {

  const data =
    state.windows.get(id);

  if (!data) return;

  data.suspended =
    !data.suspended;

  data.element.classList.toggle(
    "suspended",
    data.suspended
  );

}


/* =====================================================
   FOCO
===================================================== */

function focusWindow(win) {

  state.zIndex++;

  win.style.zIndex =
    state.zIndex;


  document
    .querySelectorAll(
      ".task-tab"
    )
    .forEach(
      tab =>
        tab.classList.remove(
          "active"
        )
    );


  const tab =
    document.querySelector(
      `.task-tab[data-id="${win.dataset.id}"]`
    );

  if (tab)
    tab.classList.add(
      "active"
    );

}


/* =====================================================
   PESTAÑAS
===================================================== */

function createTaskTab(
  id,
  app
) {

  const tab =
    document.createElement(
      "div"
    );

  tab.className =
    "task-tab";

  tab.dataset.id =
    id;

  tab.innerHTML = `

    <span>
      ${app.icon}
    </span>

    <span>
      ${app.title}
    </span>

    <button
      class="task-tab-close"
      title="Cerrar"
    >
      ×
    </button>

  `;


  tab.addEventListener(
    "click",
    event => {

      const data =
        state.windows.get(id);

      if (!data) return;


      if (
        event.target
          .classList
          .contains(
            "task-tab-close"
          )
      ) {

        event.stopPropagation();

        closeWindow(id);

        return;
      }


      if (data.minimized) {

        restoreWindow(id);

      } else {

        data.element.style.display =
          "flex";

        focusWindow(
          data.element
        );

      }

      if (data.suspended) {

        data.suspended = false;

        data.element
          .classList
          .remove(
            "suspended"
          );

      }

    }
  );


  document
    .getElementById(
      "taskTabs"
    )
    .appendChild(tab);

}


/* =====================================================
   ARRASTRAR VENTANAS
===================================================== */

function makeDraggable(win) {

  const header =
    win.querySelector(
      ".window-header"
    );

  let dragging = false;

  let offsetX = 0;

  let offsetY = 0;


  header.addEventListener(
    "mousedown",
    event => {

      if (
        event.target.closest(
          "button"
        )
      ) return;


      dragging = true;

      offsetX =
        event.clientX -
        win.offsetLeft;

      offsetY =
        event.clientY -
        win.offsetTop;

      focusWindow(win);

    }
  );


  document.addEventListener(
    "mousemove",
    event => {

      if (!dragging) return;

      let x =
        event.clientX -
        offsetX;

      let y =
        event.clientY -
        offsetY;


      x =
        Math.max(
          0,
          Math.min(
            window.innerWidth -
            win.offsetWidth,
            x
          )
        );

      y =
        Math.max(
          0,
          Math.min(
            window.innerHeight -
            90,
            y
          )
        );


      win.style.left =
        x + "px";

      win.style.top =
        y + "px";

    }
  );


  document.addEventListener(
    "mouseup",
    () => {
      dragging = false;
    }
  );

}


/* =====================================================
   PANEL
===================================================== */

function togglePanel(id) {

  const panel =
    document.getElementById(id);

  const wasHidden =
    panel.classList.contains(
      "hidden"
    );

  closeAllPanels();

  if (wasHidden)
    panel.classList.remove(
      "hidden"
    );

}


function closeAllPanels() {

  [
    "startMenu",
    "searchPanel",
    "widgetPanel",
    "quickPanel",
    "notificationPanel",
    "desktopSwitcher"
  ].forEach(
    id => {

      document
        .getElementById(id)
        .classList.add(
          "hidden"
        );

    }
  );

}


/* =====================================================
   RELOJ
===================================================== */

function updateClock() {

  const now =
    new Date();

  const time =
    now.toLocaleTimeString(
      "es-MX",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  const date =
    now.toLocaleDateString(
      "es-MX"
    );


  document
    .getElementById(
      "taskClock"
    )
    .textContent =
    time;

  document
    .getElementById(
      "taskDate"
    )
    .textContent =
    date;


  document
    .getElementById(
      "desktopClock"
    )
    .textContent =
    time;


  document
    .getElementById(
      "desktopDate"
    )
    .textContent =
    "AidoPC · " + date;


  document
    .getElementById(
      "widgetClock"
    )
    .textContent =
    time;


  document
    .getElementById(
      "widgetDate"
    )
    .textContent =
    date;

}


/* =====================================================
   BÚSQUEDA
===================================================== */

function doSystemSearch(query) {

  const result =
    document.getElementById(
      "searchResult"
    );

  const q =
    query.toLowerCase().trim();


  if (!q) {

    result.innerHTML =
      "💡 Escribe algo para buscar.";

    return;

  }


  const found =
    Object.entries(apps)
      .find(
        ([id, app]) =>
          app.title
            .toLowerCase()
            .includes(q)
      );


  if (found) {

    const [
      id,
      app
    ] = found;

    result.innerHTML = `
      <div>
        <strong>
          ${app.icon}
          ${app.title}
        </strong>

        <br><br>

        <button
          class="settings-card"
          onclick="openApp('${id}')"
        >
          Abrir
        </button>
      </div>
    `;

    return;

  }


  const datos = [

    "Los pulpos tienen tres corazones. 🐙",

    "La luz del Sol tarda unos 8 minutos en llegar a la Tierra. ☀️",

    "Venus gira en dirección contraria a la mayoría de planetas. 🪐",

    "Los tiburones existen desde antes que los árboles. 🦈",

    "Algunas estrellas que vemos ya no están en la misma fase que cuando su luz salió de ellas. ✨"

  ];


  result.innerHTML = `

    <strong>💡 Dato curioso</strong>

    <p>
      ${
        datos[
          Math.floor(
            Math.random() *
            datos.length
          )
        ]
      }
    </p>

  `;

}


/* =====================================================
   FILTRO INICIO
===================================================== */

function filterStartApps(event) {

  const q =
    event.target.value
      .toLowerCase();

  document
    .querySelectorAll(
      ".app-start-button"
    )
    .forEach(
      button => {

        button.style.display =
          button
            .textContent
            .toLowerCase()
            .includes(q)
              ? "flex"
              : "none";

      }
    );

}


/* =====================================================
   RECIENTES
===================================================== */

function addRecent(appId) {

  state.recent =
    [
      appId,
      ...state.recent
        .filter(
          x => x !== appId
        )
    ]
    .slice(0,5);

}


/* =====================================================
   AIDOIA
===================================================== */

function renderAidoIA() {

  return `

    <div class="aidoia">

      <div class="aidoia-header">

        <div class="aidoia-logo">
          🤖
        </div>

        <div>

          <strong>AidoIA</strong>

          <div class="aidoia-status">
            Asistente de AidoOS · v0.1
          </div>

        </div>

      </div>


      <div
        class="aidoia-messages"
        id="aidoiaMessages"
      >

        <div class="ai-message">

          ¡Qué onda, <b>Aldeano</b>! 👋

          <br><br>

          Soy AidoIA.

          Puedes hablar conmigo normalmente
          o pedirme cosas de AidoOS.

          <br><br>

          Por ejemplo:

          <br>

          <b>“abre configuración”</b>

          <br>

          <b>“dime un dato curioso”</b>

          <br>

          <b>“¿cuánto almacenamiento tengo?”</b>

        </div>

      </div>


      <div class="aidoia-input">

        <input
          id="aidoiaInput"
          placeholder="Habla con AidoIA..."
        >

        <button
          onclick="sendAidoIA()"
        >
          Enviar
        </button>

      </div>

    </div>

  `;

}


function sendAidoIA() {

  const input =
    document.getElementById(
      "aidoiaInput"
    );

  const messages =
    document.getElementById(
      "aidoiaMessages"
    );

  if (!input || !messages)
    return;


  const text =
    input.value.trim();

  if (!text)
    return;


  addMessage(
    messages,
    text,
    "user-message"
  );

  input.value = "";


  setTimeout(
    () => {

      const response =
        AidoAIResponse(text);

      addMessage(
        messages,
        response,
        "ai-message"
      );

    },
    450
  );

}


function addMessage(
  container,
  text,
  className
) {

  const div =
    document.createElement(
      "div"
    );

  div.className =
    className;

  div.textContent =
    text;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

}


function AidoAIResponse(text) {

  const t =
    text
      .toLowerCase()
      .trim();


  if (
    t.includes(
      "abre configuración"
    ) ||
    t.includes(
      "abre configuracion"
    )
  ) {

    openApp("settings");

    return "Claro. Abriendo Configuración. ⚙️";

  }


  if (
    t.includes("abre tienda") ||
    t.includes("aidostore")
  ) {

    openApp("store");

    return "Voy a abrir AidoStore. 🛍️";

  }


  if (
    t.includes("abre navegador") ||
    t.includes("navegador")
  ) {

    openApp("browser");

    return "Listo. Abriendo Aido NavegerPRO. 🌐";

  }


  if (
    t.includes("abre juegos") ||
    t.includes("abrir juegos")
  ) {

    openApp("games");

    return "Abriendo AidoGames. 🎮";

  }


  if (
    t.includes("abre office") ||
    t.includes("aidooffice")
  ) {

    openApp("office");

    return "Abriendo AidoOffice. 📘";

  }


  if (
    t.includes("aidophone") ||
    t.includes("teléfono") ||
    t.includes("telefono")
  ) {

    openApp("aidophone");

    return "Abriendo la conexión con Aidophone. 📱";

  }


  if (
    t.includes("actualiza") ||
    t.includes("update")
  ) {

    openApp("update");

    return "Abriendo Aido Update. 🔄";

  }


  if (
    t.includes("almacenamiento") ||
    t.includes("espacio")
  ) {

    return "Tu AidoPC tiene configurado 1 TB de almacenamiento. 💾";

  }


  if (
    t.includes("hola") ||
    t.includes("hey") ||
    t.includes("buenas")
  ) {

    return random([

      "¡Qué onda, Aldeano! 😎",

      "¡Buenas! AidoIA está lista.",

      "¡Hey! ¿Qué hacemos hoy?",

      "¡Hola! Todo funcionando por aquí. 🤖"

    ]);

  }


  if (
    t.includes("quién eres") ||
    t.includes("quien eres")
  ) {

    return "Soy AidoIA, el asistente integrado de AidoOS. Mi objetivo es ayudarte a usar el sistema de una manera natural.";

  }


  if (
    t.includes("qué puedes hacer") ||
    t.includes("que puedes hacer")
  ) {

    return "Puedo conversar contigo, abrir aplicaciones, darte datos curiosos, ayudarte con AidoOS y controlar funciones que vayamos incorporando.";

  }


  if (
    t.includes("dato curioso") ||
    t.includes("dato")
  ) {

    return random([

      "Los pulpos tienen tres corazones. 🐙",

      "La luz del Sol tarda unos 8 minutos y 20 segundos en llegar a la Tierra. ☀️",

      "Los tiburones existen desde antes que los árboles. 🦈",

      "Un día en Venus dura más que su año. 🪐",

      "Los relámpagos pueden calentar el aire a temperaturas enormes durante un instante. ⚡"

    ]);

  }


  if (
    t.includes("gracias")
  ) {

    return random([

      "¡De nada, Aldeano! 😎",

      "Para eso estoy.",

      "¡Cuando quieras!"

    ]);

  }


  return random([

    "Entiendo. Cuéntame un poco más.",

    "Buena pregunta. Esa función todavía está creciendo en AidoIA.",

    "Interesante. Podemos añadir esa capacidad a AidoOS.",

    "Te sigo. ¿Quieres que lo hagamos desde AidoOS?",

    "Todavía estoy aprendiendo esa parte, pero podemos construirla."

  ]);

}


function random(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


/* =====================================================
   AIDOSTORE
===================================================== */

const storeApps = [

  {
    id: "aido-games",
    name: "AidoGames",
    icon: "🎮",
    category: "Juegos",
    size: "245 MB",
    description: "Centro de juegos de AidoOS."
  },

  {
    id: "aido-music",
    name: "AidoMusic",
    icon: "🎵",
    category: "Música",
    size: "85 MB",
    description: "Escucha tu propia música."
  },

  {
    id: "aido-office",
    name: "AidoOffice",
    icon: "📘",
    category: "Trabajo",
    size: "380 MB",
    description: "Documentos, hojas y presentaciones."
  },

  {
    id: "aido-paint",
    name: "Aido Paint",
    icon: "🎨",
    category: "Herramientas",
    size: "72 MB",
    description: "Dibuja y crea imágenes."
  },

  {
    id: "aido-notes",
    name: "Notas",
    icon: "📝",
    category: "Trabajo",
    size: "18 MB",
    description: "Escribe y guarda notas."
  },

  {
    id: "aido-racing",
    name: "Aido Racing",
    icon: "🏎️",
    category: "Juegos",
    size: "620 MB",
    description: "Juego de carreras arcade."
  },

  {
    id: "blockworld",
    name: "BlockWorld",
    icon: "🧱",
    category: "Juegos",
    size: "410 MB",
    description: "Sandbox de construcción original."
  },

  {
    id: "aido-space",
    name: "Aido Space",
    icon: "🚀",
    category: "Juegos",
    size: "330 MB",
    description: "Explora el espacio."
  }

];


function renderStore() {

  return `

    <div
      class="app-page"
      id="storePage"
    >

      <div class="app-title">
        AidoStore
      </div>

      <div class="app-subtitle">
        Aplicaciones, juegos, música y más para AidoPC.
      </div>


      <input
        class="store-search"
        id="storeSearch"
        placeholder="Buscar apps y juegos..."
      >


      <div class="store-categories">

        <button
          class="store-category active"
          onclick="filterStore('Todos')"
        >
          Todos
        </button>

        <button
          class="store-category"
          onclick="filterStore('Juegos')"
        >
          🎮 Juegos
        </button>

        <button
          class="store-category"
          onclick="filterStore('Trabajo')"
        >
          📘 Trabajo
        </button>

        <button
          class="store-category"
          onclick="filterStore('Música')"
        >
          🎵 Música
        </button>

        <button
          class="store-category"
          onclick="filterStore('Herramientas')"
        >
          🛠️ Herramientas
        </button>

      </div>


      <div
        class="store-grid"
        id="storeGrid"
      ></div>

    </div>

  `;

}


setTimeout(
  () => {

    const search =
      document.getElementById(
        "storeSearch"
      );

    if (search) {

      search.addEventListener(
        "input",
        () => {

          renderStoreCards(
            search.value
          );

        }
      );

    }

  },
  100
);


function renderStoreCards(
  search = "",
  category = "Todos"
) {

  const grid =
    document.getElementById(
      "storeGrid"
    );

  if (!grid) return;


  const filtered =
    storeApps.filter(
      app => {

        const matchSearch =
          app.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchCategory =
          category === "Todos" ||
          app.category === category;

        return (
          matchSearch &&
          matchCategory
        );

      }
    );


  grid.innerHTML =
    filtered.map(
      app => {

        const installed =
          state.installations[
            app.id
          ];


        return `

          <div class="store-card">

            <div class="store-card-icon">
              ${app.icon}
            </div>

            <h4>
              ${app.name}
            </h4>

            <p>
              ${app.description}
              <br>
              ${app.size}
            </p>

            <button
              class="${installed ? "installed" : ""}"
              onclick="
                ${
                  installed
                    ? `openInstalledApp('${app.id}')`
                    : `installStoreApp('${app.id}')`
                }
              "
            >
              ${
                installed
                  ? "✓ Instalado · Abrir"
                  : "Instalar"
              }
            </button>

          </div>

        `;

      }
    )
    .join("");

}


function filterStore(category) {

  renderStoreCards(
    document.getElementById(
      "storeSearch"
    )?.value || "",
    category
  );

}


function installStoreApp(appId) {

  const app =
    storeApps.find(
      x => x.id === appId
    );

  if (!app) return;


  let progress = 0;


  showToast(
    `📥 Preparando ${app.name}...`
  );


  const interval =
    setInterval(
      () => {

        progress +=
          Math.floor(
            Math.random() * 13
          ) + 5;


        if (progress > 100)
          progress = 100;


        showToast(
          `📥 Descargando ${app.name} · ${progress}%`
        );


        if (progress >= 100) {

          clearInterval(
            interval
          );


          showToast(
            `⚙️ Instalando ${app.name}...`
          );


          setTimeout(
            () => {

              state.installations[
                appId
              ] = {

                name: app.name,

                size: app.size,

                path:
                  `AidoPC / Aplicaciones / AidoStore / ${app.name}`,

                installed:
                  new Date()
                    .toLocaleString(
                      "es-MX"
                    )

              };


              localStorage.setItem(
                "aido_installations",
                JSON.stringify(
                  state.installations
                )
              );


              addNotification(
                "AidoStore",
                `${app.name} se instaló correctamente.`
              );


              showToast(
                `✅ ${app.name} instalado`
              );


              renderStoreCards();

            },
            1300
          );

        }

      },
      350
    );

}


function openInstalledApp(
  appId
) {

  const mapping = {

    "aido-games": "games",

    "aido-music": "music",

    "aido-office": "office",

    "aido-paint": "paint",

    "aido-notes": "notes",

    "aido-racing": "games",

    "blockworld": "games",

    "aido-space": "games"

  };


  const target =
    mapping[appId];

  if (target)
    openApp(target);

}


/* =====================================================
   BROWSER
===================================================== */

function renderBrowser() {

  return `

    <div class="browser">

      <div class="browser-toolbar">

        <button
          onclick="browserHome()"
        >
          ◀
        </button>

        <button
          onclick="browserReload()"
        >
          ↻
        </button>

        <input
          class="browser-url"
          id="browserUrl"
          value="https://example.com"
        >

        <button
          onclick="browserGo()"
        >
          →
        </button>

        <button
          onclick="browserExternal()"
        >
          ↗
        </button>

      </div>


      <div class="browser-info">
        Aido NavegerPRO · Usa la conexión de tu navegador.
        Algunas páginas bloquean la visualización dentro de otra web.
      </div>


      <iframe
        class="browser-frame"
        id="browserFrame"
        src="https://example.com"
        title="Aido NavegerPRO"
      ></iframe>

    </div>

  `;

}


function browserGo() {

  const input =
    document.getElementById(
      "browserUrl"
    );

  const frame =
    document.getElementById(
      "browserFrame"
    );

  if (!input || !frame)
    return;


  let url =
    input.value.trim();


  if (!url)
    return;


  if (
    !url.startsWith(
      "http://"
    ) &&
    !url.startsWith(
      "https://"
    )
  ) {

    if (
      url.includes(".")
    ) {

      url =
        "https://" +
        url;

    } else {

      url =
        "https://www.google.com/search?q=" +
        encodeURIComponent(
          url
        );

    }

  }


  input.value = url;

  frame.src = url;

}


function browserExternal() {

  const input =
    document.getElementById(
      "browserUrl"
    );

  if (!input) return;

  let url =
    input.value.trim();

  if (
    !url.startsWith(
      "http"
    )
  ) {

    url =
      "https://" +
      url;

  }

  window.open(
    url,
    "_blank"
  );

}


function browserHome() {

  const input =
    document.getElementById(
      "browserUrl"
    );

  const frame =
    document.getElementById(
      "browserFrame"
    );

  if (!input || !frame)
    return;

  input.value =
    "https://example.com";

  frame.src =
    "https://example.com";

}


function browserReload() {

  const frame =
    document.getElementById(
      "browserFrame"
    );

  if (frame)
    frame.src =
      frame.src;

}


/* =====================================================
   SETTINGS
===================================================== */

const settingsSections = [

  ["inicio", "🏠", "Inicio"],

  ["sistema", "💻", "Sistema"],

  ["bluetooth", "🔵", "Bluetooth y dispositivos"],

  ["red", "📶", "Red e Internet"],

  ["personalizacion", "🎨", "Personalización"],

  ["apps", "📦", "Aplicaciones"],

  ["cuentas", "👤", "Cuentas"],

  ["hora", "🕒", "Hora e idioma"],

  ["juegos", "🎮", "Juegos"],

  ["accesibilidad", "♿", "Accesibilidad"],

  ["privacidad", "🔐", "Privacidad y seguridad"],

  ["actualizaciones", "🔄", "Aido Update"],

  ["aidophone", "📱", "Aidophone"],

  ["ia", "🤖", "AidoIA"]

];


function renderSettings() {

  return `

    <div class="settings-layout">

      <aside class="settings-sidebar">

        ${settingsSections
          .map(
            (
              [id, icon, name],
              index
            ) => `

              <button
                class="settings-nav ${index === 0 ? "active" : ""}"
                onclick="changeSettings('${id}', this)"
              >
                ${icon}
                ${name}
              </button>

            `
          )
          .join("")}

      </aside>


      <main
        class="settings-content"
        id="settingsContent"
      >

        ${settingsContent("inicio")}

      </main>

    </div>

  `;

}


function changeSettings(
  id,
  button
) {

  document
    .querySelectorAll(
      ".settings-nav"
    )
    .forEach(
      x =>
        x.classList.remove(
          "active"
        )
    );


  button.classList.add(
    "active"
  );


  document
    .getElementById(
      "settingsContent"
    )
    .innerHTML =
    settingsContent(id);

}


function settingsContent(
  id
) {

  const data = {

    inicio: {

      title: "Inicio",

      text:
        "Personaliza la experiencia inicial de AidoOS.",

      cards: [
        "Aplicaciones ancladas",
        "Widgets",
        "Búsqueda",
        "Recomendaciones"
      ]

    },

    sistema: {

      title: "Sistema",

      text:
        "Información de tu AidoPC.",

      cards: [
        "AidoPC",
        "Procesador: Detectando",
        "Memoria: Detectando",
        "Almacenamiento: 1 TB",
        "Sistema: AidoOS"
      ]

    },

    bluetooth: {

      title:
        "Bluetooth y dispositivos",

      text:
        "Administra dispositivos conectados.",

      cards: [
        "Bluetooth",
        "Aidophone",
        "Mouse",
        "Teclado",
        "Audio"
      ]

    },

    red: {

      title:
        "Red e Internet",

      text:
        "Conexión del dispositivo.",

      cards: [
        "Wi-Fi: Conectado",
        "Internet: Disponible",
        "VPN",
        "Uso de datos"
      ]

    },

    personalizacion: {

      title:
        "Personalización",

      text:
        "Haz que AidoOS se vea como tú quieras.",

      cards: [
        "Fondo de pantalla",
        "Colores",
        "Modo oscuro",
        "Transparencia",
        "Animaciones",
        "Fuente",
        "Barra de tareas",
        "Widgets"
      ]

    },

    apps: {

      title:
        "Aplicaciones",

      text:
        "Administra tus aplicaciones instaladas.",

      cards: [
        "Aplicaciones instaladas",
        "Aplicaciones predeterminadas",
        "AidoStore",
        "Permisos",
        "Desinstalación"
      ]

    },

    cuentas: {

      title:
        "Cuentas",

      text:
        "Tu cuenta de AidoPC.",

      cards: [
        "Aldeano",
        "Perfil",
        "Inicio de sesión",
        "Sincronización"
      ]

    },

    hora: {

      title:
        "Hora e idioma",

      text:
        "Configura fecha, hora e idioma.",

      cards: [
        "Fecha y hora",
        "Zona horaria",
        "Idioma: Español",
        "Formato regional"
      ]

    },

    juegos: {

      title:
        "Juegos",

      text:
        "Configuración de AidoGames.",

      cards: [
        "Modo juego",
        "Rendimiento",
        "Controladores",
        "AidoGames",
        "Grabación"
      ]

    },

    accesibilidad: {

      title:
        "Accesibilidad",

      text:
        "Haz AidoOS más cómodo de utilizar.",

      cards: [
        "Texto",
        "Contraste",
        "Cursor",
        "Subtítulos",
        "Narrador"
      ]

    },

    privacidad: {

      title:
        "Privacidad y seguridad",

      text:
        "Controla tu privacidad.",

      cards: [
        "Permisos",
        "Aplicaciones",
        "Navegador",
        "Datos de AidoOS"
      ]

    },

    actualizaciones: {

      title:
        "Aido Update",

      text:
        "Mantén AidoOS actualizado.",

      cards: [
        "Buscar actualizaciones",
        "Historial",
        "Actualizaciones automáticas"
      ]

    },

    aidophone: {

      title:
        "Aidophone",

      text:
        "Conecta tu teléfono con AidoPC.",

      cards: [
        "Conectar Aidophone",
        "Notificaciones",
        "Archivos",
        "Fotos",
        "Llamadas",
        "Mensajes"
      ]

    },

    ia: {

      title:
        "AidoIA",

      text:
        "Configura tu asistente.",

      cards: [
        "AidoIA",
        "Voz",
        "Personalidad",
        "Historial",
        "Permisos"
      ]

    }

  };


  const section =
    data[id];


  return `

    <h2>
      ${section.title}
    </h2>

    <p>
      ${section.text}
    </p>

    ${section.cards
      .map(
        card => `

          <div class="settings-card">

            <strong>
              ${card}
            </strong>

            <br>

            <small>
              Configuración de ${card.toLowerCase()}.
            </small>

            <br>

            <button
              onclick="showToast('⚙️ ${card}: función preparada para AidoOS')"
            >
              Configurar
            </button>

          </div>

        `
      )
      .join("")}

  `;

}


/* =====================================================
   OFFICE
===================================================== */

function renderOffice() {

  return `

    <div class="app-page">

      <div class="app-title">
        AidoOffice
      </div>

      <div class="app-subtitle">
        Suite de productividad de AidoOS.
      </div>


      <div class="office-grid">

        <div
          class="office-card"
          onclick="openOfficeEditor('michord')"
        >

          <div class="office-icon">
            📄
          </div>

          <h3>
            michord
          </h3>

          <small>
            Documentos
          </small>

        </div>


        <div
          class="office-card"
          onclick="openOfficeEditor('micel')"
        >

          <div class="office-icon">
            📊
          </div>

          <h3>
            micel
          </h3>

          <small>
            Hojas de cálculo
          </small>

        </div>


        <div
          class="office-card"
          onclick="openOfficeEditor('mipoint')"
        >

          <div class="office-icon">
            📽️
          </div>

          <h3>
            mipoint
          </h3>

          <small>
            Presentaciones
          </small>

        </div>


        <div
          class="office-card"
          onclick="openOfficeEditor('miaula')"
        >

          <div class="office-icon">
            📚
          </div>

          <h3>
            miaula
          </h3>

          <small>
            Notas y estudio
          </small>

        </div>

      </div>

    </div>

  `;

}


function openOfficeEditor(
  type
) {

  const names = {

    michord: "michord",

    micel: "micel",

    mipoint: "mipoint",

    miaula: "miaula"

  };


  const title =
    names[type] ||
    "AidoOffice";


  const id =
    "office-editor-" +
    Date.now();


  const win =
    document.createElement(
      "div"
    );

  win.className =
    "aido-window";

  win.dataset.id =
    id;

  win.style.left =
    "140px";

  win.style.top =
    "90px";


  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">
        📘 ${title}
      </div>

      <div class="window-controls">

        <button
          class="window-control"
          data-window-action="minimize"
        >
          ─
        </button>

        <button
          class="window-control"
          data-window-action="suspend"
        >
          ⏸
        </button>

        <button
          class="window-control close"
          data-window-action="close"
        >
          ×
        </button>

      </div>

    </div>


    <div class="editor">

      <div class="editor-toolbar">

        <button onclick="document.execCommand('bold')">
          B
        </button>

        <button onclick="document.execCommand('italic')">
          I
        </button>

        <button onclick="document.execCommand('underline')">
          U
        </button>

        <button onclick="saveEditor()">
          💾 Guardar
        </button>

      </div>

      <div
        class="editor-area"
        contenteditable="true"
      >
        <h1>${title}</h1>
        <p>Empieza a escribir aquí...</p>
      </div>

    </div>

    <div class="suspended-screen">

      ⏸

      <strong>
        Aplicación suspendida
      </strong>

    </div>

  `;


  document
    .getElementById(
      "windowLayer"
    )
    .appendChild(win);


  state.windows.set(
    id,
    {
      appId: type,
      element: win,
      minimized: false,
      suspended: false,
      desktop:
        state.currentDesktop
    }
  );


  makeDraggable(win);

  focusWindow(win);

}


/* =====================================================
   JUEGOS
===================================================== */

function renderGames() {

  return `

    <div class="app-page">

      <div class="app-title">
        AidoGames
      </div>

      <div class="app-subtitle">
        Juegos propios para AidoOS.
      </div>


      <div class="games-grid">


        <div class="game-card">

          <div class="game-image">
            🏎️
          </div>

          <h3>
            Aido Racer
          </h3>

          <p>
            Carreras arcade.
          </p>

          <button
            onclick="startRacingGame()"
          >
            Jugar
          </button>

        </div>


        <div class="game-card">

          <div class="game-image">
            🧱
          </div>

          <h3>
            BlockWorld
          </h3>

          <p>
            Construye tu propio mundo.
          </p>

          <button
            onclick="startBlockGame()"
          >
            Jugar
          </button>

        </div>


        <div class="game-card">

          <div class="game-image">
            🚀
          </div>

          <h3>
            Aido Space
          </h3>

          <p>
            Pilota una nave espacial.
          </p>

          <button
            onclick="startSpaceGame()"
          >
            Jugar
          </button>

        </div>


        <div class="game-card">

          <div class="game-image">
            🏙️
          </div>

          <h3>
            GHA 5
          </h3>

          <p>
            Demo de mundo abierto original.
          </p>

          <button
            onclick="startGHAGame()"
          >
            Jugar demo
          </button>

        </div>


      </div>

    </div>

  `;

}


function setupGames() {

  // Preparado para futuras expansiones.

}


/* =====================================================
   AIDO RACER
===================================================== */

function startRacingGame() {

  const win =
    createGameWindow(
      "🏎️ Aido Racer"
    );

  win.innerHTML = `

    <div class="game-screen">

      <div class="game-hud">
        AIDO RACER · Usa ← →
      </div>

      <canvas
        class="game-canvas"
        id="raceCanvas"
        width="600"
        height="380"
      ></canvas>

    </div>

  `;


  const canvas =
    win.querySelector(
      "#raceCanvas"
    );

  const ctx =
    canvas.getContext(
      "2d"
    );


  let carX = 280;

  let enemyY = -50;

  let score = 0;


  const keys = {};


  window.addEventListener(
    "keydown",
    e => keys[e.key] = true
  );

  window.addEventListener(
    "keyup",
    e => keys[e.key] = false
  );


  function loop() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // carretera

    ctx.fillStyle =
      "#24282d";

    ctx.fillRect(
      120,
      0,
      360,
      canvas.height
    );


    // líneas

    ctx.fillStyle =
      "#eeeeee";

    for (
      let y = 0;
      y < 400;
      y += 60
    ) {

      ctx.fillRect(
        295,
        (y + score * 2) % 400,
        10,
        30
      );

    }


    if (keys["ArrowLeft"])
      carX -= 5;

    if (keys["ArrowRight"])
      carX += 5;


    carX =
      Math.max(
        130,
        Math.min(
          430,
          carX
        )
      );


    enemyY += 4;

    if (enemyY > 400) {

      enemyY = -60;

      score++;

    }


    // enemigo

    ctx.fillStyle =
      "#e53935";

    ctx.fillRect(
      250,
      enemyY,
      55,
      80
    );


    // jugador

    ctx.fillStyle =
      "#20e59b";

    ctx.fillRect(
      carX,
      300,
      55,
      80
    );


    requestAnimationFrame(
      loop
    );

  }


  loop();

}


/* =====================================================
   JUEGO BLOQUES
===================================================== */

function startBlockGame() {

  const win =
    createGameWindow(
      "🧱 BlockWorld"
    );

  win.innerHTML = `

    <div
      class="game-screen"
      style="
        background:#75b8e8;
        display:grid;
        place-items:center;
      "
    >

      <div style="
        width:300px;
        height:220px;
        background:
          linear-gradient(
            #75b8e8 65%,
            #55a844 65%
          );
        position:relative;
        cursor:crosshair;
      " id="blockWorld">

      </div>

    </div>

  `;


  const world =
    win.querySelector(
      "#blockWorld"
    );


  world.addEventListener(
    "click",
    event => {

      const block =
        document.createElement(
          "div"
        );

      block.style.position =
        "absolute";

      block.style.left =
        (
          event.offsetX -
          15
        ) + "px";

      block.style.top =
        (
          event.offsetY -
          15
        ) + "px";

      block.style.width =
        "30px";

      block.style.height =
        "30px";

      block.style.background =
        random([
          "#8b5a2b",
          "#65a845",
          "#777",
          "#d6b34a"
        ]);

      block.style.border =
        "2px solid rgba(0,0,0,.2)";

      world.appendChild(
        block
      );

    }
  );

}


/* =====================================================
   ESPACIO
===================================================== */

function startSpaceGame() {

  const win =
    createGameWindow(
      "🚀 Aido Space"
    );

  win.innerHTML = `

    <div
      style="
        height:100%;
        background:
          radial-gradient(
            circle,
            #24315e,
            #03040a
          );
        display:grid;
        place-items:center;
        color:white;
        font-size:50px;
        cursor:pointer;
      "
      onclick="
        this.querySelector('div').textContent =
        '🚀 ¡Despegue!'
      "
    >

      <div>
        🚀
      </div>

    </div>

  `;

}


function startGHAGame() {

  const win =
    createGameWindow(
      "🏙️ GHA 5 · Demo"
    );

  win.innerHTML = `

    <div
      style="
        height:100%;
        background:
          linear-gradient(
            #66a8db 0 50%,
            #555 50%
          );
        position:relative;
        overflow:hidden;
      "
      tabindex="0"
    >

      <div style="
        position:absolute;
        bottom:25px;
        left:45%;
        font-size:45px;
      ">
        🚗
      </div>

      <div style="
        position:absolute;
        top:15px;
        left:15px;
        background:rgba(0,0,0,.5);
        padding:10px;
        border-radius:8px;
        font-size:11px;
      ">
        DEMO ORIGINAL · A / D para conducir
      </div>

    </div>

  `;

}


/* =====================================================
   CREAR VENTANA DE JUEGO
===================================================== */

function createGameWindow(
  title
) {

  state.windowNumber++;

  const id =
    "game-" +
    state.windowNumber;


  const win =
    document.createElement(
      "div"
    );

  win.className =
    "aido-window";

  win.dataset.id =
    id;

  win.style.left =
    "120px";

  win.style.top =
    "70px";

  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">
        ${title}
      </div>

      <div class="window-controls">

        <button
          class="window-control"
          data-window-action="minimize"
        >
          ─
        </button>

        <button
          class="window-control close"
          data-window-action="close"
        >
          ×
        </button>

      </div>

    </div>

    <div class="window-content"></div>

  `;


  document
    .getElementById(
      "windowLayer"
    )
    .appendChild(win);


  state.windows.set(
    id,
    {
      appId: "game",
      element: win,
      minimized: false,
      suspended: false,
      desktop:
        state.currentDesktop
    }
  );


  makeDraggable(win);

  focusWindow(win);


  return win.querySelector(
    ".window-content"
  );

}


/* =====================================================
   AIDOPHONE
===================================================== */

function renderAidophone() {

  return `

    <div class="phone-page">

      <div class="phone">

        <div class="phone-screen">

          <strong>
            Aidophone
          </strong>

          <small>
            Conexión con AidoPC
          </small>

          <div
            style="
              padding:10px;
              border-radius:10px;
              background:rgba(32,229,155,.15);
            "
          >
            🟢 AidoPC disponible
          </div>

          <button
            onclick="
              showToast('📱 Buscando Aidophone...')
            "
            style="
              padding:10px;
              border:0;
              border-radius:9px;
            "
          >
            Buscar dispositivo
          </button>

          <small>
            Funciones preparadas:
            <br><br>
            🔔 Notificaciones
            <br>
            📁 Archivos
            <br>
            🖼️ Fotos
            <br>
            🎵 Música
            <br>
            🔋 Batería
          </small>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   UPDATE
===================================================== */

function renderUpdate() {

  return `

    <div class="app-page">

      <div class="app-title">
        Aido Update
      </div>

      <div class="app-subtitle">
        AidoOS · Versión 1.0.0
      </div>


      <div class="settings-card">

        <strong>
          Estado
        </strong>

        <p>
          AidoOS está listo.
        </p>

        <button
          onclick="simulateUpdate()"
        >
          Buscar actualizaciones
        </button>

      </div>


      <div
        id="updateProgress"
        class="settings-card"
      >
        Última comprobación:
        ahora
      </div>

    </div>

  `;

}


function simulateUpdate() {

  let progress = 0;

  const box =
    document.getElementById(
      "updateProgress"
    );

  if (!box) return;


  const interval =
    setInterval(
      () => {

        progress += 10;

        box.innerHTML =
          `🔄 Buscando actualizaciones... ${progress}%`;


        if (progress >= 100) {

          clearInterval(
            interval
          );

          box.innerHTML =
            "✅ AidoOS está actualizado.";

        }

      },
      180
    );

}


/* =====================================================
   MÚSICA
===================================================== */

function renderMusic() {

  return `

    <div class="app-page">

      <div class="app-title">
        AidoMusic
      </div>

      <div class="app-subtitle">
        Tu música en AidoOS.
      </div>


      <div class="settings-card">

        <strong>
          Añadir música
        </strong>

        <p>
          Selecciona archivos de audio de tu PC.
        </p>

        <input
          type="file"
          accept="audio/*"
          multiple
          onchange="loadMusic(this)"
        >

      </div>


      <div
        class="music-list"
        id="musicList"
      >

        <div class="music-item">

          🎵

          <div>
            <strong>
              Tu biblioteca
            </strong>

            <small>
              Añade música desde tu PC.
            </small>
          </div>

        </div>

      </div>

    </div>

  `;

}


function loadMusic(
  input
) {

  const list =
    document.getElementById(
      "musicList"
    );

  if (!list) return;


  list.innerHTML = "";


  [...input.files]
    .forEach(
      file => {

        const url =
          URL.createObjectURL(
            file
          );


        const item =
          document.createElement(
            "div"
          );

        item.className =
          "music-item";


        item.innerHTML = `

          🎵

          <div style="flex:1">

            <strong>
              ${file.name}
            </strong>

            <audio
              controls
              style="width:100%;margin-top:7px"
            >
              <source
                src="${url}"
              >
            </audio>

          </div>

        `;


        list.appendChild(
          item
        );

      }
    );

}


/* =====================================================
   NOTAS
===================================================== */

function renderNotes() {

  return `

    <div class="app-page">

      <div class="app-title">
        📝 Notas
      </div>

      <textarea
        id="notesArea"
        style="
          width:100%;
          height:300px;
          margin-top:20px;
          background:#101215;
          color:white;
          border:1px solid #333;
          border-radius:12px;
          padding:15px;
          resize:none;
        "
        placeholder="Escribe aquí..."
      ></textarea>

      <button
        onclick="
          localStorage.setItem(
            'aido_notes',
            document.getElementById('notesArea').value
          );
          showToast('💾 Nota guardada');
        "
        style="
          margin-top:10px;
          padding:10px;
          border:0;
          border-radius:9px;
          background:#20e59b;
        "
      >
        Guardar
      </button>

    </div>

  `;

}


/* =====================================================
   CALCULADORA
===================================================== */

function renderCalculator() {

  return `

    <div
      class="app-page"
      style="
        max-width:300px;
        margin:auto;
      "
    >

      <div class="app-title">
        🧮 Calculadora
      </div>

      <input
        id="calcInput"
        style="
          width:100%;
          padding:15px;
          margin-top:20px;
          background:#111;
          color:white;
          border:1px solid #333;
          border-radius:10px;
        "
        placeholder="2 + 2"
      >

      <button
        onclick="calculate()"
        style="
          width:100%;
          padding:12px;
          margin-top:10px;
          border:0;
          border-radius:9px;
          background:#20e59b;
        "
      >
        Calcular
      </button>

      <div
        id="calcResult"
        class="settings-card"
      >
        Resultado
      </div>

    </div>

  `;

}


function calculate() {

  const input =
    document.getElementById(
      "calcInput"
    );

  const result =
    document.getElementById(
      "calcResult"
    );


  try {

    // Solo operaciones matemáticas simples

    const expression =
      input.value
        .replace(
          /[^0-9+\-*/().% ]/g,
          ""
        );


    result.textContent =
      Function(
        `"use strict"; return (${expression})`
      )();

  }

  catch {

    result.textContent =
      "No pude calcularlo.";

  }

}


/* =====================================================
   EXPLORADOR
===================================================== */

function renderFiles() {

  return `

    <div class="app-page">

      <div class="app-title">
        📁 Explorador
      </div>

      <div class="app-subtitle">
        AidoPC
      </div>


      <div class="settings-card">

        📁 Aplicaciones

        <br><br>

        📁 AidoGames

        <br><br>

        📁 AidoStore

        <br><br>

        📁 Documentos

        <br><br>

        📁 Música

        <br><br>

        📁 Imágenes

      </div>


      <div class="settings-card">

        💾

        <strong>
          AidoPC · 1 TB
        </strong>

        <p>
          Unidad principal
        </p>

      </div>

    </div>

  `;

}


/* =====================================================
   PAINT
===================================================== */

function renderPaint() {

  return `

    <div
      class="app-page"
      style="height:100%"
    >

      <div class="app-title">
        🎨 Aido Paint
      </div>

      <canvas
        id="paintCanvas"
        width="500"
        height="280"
        style="
          background:white;
          width:100%;
          margin-top:15px;
          border-radius:10px;
          cursor:crosshair;
        "
      ></canvas>

    </div>

  `;

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(
  text
) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    text;

  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () =>
        toast.classList.remove(
          "show"
        ),
      2500
    );

}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function addNotification(
  title,
  message
) {

  const list =
    document.getElementById(
      "notifications"
    );

  const item =
    document.createElement(
      "div"
    );

  item.className =
    "notification";

  item.innerHTML = `

    <span class="notification-icon">
      🔔
    </span>

    <div>

      <strong>
        ${title}
      </strong>

      <p>
        ${message}
      </p>

    </div>

  `;

  list.prepend(
    item
  );

}


/* =====================================================
   ESCRITORIOS VIRTUALES
===================================================== */

function switchDesktop(
  desktop
) {

  state.currentDesktop =
    desktop;


  state.windows.forEach(
    data => {

      const same =
        data.desktop ===
        desktop;


      if (same) {

        data.element.style.display =
          data.minimized
            ? "none"
            : "flex";

      } else {

        data.element.style.display =
          "none";

      }

    }
  );


  showToast(
    `🖥️ Escritorio ${desktop}`
  );


  closeAllPanels();

}


/* =====================================================
   PINTAR
===================================================== */

document.addEventListener(
  "mousedown",
  event => {

    const canvas =
      event.target;

    if (
      canvas.tagName !==
      "CANVAS" ||
      canvas.id !==
      "paintCanvas"
    )
      return;


    const ctx =
      canvas.getContext(
        "2d"
      );

    let drawing = true;


    function draw(e) {

      if (!drawing)
        return;


      const rect =
        canvas.getBoundingClientRect();


      const x =
        (e.clientX -
          rect.left) *
        canvas.width /
        rect.width;


      const y =
        (e.clientY -
          rect.top) *
        canvas.height /
        rect.height;


      ctx.fillStyle =
        "#111";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        4,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }


    canvas.addEventListener(
      "mousemove",
      draw
    );


    canvas.addEventListener(
      "mouseup",
      () => {

        drawing = false;

        canvas.removeEventListener(
          "mousemove",
          draw
        );

      },
      {
        once: true
      }
    );

  }
);


/* =====================================================
   CARGAR NOTAS
===================================================== */

setTimeout(
  () => {

    const notes =
      localStorage.getItem(
        "aido_notes"
      );

    const area =
      document.getElementById(
        "notesArea"
      );

    if (area && notes)
      area.value =
        notes;

  },
  100
);


/* =====================================================
   BRILLO
===================================================== */

const brightness =
  document.getElementById(
    "brightnessSlider"
  );

if (brightness) {

  brightness.addEventListener(
    "input",
    event => {

      const value =
        event.target.value;

      document
        .querySelector(
          ".wallpaper"
        )
        .style.filter =
        `brightness(${value}%)`;

    }
  );

}


/* =====================================================
   FIN
=========
