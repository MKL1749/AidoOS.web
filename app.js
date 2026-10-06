/* =====================================================
   AidoOS 0.1.0 Beta — Web Edition
   app.js limpio para AidoOS / AidoPC
===================================================== */

const state = {
  windows: new Map(),
  zIndex: 50,
  windowNumber: 0,
  currentDesktop: 1,

  installations: loadJSON("aido_installations", {}),
  installTimers: new Map(),

  recent: loadJSON("aido_recent", []),

  desktops: {
    1: [],
    2: [],
    3: []
  },

  storeCategory: "Todos"
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
   APLICACIONES DE AIDOSTORE
===================================================== */

const storeApps = [

  {
    id: "aido-games",
    name: "AidoGames",
    icon: "🎮",
    category: "Juegos",
    size: "245 MB",
    description: "Centro de juegos de AidoOS.",
    target: "games"
  },

  {
    id: "aido-music",
    name: "AidoMusic",
    icon: "🎵",
    category: "Música",
    size: "85 MB",
    description: "Reproductor musical para tu biblioteca.",
    target: "music"
  },

  {
    id: "aido-office",
    name: "AidoOffice",
    icon: "📘",
    category: "Trabajo",
    size: "380 MB",
    description: "Documentos, hojas y presentaciones.",
    target: "office"
  },

  {
    id: "aido-paint",
    name: "Aido Paint",
    icon: "🎨",
    category: "Herramientas",
    size: "72 MB",
    description: "Dibuja y crea imágenes.",
    target: "paint"
  },

  {
    id: "aido-notes",
    name: "Notas",
    icon: "📝",
    category: "Trabajo",
    size: "18 MB",
    description: "Escribe y guarda tus notas.",
    target: "notes"
  },

  {
    id: "aido-racing",
    name: "Aido Racing",
    icon: "🏎️",
    category: "Juegos",
    size: "620 MB",
    description: "Carreras arcade de Aido Games.",
    target: "games"
  },

  {
    id: "blockworld",
    name: "BlockWorld",
    icon: "🧱",
    category: "Juegos",
    size: "410 MB",
    description: "Sandbox de construcción original.",
    target: "games"
  },

  {
    id: "aido-space",
    name: "Aido Space",
    icon: "🚀",
    category: "Juegos",
    size: "330 MB",
    description: "Explora el espacio.",
    target: "games"
  },

  {
    id: "aido-weather",
    name: "Aido Weather",
    icon: "🌤️",
    category: "Herramientas",
    size: "45 MB",
    description: "Clima para tu escritorio.",
    target: "settings"
  },

  {
    id: "aido-calculator",
    name: "Calculadora",
    icon: "🧮",
    category: "Herramientas",
    size: "25 MB",
    description: "Calculadora integrada.",
    target: "calculator"
  },

  {
    id: "aido-cloud",
    name: "Aido Cloud",
    icon: "☁️",
    category: "Herramientas",
    size: "120 MB",
    description: "Espacio de trabajo en la nube.",
    target: "files"
  },

  {
    id: "aido-chat",
    name: "Aido Chat",
    icon: "💬",
    category: "Trabajo",
    size: "95 MB",
    description: "Mensajería de AidoOS.",
    target: "aidoia"
  }

];


/* =====================================================
   DATOS CURIOSOS
===================================================== */

const facts = [

  "Los pulpos tienen tres corazones.",

  "La luz del Sol tarda aproximadamente 8 minutos y 20 segundos en llegar a la Tierra.",

  "Los tiburones existen desde antes que los árboles.",

  "Un día en Venus dura más que su año.",

  "La Tierra no es una esfera perfecta: está ligeramente achatada en los polos.",

  "Saturno tiene una densidad media menor que la del agua.",

  "Algunas especies de bambú pueden crecer muy rápido en condiciones adecuadas."

];


/* =====================================================
   ARRANQUE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initAidoOS
);


function initAidoOS() {

  /*
    El usuario quiere que las apps solo estén
    en Inicio y no como accesos fijos en la barra.
  */

  removeStaticTaskbarAppShortcuts();

  buildStartMenu();

  setupGlobalEvents();

  updateClock();

  setInterval(
    updateClock,
    1000
  );

  showToast(
    "👋 Bienvenido a AidoOS, Aldeano"
  );

}


/* =====================================================
   QUITAR APPS FIJAS DE LA BARRA
===================================================== */

function removeStaticTaskbarAppShortcuts() {

  document
    .querySelectorAll(
      "#taskbar [data-open-app]"
    )
    .forEach(
      element => element.remove()
    );

}


/* =====================================================
   MENÚ INICIO
===================================================== */

function buildStartMenu() {

  const grid =
    document.getElementById(
      "startApps"
    );

  if (!grid) return;


  grid.innerHTML =
    Object.entries(
      apps
    )
    .map(
      ([id, app]) => `

        <button
          class="app-start-button"
          type="button"
          data-open-app="${id}"
        >

          <span class="app-start-icon">
            ${app.icon}
          </span>

          <span class="app-start-name">
            ${escapeHTML(app.title)}
          </span>

        </button>

      `
    )
    .join("");


  renderRecentApps();

}


function renderRecentApps() {

  const container =
    document.getElementById(
      "recentApps"
    );

  if (!container) return;


  const ids =
    state.recent.length
      ? state.recent.slice(0, 3)
      : [
          "aidoia",
          "store",
          "browser"
        ];


  container.innerHTML =
    ids
      .map(
        id => {

          const app =
            apps[id];

          if (!app) return "";


          return `

            <button
              class="recent-item"
              data-open-app="${id}"
              type="button"
            >

              <span>
                ${app.icon}
              </span>

              <div>

                <strong>
                  ${escapeHTML(app.title)}
                </strong>

                <small>
                  Usado recientemente
                </small>

              </div>

            </button>

          `;

        }
      )
      .join("");

}


function addRecent(
  appId
) {

  state.recent =
    [
      appId,

      ...state.recent
        .filter(
          id => id !== appId
        )

    ].slice(0, 6);


  saveJSON(
    "aido_recent",
    state.recent
  );


  renderRecentApps();

}


/* =====================================================
   EVENTOS GLOBALES
===================================================== */

function setupGlobalEvents() {

  document.addEventListener(
    "click",
    onDocumentClick
  );


  const startButton =
    document.getElementById(
      "startButton"
    );

  const searchButton =
    document.getElementById(
      "taskSearchButton"
    );

  const widgetsButton =
    document.getElementById(
      "widgetsButton"
    );

  const networkButton =
    document.getElementById(
      "networkButton"
    );

  const volumeButton =
    document.getElementById(
      "volumeButton"
    );

  const batteryButton =
    document.getElementById(
      "batteryButton"
    );

  const desktopButton =
    document.getElementById(
      "desktopButton"
    );

  const clockButton =
    document.getElementById(
      "clockButton"
    );

  const startSearch =
    document.getElementById(
      "startSearch"
    );

  const systemSearch =
    document.getElementById(
      "systemSearch"
    );

  const clearNotifications =
    document.getElementById(
      "clearNotifications"
    );

  const powerButton =
    document.getElementById(
      "powerButton"
    );

  const brightnessSlider =
    document.getElementById(
      "brightnessSlider"
    );


  if (startButton) {

    startButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        togglePanel(
          "startMenu"
        );

      }
    );

  }


  if (searchButton) {

    searchButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        togglePanel(
          "searchPanel"
        );


        setTimeout(
          () => {

            const input =
              document.getElementById(
                "systemSearch"
              );

            if (input) {

              input.focus();

              input.select();

            }

            showRandomFact();

          },
          50
        );

      }
    );

  }


  if (widgetsButton) {

    widgetsButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        togglePanel(
          "widgetPanel"
        );

      }
    );

  }


  [
    networkButton,
    volumeButton,
    batteryButton
  ]
  .forEach(
    button => {

      if (!button) return;


      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          togglePanel(
            "quickPanel"
          );

        }
      );

    }
  );


  if (desktopButton) {

    desktopButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        togglePanel(
          "desktopSwitcher"
        );

      }
    );

  }


  if (clockButton) {

    clockButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        togglePanel(
          "notificationPanel"
        );

      }
    );

  }


  if (startSearch) {

    startSearch.addEventListener(
      "input",
      event => {

        filterStartApps(
          event.target.value
        );

      }
    );

  }


  if (systemSearch) {

    systemSearch.addEventListener(
      "input",
      event => {

        renderSystemSearch(
          event.target.value
        );

      }
    );


    systemSearch.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          renderSystemSearch(
            event.target.value,
            true
          );

        }

      }
    );

  }


  if (clearNotifications) {

    clearNotifications.addEventListener(
      "click",
      () => {

        const list =
          document.getElementById(
            "notifications"
          );

        if (!list) return;


        list.innerHTML = `

          <div class="notification">

            <span class="notification-icon">
              ✓
            </span>

            <div>

              <strong>
                Todo limpio
              </strong>

              <p>
                No hay nuevas notificaciones.
              </p>

            </div>

          </div>

        `;

      }
    );

  }


  if (powerButton) {

    powerButton.addEventListener(
      "click",
      () => {

        showToast(
          "⏻ AidoPC no puede apagarse desde una página web."
        );

      }
    );

  }


  if (brightnessSlider) {

    brightnessSlider.addEventListener(
      "input",
      event => {

        const value =
          Number(
            event.target.value
          ) / 100;


        const wallpaper =
          document.querySelector(
            ".wallpaper"
          );


        if (wallpaper) {

          wallpaper.style.filter =
            `brightness(${Math.max(.2, value)})`;

        }

      }
    );

  }


  document
    .querySelectorAll(
      ".quick-toggle"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            button.classList.toggle(
              "active"
            );


            const small =
              button.querySelector(
                "small"
              );


            if (small) {

              small.textContent =
                button.classList.contains(
                  "active"
                )
                  ? "Activado"
                  : "Desactivado";

            }

          }
        );

      }
    );


  document
    .querySelectorAll(
      "[data-desktop]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            switchDesktop(
              Number(
                button.dataset.desktop
              )
            );

          }
        );

      }
    );

}


/* =====================================================
   CLICK GLOBAL
===================================================== */

function onDocumentClick(
  event
) {

  const open =
    event.target.closest(
      "[data-open-app]"
    );


  if (open) {

    event.preventDefault();

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

    const panel =
      document.getElementById(
        closePanel.dataset.closePanel
      );

    if (panel) {

      panel.classList.add(
        "hidden"
      );

    }

    return;

  }


  const windowAction =
    event.target.closest(
      "[data-window-action]"
    );


  if (windowAction) {

    const win =
      windowAction.closest(
        ".aido-window"
      );


    if (!win) return;


    event.preventDefault();

    event.stopPropagation();


    handleWindowAction(
      win.dataset.id,
      windowAction.dataset.windowAction
    );

  }

}


/* =====================================================
   ABRIR APP
===================================================== */

function openApp(
  appId
) {

  const app =
    apps[appId];


  if (!app) return;


  /*
    Si ya estaba abierta,
    no se duplica.
  */

  for (
    const [id, data]
    of state.windows
  ) {

    if (
      data.appId === appId
    ) {

      if (
        data.desktop !==
        state.currentDesktop
      ) {

        switchDesktop(
          data.desktop
        );

      }


      restoreWindow(
        id
      );


      focusWindow(
        data.element
      );


      closeAllPanels();


      return;

    }

  }


  const id =
    `${appId}-${++state.windowNumber}`;


  const win =
    document.createElement(
      "section"
    );


  const offset =
    (
      state.windowNumber *
      28
    ) % 180;


  win.className =
    "aido-window";


  win.dataset.id =
    id;


  win.dataset.appId =
    appId;


  win.style.left =
    `${Math.max(
      25,
      130 + offset
    )}px`;


  win.style.top =
    `${Math.max(
      25,
      65 + (offset % 100)
    )}px`;


  win.style.zIndex =
    ++state.zIndex;


  /*
    Permitir redimensionar
    la ventana con el mouse.
  */

  win.style.resize =
    "both";


  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">

        <span class="window-title-icon">
          ${app.icon}
        </span>

        <span>
          ${escapeHTML(app.title)}
        </span>

      </div>


      <div class="window-controls">

        <button
          class="window-control"
          type="button"
          data-window-action="minimize"
          title="Minimizar"
        >
          —
        </button>

        <button
          class="window-control"
          type="button"
          data-window-action="suspend"
          title="Suspender"
        >
          ⏸
        </button>

        <button
          class="window-control close"
          type="button"
          data-window-action="close"
          title="Cerrar"
        >
          ×
        </button>

      </div>

    </div>


    <div class="window-content"></div>


    <div class="suspended-screen">

      <span style="font-size:36px">
        ⏸
      </span>

      <strong>
        Aplicación suspendida
      </strong>

      <small>
        Pulsa su pestaña para reanudarla
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
    .appendChild(
      win
    );


  state.windows.set(
    id,
    {

      id,
      appId,
      element: win,

      desktop:
        state.currentDesktop,

      minimized: false,

      suspended: false

    }
  );


  state.desktops[
    state.currentDesktop
  ].push(
    id
  );


  wireApp(
    appId,
    content
  );


  setupWindowInteractions(
    win
  );


  createTaskTab(
    id,
    app
  );


  addRecent(
    appId
  );


  focusWindow(
    win
  );


  closeAllPanels();


  if (
    appId === "store"
  ) {

    setTimeout(
      () => {

        renderStoreCards();

      },
      0
    );

  }

}


/* =====================================================
   INTERACCIONES DE VENTANA
===================================================== */

function setupWindowInteractions(
  win
) {

  win.addEventListener(
    "mousedown",
    () => {

      focusWindow(
        win
      );

    }
  );


  win
    .querySelectorAll(
      ".window-control"
    )
    .forEach(
      button => {

        button.addEventListener(
          "mousedown",
          event => {

            event.stopPropagation();

          }
        );

      }
    );


  makeDraggable(
    win
  );

}


/* =====================================================
   ACCIONES DE VENTANA
===================================================== */

function handleWindowAction(
  id,
  action
) {

  if (
    action === "close"
  ) {

    closeWindow(
      id
    );

  }


  else if (
    action === "minimize"
  ) {

    minimizeWindow(
      id
    );

  }


  else if (
    action === "suspend"
  ) {

    suspendWindow(
      id
    );

  }

}


/* =====================================================
   CERRAR
===================================================== */

function closeWindow(
  id
) {

  const data =
    state.windows.get(
      id
    );


  if (!data) return;


  data.element.remove();

  state.windows.delete(
    id
  );


  Object.keys(
    state.desktops
  )
  .forEach(
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
      `.task-tab[data-id="${CSS.escape(id)}"]`
    );


  if (tab)
    tab.remove();

}


/* =====================================================
   MINIMIZAR
===================================================== */

function minimizeWindow(
  id
) {

  const data =
    state.windows.get(
      id
    );


  if (!data) return;


  data.minimized =
    true;


  data.element.style.display =
    "none";

}


/* =====================================================
   RESTAURAR
===================================================== */

function restoreWindow(
  id
) {

  const data =
    state.windows.get(
      id
    );


  if (!data) return;


  data.minimized =
    false;


  data.element.style.display =
    "flex";


  if (data.suspended) {

    data.suspended =
      false;

    data.element.classList.remove(
      "suspended"
    );

  }

}


/* =====================================================
   SUSPENDER
===================================================== */

function suspendWindow(
  id
) {

  const data =
    state.windows.get(
      id
    );


  if (!data) return;


  data.suspended =
    !data.suspended;


  data.element.classList.toggle(
    "suspended",
    data.suspended
  );


  const name =
    apps[data.appId]?.title ||
    "Aplicación";


  showToast(
    data.suspended
      ? `⏸ ${name} suspendida`
      : `▶ ${name} reanudada`
  );

}


/* =====================================================
   ENFOCAR
===================================================== */

function focusWindow(
  win
) {

  if (!win) return;


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
      `.task-tab[data-id="${CSS.escape(win.dataset.id)}"]`
    );


  if (tab) {

    tab.classList.add(
      "active"
    );

  }

}


/* =====================================================
   PESTAÑA DE APP EN LA BARRA
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
      ${escapeHTML(app.title)}
    </span>

    <button
      class="task-tab-close"
      type="button"
      title="Cerrar"
    >
      ×
    </button>

  `;


  tab.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          ".task-tab-close"
        )
      ) {

        event.stopPropagation();

        closeWindow(
          id
        );

        return;

      }


      const data =
        state.windows.get(
          id
        );


      if (!data) return;


      if (
        data.desktop !==
        state.currentDesktop
      ) {

        switchDesktop(
          data.desktop
        );

      }


      if (
        data.minimized
      ) {

        restoreWindow(
          id
        );

      }


      if (
        data.suspended
      ) {

        data.suspended =
          false;

        data.element.classList.remove(
          "suspended"
        );

      }


      data.element.style.display =
        "flex";


      focusWindow(
        data.element
      );

    }
  );


  document
    .getElementById(
      "taskTabs"
    )
    .appendChild(
      tab
    );

}


/* =====================================================
   ARRASTRAR VENTANA
===================================================== */

function makeDraggable(
  win
) {

  const header =
    win.querySelector(
      ".window-header"
    );


  let dragging =
    false;


  let offsetX =
    0;


  let offsetY =
    0;


  const onMove =
    event => {

      if (!dragging)
        return;


      if (
        win.classList.contains(
          "maximized"
        )
      )
        return;


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
            Math.min(
              120,
              win.offsetWidth
            ),
            x
          )
        );


      y =
        Math.max(
          0,
          Math.min(
            window.innerHeight -
            80,
            y
          )
        );


      win.style.left =
        `${x}px`;


      win.style.top =
        `${y}px`;

    };


  const stop =
    () => {

      dragging =
        false;


      document.removeEventListener(
        "mousemove",
        onMove
      );


      document.removeEventListener(
        "mouseup",
        stop
      );

    };


  header.addEventListener(
    "mousedown",
    event => {

      if (
        event.target.closest(
          ".window-controls"
        )
      )
        return;


      dragging =
        true;


      offsetX =
        event.clientX -
        win.offsetLeft;


      offsetY =
        event.clientY -
        win.offsetTop;


      focusWindow(
        win
      );


      document.addEventListener(
        "mousemove",
        onMove
      );


      document.addEventListener(
        "mouseup",
        stop
      );


      event.preventDefault();

    }
  );

}


/* =====================================================
   PANELES
===================================================== */

function togglePanel(
  id
) {

  const panel =
    document.getElementById(
      id
    );


  if (!panel) return;


  const wasHidden =
    panel.classList.contains(
      "hidden"
    );


  closeAllPanels();


  if (wasHidden) {

    panel.classList.remove(
      "hidden"
    );

  }

}


function closeAllPanels() {

  [
    "startMenu",
    "searchPanel",
    "widgetPanel",
    "quickPanel",
    "notificationPanel",
    "desktopSwitcher"

  ]
  .forEach(
    id => {

      const element =
        document.getElementById(
          id
        );


      if (element) {

        element.classList.add(
          "hidden"
        );

      }

    }
  );

}


/* =====================================================
   BUSCADOR
===================================================== */

function showRandomFact() {

  const box =
    document.getElementById(
      "searchResult"
    );


  if (!box) return;


  box.innerHTML = `

    <div class="search-hint">

      <strong>
        🧠 Dato curioso
      </strong>

      <p>
        ${escapeHTML(
          random(
            facts
          )
        )}
      </p>

      <button
        type="button"
        class="settings-card"
        data-new-fact="true"
      >
        ✨ Otro dato
      </button>

    </div>

  `;


  const button =
    box.querySelector(
      "[data-new-fact]"
    );


  if (button) {

    button.addEventListener(
      "click",
      showRandomFact
    );

  }

}


function renderSystemSearch(
  query,
  openFirst = false
) {

  const result =
    document.getElementById(
      "searchResult"
    );


  if (!result) return;


  const q =
    String(
      query || ""
    )
    .trim()
    .toLowerCase();


  if (!q) {

    showRandomFact();

    return;

  }


  const matches =
    Object.entries(
      apps
    )
    .filter(
      ([id, app]) =>

        app.title
          .toLowerCase()
          .includes(q)

        ||

        id
          .toLowerCase()
          .includes(q)

    );


  if (matches.length) {

    result.innerHTML =
      matches
        .map(
          ([id, app]) => `

            <button
              type="button"
              class="recent-item"
              data-search-app="${id}"
              style="width:100%;border:0;"
            >

              <span>
                ${app.icon}
              </span>

              <div>

                <strong>
                  ${escapeHTML(app.title)}
                </strong>

                <small>
                  Aplicación
                </small>

              </div>

            </button>

          `
        )
        .join("");


    result
      .querySelectorAll(
        "[data-search-app]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              openApp(
                button.dataset.searchApp
              );

            }
          );

        }
      );


    if (openFirst) {

      openApp(
        matches[0][0]
      );

    }


    return;

  }


  result.innerHTML = `

    <div class="search-hint">

      <strong>
        🔎 No encontré esa aplicación.
      </strong>

      <p>
        ${escapeHTML(
          random(
            facts
          )
        )}
      </p>

    </div>

  `;

}


function filterStartApps(
  query
) {

  const q =
    String(
      query || ""
    ).toLowerCase();


  document
    .querySelectorAll(
      ".app-start-button"
    )
    .forEach(
      button => {

        button.style.display =
          button.textContent
            .toLowerCase()
            .includes(q)
              ? "flex"
              : "none";

      }
    );

}


/* =====================================================
   ESCRITORIOS VIRTUALES
===================================================== */

function switchDesktop(
  desktop
) {

  if (
    ![1, 2, 3].includes(
      desktop
    )
  )
    return;


  state.currentDesktop =
    desktop;


  state.windows.forEach(
    data => {

      const visible =
        data.desktop ===
        desktop;


      data.element.style.display =
        visible &&
        !data.minimized
          ? "flex"
          : "none";

    }
  );


  document
    .querySelectorAll(
      "[data-desktop]"
    )
    .forEach(
      button => {

        button.style.boxShadow =
          Number(
            button.dataset.desktop
          ) === desktop
            ? "inset 0 0 0 2px #20e59b"
            : "";

      }
    );


  closeAllPanels();


  showToast(
    `🖥️ Aido Escritorio ${desktop}`
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


  setText(
    "taskClock",
    time
  );


  setText(
    "taskDate",
    date
  );


  setText(
    "desktopClock",
    time
  );


  setText(
    "desktopDate",
    `AidoPC · ${date}`
  );


  setText(
    "widgetClock",
    time
  );


  setText(
    "widgetDate",
    date
  );

}


/* =====================================================
   NOTIFICACIONES
===================================================== */

function addNotification(
  title,
  message,
  icon = "🔔"
) {

  const list =
    document.getElementById(
      "notifications"
    );


  if (!list) return;


  const node =
    document.createElement(
      "div"
    );


  node.className =
    "notification";


  node.innerHTML = `

    <span class="notification-icon">
      ${icon}
    </span>

    <div>

      <strong>
        ${escapeHTML(title)}
      </strong>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>

  `;


  list.prepend(
    node
  );

}


/* =====================================================
   STORE
===================================================== */

function renderStore() {

  return `

    <div
      class="app-page"
      id="storePage"
    >

      <div class="app-title">
        🛍️ AidoStore
      </div>

      <div class="app-subtitle">
        Aplicaciones, juegos, música y más para AidoPC.
      </div>


      <input
        id="storeSearch"
        class="store-search"
        placeholder="🔎 Buscar aplicaciones y juegos..."
      >


      <div class="store-categories">

        ${[
          "Todos",
          "Juegos",
          "Trabajo",
          "Música",
          "Herramientas"

        ]
        .map(
          (
            category,
            index
          ) => `

            <button
              type="button"
              class="store-category ${
                index === 0
                  ? "active"
                  : ""
              }"
              data-store-category="${category}"
            >

              ${category}

            </button>

          `
        )
        .join("")}

      </div>


      <div
        id="storeGrid"
        class="store-grid"
      ></div>

    </div>

  `;

}


function wireStore(
  content
) {

  const search =
    content.querySelector(
      "#storeSearch"
    );


  if (search) {

    search.addEventListener(
      "input",
      () =>
        renderStoreCards(
          search.value
        )
    );

  }


  content
    .querySelectorAll(
      "[data-store-category]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            state.storeCategory =
              button.dataset.storeCategory;


            content
              .querySelectorAll(
                "[data-store-category]"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );


            renderStoreCards(
              search?.value || ""
            );

          }
        );

      }
    );

}


function renderStoreCards(
  search = ""
) {

  const grid =
    document.getElementById(
      "storeGrid"
    );


  if (!grid) return;


  const q =
    search
      .toLowerCase()
      .trim();


  const filtered =
    storeApps.filter(
      app => {

        const bySearch =
          !q ||

          `${app.name} ${app.description} ${app.category}`
            .toLowerCase()
            .includes(q);


        const byCategory =
          state.storeCategory ===
            "Todos" ||

          app.category ===
            state.storeCategory;


        return (
          bySearch &&
          byCategory
        );

      }
    );


  grid.innerHTML =
    filtered
      .map(
        app => {

          const install =
            state.installations[
              app.id
            ];


          let buttonText =
            "Instalar";


          if (
            install?.status ===
            "downloading"
          ) {

            buttonText =
              `Descargando ${install.progress}%`;

          }


          else if (
            install?.status ===
            "installing"
          ) {

            buttonText =
              "Instalando…";

          }


          else if (
            install?.status ===
            "installed"
          ) {

            buttonText =
              "✓ Instalado · Abrir";

          }


          return `

            <article class="store-card">

              <div class="store-card-icon">
                ${app.icon}
              </div>

              <h4>
                ${escapeHTML(app.name)}
              </h4>

              <p>
                ${escapeHTML(app.description)}
                <br>
                <strong>
                  ${escapeHTML(app.size)}
                </strong>
              </p>


              ${
                install?.status ===
                "downloading"

                ? `

                  <div style="
                    height:7px;
                    background:#2a2d31;
                    border-radius:99px;
                    overflow:hidden;
                    margin:9px 0;
                  ">

                    <div style="
                      width:${install.progress}%;
                      height:100%;
                      background:#20e59b;
                    "></div>

                  </div>

                `

                : ""
              }


              ${
                install?.status ===
                "installed"

                ? `

                  <small style="
                    display:block;
                    color:#8d959d;
                    margin-bottom:8px;
                  ">

                    📁 AidoPC /
                    Aplicaciones /
                    AidoStore /
                    ${escapeHTML(app.name)}

                  </small>

                `

                : ""
              }


              <button
                type="button"
                class="${
                  install?.status ===
                  "installed"
                    ? "installed"
                    : ""
                }"
                data-store-action="${app.id}"
              >

                ${buttonText}

              </button>

            </article>

          `;

        }
      )
      .join("");


  grid
    .querySelectorAll(
      "[data-store-action]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () =>
            handleStoreAction(
              button.dataset.storeAction
            )
        );

      }
    );

}


function handleStoreAction(
  appId
) {

  const app =
    storeApps.find(
      item =>
        item.id ===
        appId
    );


  if (!app) return;


  const existing =
    state.installations[
      appId
    ];


  if (
    existing?.status ===
    "installed"
  ) {

    openApp(
      app.target
    );

    return;

  }


  if (
    state.installTimers.has(
      appId
    )
  ) {

    return;

  }


  state.installations[
    appId
  ] = {

    status:
      "downloading",

    progress:
      0,

    name:
      app.name,

    size:
      app.size,

    path:
      `AidoPC / Aplicaciones / AidoStore / ${app.name}`

  };


  saveJSON(
    "aido_installations",
    state.installations
  );


  renderStoreCards(
    document.getElementById(
      "storeSearch"
    )?.value || ""
  );


  showToast(
    `📥 Preparando ${app.name}…`
  );


  const timer =
    setInterval(
      () => {

        const installation =
          state.installations[
            appId
          ];


        if (!installation) {

          clearInterval(
            timer
          );

          state.installTimers.delete(
            appId
          );

          return;

        }


        installation.progress =
          Math.min(
            100,
            installation.progress +
              randomInt(
                5,
                14
              )
          );


        if (
          installation.progress <
          100
        ) {

          showToast(
            `📥 Descargando ${app.name} · ${installation.progress}%`
          );


          renderStoreCards(
            document.getElementById(
              "storeSearch"
            )?.value || ""
          );


          return;

        }


        installation.status =
          "installing";


        saveJSON(
          "aido_installations",
          state.installations
        );


        renderStoreCards(
          document.getElementById(
            "storeSearch"
          )?.value || ""
        );


        showToast(
          `⚙️ Instalando ${app.name}…`
        );


        clearInterval(
          timer
        );


        state.installTimers.delete(
          appId
        );


        setTimeout(
          () => {

            installation.status =
              "installed";


            installation.installedAt =
              new Date()
                .toISOString();


            saveJSON(
              "aido_installations",
              state.installations
            );


            renderStoreCards(
              document.getElementById(
                "storeSearch"
              )?.value || ""
            );


            addNotification(
              "AidoStore",
              `${app.name} se instaló correctamente.`,
              "🛍️"
            );


            showToast(
              `✅ ${app.name} instalado`
            );

          },
          1300
        );

      },
      380
    );


  state.installTimers.set(
    appId,
    timer
  );

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

          <strong>
            AidoIA
          </strong>

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

          ¡Qué onda,
          <b>Aldeano</b>! 👋

          <br><br>

          Soy AidoIA.

          Puedes hablar conmigo
          normalmente o pedirme que
          abra cosas de AidoOS.

        </div>

      </div>


      <div class="aidoia-input">

        <input
          id="aidoiaInput"
          placeholder="Habla con AidoIA…"
        >

        <button
          id="aidoiaSend"
          type="button"
        >
          Enviar
        </button>

      </div>

    </div>

  `;

}


function wireAidoIA(
  content
) {

  const input =
    content.querySelector(
      "#aidoiaInput"
    );


  const send =
    content.querySelector(
      "#aidoiaSend"
    );


  const messages =
    content.querySelector(
      "#aidoiaMessages"
    );


  if (
    !input ||
    !send ||
    !messages
  )
    return;


  const sendMessage =
    () => {

      const text =
        input.value
          .trim();


      if (!text)
        return;


      addChatMessage(
        messages,
        text,
        "user-message"
      );


      input.value =
        "";


      const thinking =
        document.createElement(
          "div"
        );


      thinking.className =
        "ai-message ai-thinking";


      thinking.textContent =
        "AidoIA está pensando…";


      messages.appendChild(
        thinking
      );


      messages.scrollTop =
        messages.scrollHeight;


      setTimeout(
        () => {

          thinking.remove();


          const reply =
            aidoRespond(
              text
            );


          addChatMessage(
            messages,
            reply,
            "ai-message"
          );

        },
        450
      );

    };


  send.addEventListener(
    "click",
    sendMessage
  );


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        sendMessage();

      }

    }
  );

}


function addChatMessage(
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


  container.appendChild(
    div
  );


  container.scrollTop =
    container.scrollHeight;

}


function aidoRespond(
  text
) {

  const t =
    text
      .toLowerCase()
      .trim();


  /*
    COMANDOS
  */

  if (
    t.includes(
      "abre configuración"
    ) ||
    t.includes(
      "abre configuracion"
    ) ||
    t === "configuración" ||
    t === "configuracion"
  ) {

    openApp(
      "settings"
    );


    return (
      "Claro. Abriendo Configuración. ⚙️"
    );

  }


  if (
    t.includes(
      "abre aidostore"
    ) ||
    t.includes(
      "abre la tienda"
    ) ||
    t.includes(
      "abre tienda"
    )
  ) {

    openApp(
      "store"
    );


    return (
      "Voy a abrir AidoStore. 🛍️"
    );

  }


  if (
    t.includes(
      "abre navegador"
    ) ||
    t.includes(
      "abre aido navegger"
    ) ||
    t.includes(
      "navegador"
    )
  ) {

    openApp(
      "browser"
    );


    return (
      "Listo. Abriendo Aido NavegerPRO. 🌐"
    );

  }


  if (
    t.includes(
      "abre juegos"
    ) ||
    t.includes(
      "abrir juegos"
    ) ||
    t.includes(
      "aido games"
    ) ||
    t.includes(
      "aidogames"
    )
  ) {

    openApp(
      "games"
    );


    return (
      "Abriendo AidoGames. 🎮"
    );

  }


  if (
    t.includes(
      "abre office"
    ) ||
    t.includes(
      "aidooffice"
    )
  ) {

    openApp(
      "office"
    );


    return (
      "Abriendo AidoOffice. 📘"
    );

  }


  if (
    t.includes(
      "aidophone"
    ) ||
    t.includes(
      "teléfono"
    ) ||
    t.includes(
      "telefono"
    )
  ) {

    openApp(
      "aidophone"
    );


    return (
      "Abriendo la conexión con Aidophone. 📱"
    );

  }


  if (
    t.includes(
      "actualiza"
    ) ||
    t.includes(
      "aido update"
    ) ||
    t.includes(
      "update"
    )
  ) {

    openApp(
      "update"
    );


    return (
      "Abriendo Aido Update. 🔄"
    );

  }


  /*
    PREGUNTAS
  */

  if (
    t.includes(
      "almacenamiento"
    ) ||
    t.includes(
      "espacio"
    )
  ) {

    return (
      "Tu AidoPC tiene configurado 1 TB de almacenamiento. 💾"
    );

  }


  if (
    t.includes(
      "qué puedes hacer"
    ) ||
    t.includes(
      "que puedes hacer"
    )
  ) {

    return (
      "Puedo conversar contigo, abrir aplicaciones, darte datos curiosos y ayudarte a moverte por AidoOS. En la versión de PC iremos añadiendo capacidades reales."
    );

  }


  if (
    t.includes(
      "quién eres"
    ) ||
    t.includes(
      "quien eres"
    )
  ) {

    return (
      "Soy AidoIA, el asistente integrado de AidoOS. Estoy hecha para ayudarte a usar el sistema de una forma natural."
    );

  }


  /*
    CONVERSACIÓN
  */

  if (
    t.includes(
      "hola"
    ) ||
    t.includes(
      "hey"
    ) ||
    t.includes(
      "buenas"
    )
  ) {

    return random([

      "¡Qué onda, Aldeano! 😎 ¿Qué hacemos?",

      "¡Buenas! AidoIA está lista.",

      "¡Hey! Todo funcionando por aquí. 🤖",

      "¡Hola! Cuéntame qué necesitas."

    ]);

  }


  if (
    t.includes(
      "cómo estás"
    ) ||
    t.includes(
      "como estas"
    )
  ) {

    return (
      "Funcionando bien y lista para ayudarte. ⚡"
    );

  }


  if (
    t.includes(
      "dato curioso"
    ) ||
    t.includes(
      "dime un dato"
    ) ||
    t.includes(
      "curiosidad"
    )
  ) {

    return (
      random(
        facts
      ) +
      " 🧠"
    );

  }


  if (
    t.includes(
      "gracias"
    )
  ) {

    return random([

      "¡De nada, Aldeano! 😎",

      "Para eso estoy.",

      "¡Cuando quieras!"

    ]);

  }


  return random([

    "Te sigo. Cuéntame un poco más.",

    "Buena pregunta. Esa capacidad todavía está creciendo en AidoIA.",

    "Interesante. Esa función la podemos añadir a AidoOS.",

    "Entiendo. Podemos trabajar con eso desde AidoOS.",

    "No necesito un comando para hablar contigo; dime lo que tengas en mente."

  ]);

}


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const settingsSections = [

  [
    "inicio",
    "🏠",
    "Inicio"
  ],

  [
    "sistema",
    "💻",
    "Sistema"
  ],

  [
    "bluetooth",
    "🔵",
    "Bluetooth y dispositivos"
  ],

  [
    "red",
    "📶",
    "Red e Internet"
  ],

  [
    "personalizacion",
    "🎨",
    "Personalización"
  ],

  [
    "apps",
    "📦",
    "Aplicaciones"
  ],

  [
    "cuentas",
    "👤",
    "Cuentas"
  ],

  [
    "hora",
    "🕒",
    "Hora e idioma"
  ],

  [
    "juegos",
    "🎮",
    "Juegos"
  ],

  [
    "accesibilidad",
    "♿",
    "Accesibilidad"
  ],

  [
    "privacidad",
    "🔐",
    "Privacidad y seguridad"
  ],

  [
    "actualizaciones",
    "🔄",
    "Aido Update"
  ],

  [
    "aidophone",
    "📱",
    "Aidophone"
  ],

  [
    "ia",
    "🤖",
    "AidoIA"
  ],

  [
    "almacenamiento",
    "💾",
    "Almacenamiento"
  ],

  [
    "notificaciones",
    "🔔",
    "Notificaciones"
  ],

  [
    "multitarea",
    "🪟",
    "Multitarea"
  ],

  [
    "sonido",
    "🔊",
    "Sonido"
  ],

  [
    "energia",
    "⚡",
    "Energía"
  ]

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
                type="button"
                class="settings-nav ${
                  index === 0
                    ? "active"
                    : ""
                }"
                data-setting="${id}"
              >

                ${icon}
                ${escapeHTML(name)}

              </button>

            `
          )
          .join("")}

      </aside>


      <main
        class="settings-content"
        id="settingsContent"
      ></main>

    </div>

  `;

}


function wireSettings(
  content
) {

  const page =
    content.querySelector(
      "#settingsContent"
    );


  if (!page) return;


  const buttons =
    content.querySelectorAll(
      "[data-setting]"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          buttons.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          button.classList.add(
            "active"
          );


          page.innerHTML =
            settingsPage(
              button.dataset.setting
            );


          wireSettingsActions(
            page
          );

        }
      );

    }
  );


  page.innerHTML =
    settingsPage(
      "inicio"
    );


  wireSettingsActions(
    page
  );

}


function settingsPage(
  id
) {

  const section =
    settingsSections.find(
      x =>
        x[0] === id
    ) ||
    settingsSections[0];


  const title =
    section[1] +
    " " +
    section[2];


  const data = {

    inicio: [
      "Controla lo que ves primero en AidoOS.",
      [
        "Apps ancladas",
        "Widgets",
        "Recomendaciones",
        "Búsqueda"
      ]
    ],

    sistema: [
      "Información de tu AidoPC.",
      [
        "Nombre del dispositivo: AidoPC",
        "AidoOS 0.1.0 Beta",
        "Animaciones activadas",
        "Modo launcher preparado"
      ]
    ],

    bluetooth: [
      "Administra dispositivos conectados.",
      [
        "Bluetooth",
        "Aidophone",
        "Teclado",
        "Mouse",
        "Audio"
      ]
    ],

    red: [
      "Conexión de red de AidoPC.",
      [
        "Wi-Fi: Conectado",
        "Internet: Disponible",
        "VPN",
        "Uso de datos"
      ]
    ],

    personalizacion: [
      "Haz que AidoOS tenga tu estilo.",
      [
        "Fondo de pantalla",
        "Colores de énfasis",
        "Modo oscuro / claro",
        "Transparencia",
        "Animaciones",
        "Fuente pixel",
        "Barra de tareas",
        "Widgets"
      ]
    ],

    apps: [
      "Administra las apps del sistema.",
      [
        "Aplicaciones instaladas",
        "Aplicaciones predeterminadas",
        "Permisos",
        "AidoStore",
        "Desinstalación"
      ]
    ],

    cuentas: [
      "Cuenta local de AidoPC.",
      [
        "Aldeano",
        "Perfil",
        "Inicio de sesión",
        "Sincronización"
      ]
    ],

    hora: [
      "Fecha, hora e idioma.",
      [
        "Fecha y hora",
        "Zona horaria",
        "Español",
        "Formato regional"
      ]
    ],

    juegos: [
      "Opciones para AidoGames.",
      [
        "Modo juego",
        "Rendimiento",
        "Controladores",
        "Grabación"
      ]
    ],

    accesibilidad: [
      "Opciones de accesibilidad.",
      [
        "Tamaño de texto",
        "Contraste",
        "Cursor",
        "Subtítulos",
        "Narrador"
      ]
    ],

    privacidad: [
      "Control de privacidad de AidoOS.",
      [
        "Permisos",
        "Datos del navegador",
        "Apps",
        "Privacidad local"
      ]
    ],

    actualizaciones: [
      "Mantén AidoOS preparado para nuevas versiones.",
      [
        "Buscar actualizaciones",
        "Historial",
        "Actualizaciones automáticas"
      ]
    ],

    aidophone: [
      "Conecta tu teléfono con AidoPC.",
      [
        "Conectar Aidophone",
        "Notificaciones",
        "Fotos",
        "Archivos",
        "Música",
        "Portapapeles"
      ]
    ],

    ia: [
      "Configuración de AidoIA.",
      [
        "Personalidad",
        "Historial",
        "Voz",
        "Permisos",
        "Modo asistente"
      ]
    ],

    almacenamiento: [
      "Capacidad virtual de AidoPC.",
      [
        "SSD: 1 TB",
        "Usado: 258 GB",
        "Libre: 742 GB",
        "Aplicaciones",
        "Juegos"
      ]
    ],

    notificaciones: [
      "Controla las notificaciones.",
      [
        "Notificaciones activadas",
        "No molestar",
        "Centro de notificaciones"
      ]
    ],

    multitarea: [
      "Administra ventanas y escritorios.",
      [
        "Ventanas pequeñas",
        "Escritorios virtuales",
        "Ajuste de ventanas"
      ]
    ],

    sonido: [
      "Control del audio.",
      [
        "Volumen",
        "Dispositivo de salida",
        "Sonidos del sistema"
      ]
    ],

    energia: [
      "Opciones de energía.",
      [
        "Ahorro de energía",
        "Batería",
        "Suspensión"
      ]
    ]

  };


  const sectionData =
    data[id] ||
    data.inicio;


  return `

    <h2>
      ${escapeHTML(title)}
    </h2>


    <p>
      ${escapeHTML(
        sectionData[0]
      )}
    </p>


    ${sectionData[1]
      .map(
        card => `

          <div class="settings-card">

            <strong>
              ${escapeHTML(card)}
            </strong>

            <small>
              ${escapeHTML(
                settingDescription(
                  card
                )
              )}
            </small>

            <button
              type="button"
              class="setting-action"
              data-setting-action="${escapeHTML(card)}"
            >
              Configurar
            </button>

          </div>

        `
      )
      .join("")}

  `;

}


function settingDescription(
  card
) {

  if (
    card.includes(
      "1 TB"
    )
  ) {

    return (
      "Almacenamiento total de AidoPC."
    );

  }


  if (
    card.includes(
      "258 GB"
    )
  ) {

    return (
      "Espacio utilizado en la simulación."
    );

  }


  if (
    card.includes(
      "742 GB"
    )
  ) {

    return (
      "Espacio libre mostrado."
    );

  }


  if (
    card.includes(
      "Aldeano"
    )
  ) {

    return (
      "Usuario principal de AidoPC."
    );

  }


  return (
    "Opciones y controles de esta función."
  );

}


function wireSettingsActions(
  page
) {

  page
    .querySelectorAll(
      "[data-setting-action]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            showToast(
              `⚙️ ${button.dataset.settingAction} abierto`
            );

          }
        );

      }
    );

}


/* =====================================================
   OFFICE
===================================================== */

function renderOffice() {

  return `

    <div class="app-page">

      <div class="app-title">
        📘 AidoOffice
      </div>

      <div class="app-subtitle">
        Suite de productividad de AidoOS.
      </div>


      <div class="office-grid">

        <div
          class="office-card"
          data-office="michord"
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
          data-office="micel"
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
          data-office="mipoint"
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
          data-office="miaula"
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


function wireOffice(
  content
) {

  content
    .querySelectorAll(
      "[data-office]"
    )
    .forEach(
      card => {

        card.addEventListener(
          "click",
          () => {

            openOfficeEditor(
              card.dataset.office
            );

          }
        );

      }
    );

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
    `office-${type}-${Date.now()}`;


  const win =
    document.createElement(
      "section"
    );


  win.className =
    "aido-window";


  win.dataset.id =
    id;


  win.dataset.appId =
    type;


  win.style.left =
    "160px";


  win.style.top =
    "90px";


  win.style.zIndex =
    ++state.zIndex;


  win.style.resize =
    "both";


  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">

        <span class="window-title-icon">
          📘
        </span>

        <span>
          ${escapeHTML(title)}
        </span>

      </div>


      <div class="window-controls">

        <button
          class="window-control"
          type="button"
          data-window-action="minimize"
        >
          —
        </button>

        <button
          class="window-control"
          type="button"
          data-window-action="suspend"
        >
          ⏸
        </button>

        <button
          class="window-control close"
          type="button"
          data-window-action="close"
        >
          ×
        </button>

      </div>

    </div>


    <div class="window-content editor">

      <div class="editor-toolbar">

        <button
          type="button"
          data-cmd="bold"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          data-cmd="italic"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          data-cmd="underline"
        >
          <u>U</u>
        </button>

        <button
          type="button"
          data-save-editor="true"
        >
          💾 Guardar
        </button>

      </div>


      <div
        class="editor-area"
        contenteditable="true"
      >

        <h1>
          ${escapeHTML(title)}
        </h1>

        <p>
          Empieza a escribir aquí...
        </p>

      </div>

    </div>


    <div class="suspended-screen">

      <span style="font-size:36px">
        ⏸
      </span>

      <strong>
        Aplicación suspendida
      </strong>

    </div>

  `;


  document
    .getElementById(
      "windowLayer"
    )
    .appendChild(
      win
    );


  state.windows.set(
    id,
    {

      id,

      appId:
        type,

      element:
        win,

      desktop:
        state.currentDesktop,

      minimized:
        false,

      suspended:
        false

    }
  );


  state.desktops[
    state.currentDesktop
  ].push(
    id
  );


  makeDraggable(
    win
  );


  setupWindowInteractions(
    win
  );


  createTaskTab(
    id,
    {
      title,
      icon: "📘"
    }
  );


  focusWindow(
    win
  );


  win
    .querySelectorAll(
      "[data-cmd]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document.execCommand(
              button.dataset.cmd,
              false,
              null
            );

          }
        );

      }
    );


  const save =
    win.querySelector(
      "[data-save-editor]"
    );


  if (save) {

    save.addEventListener(
      "click",
      () => {

        showToast(
          `💾 ${title} guardado`
        );

      }
    );

  }

}


/* =====================================================
   JUEGOS
===================================================== */

function renderGames() {

  return `

    <div class="app-page">

      <div class="app-title">
        🎮 AidoGames
      </div>

      <div class="app-subtitle">
        Juegos originales listos para probar.
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
            type="button"
            data-launch-game="racer"
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
            Construye tu mundo.
          </p>

          <button
            type="button"
            data-launch-game="blocks"
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
            Despega y explora.
          </p>

          <button
            type="button"
            data-launch-game="space"
          >
            Jugar
          </button>

        </div>


        <div class="game-card">

          <div class="game-image">
            🏙️
          </div>

          <h3>
            GHA 5 · Demo
          </h3>

          <p>
            Demo original de mundo abierto.
          </p>

          <button
            type="button"
            data-launch-game="gha"
          >
            Jugar demo
          </button>

        </div>


      </div>

    </div>

  `;

}


function wireGames(
  content
) {

  content
    .querySelectorAll(
      "[data-launch-game]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            launchGame(
              button.dataset.launchGame
            );

          }
        );

      }
    );

}


function launchGame(
  type
) {

  if (
    type === "racer"
  ) {

    startRacerGame();

  }


  else if (
    type === "blocks"
  ) {

    startBlockGame();

  }


  else if (
    type === "space"
  ) {

    startSpaceGame();

  }


  else {

    startGHAGame();

  }

}


/* =====================================================
   VENTANA DE JUEGO
===================================================== */

function createGameWindow(
  title,
  icon = "🎮"
) {

  const id =
    `game-${++state.windowNumber}`;


  const win =
    document.createElement(
      "section"
    );


  win.className =
    "aido-window";


  win.dataset.id =
    id;


  win.dataset.appId =
    "game";


  win.style.left =
    "130px";


  win.style.top =
    "80px";


  win.style.zIndex =
    ++state.zIndex;


  win.style.resize =
    "both";


  win.innerHTML = `

    <div class="window-header">

      <div class="window-title">

        <span class="window-title-icon">
          ${icon}
        </span>

        <span>
          ${escapeHTML(title)}
        </span>

      </div>


      <div class="window-controls">

        <button
          class="window-control"
          type="button"
          data-window-action="minimize"
        >
          —
        </button>

        <button
          class="window-control close"
          type="button"
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
    .appendChild(
      win
    );


  state.windows.set(
    id,
    {

      id,

      appId:
        "game",

      element:
        win,

      desktop:
        state.currentDesktop,

      minimized:
        false,

      suspended:
        false

    }
  );


  state.desktops[
    state.currentDesktop
  ].push(
    id
  );


  setupWindowInteractions(
    win
  );


  createTaskTab(
    id,
    {
      title,
      icon
    }
  );


  focusWindow(
    win
  );


  return win.querySelector(
    ".window-content"
  );

}


/* =====================================================
   AIDO RACER
===================================================== */

function startRacerGame() {

  const content =
    createGameWindow(
      "Aido Racer",
      "🏎️"
    );


  content.innerHTML = `

    <div
      style="
        height:100%;
        position:relative;
        background:#101418;
      "
    >

      <canvas
        id="raceCanvas"
        width="700"
        height="420"
        style="
          display:block;
          width:100%;
          height:100%;
          background:#111;
        "
      ></canvas>


      <div
        style="
          position:absolute;
          left:10px;
          top:10px;
          padding:8px 10px;
          border-radius:9px;
          background:rgba(0,0,0,.55);
          font-size:11px;
        "
      >
        AIDO RACER · ← → para moverte
      </div>

    </div>

  `;


  const canvas =
    content.querySelector(
      "#raceCanvas"
    );


  const ctx =
    canvas.getContext(
      "2d"
    );


  let carX =
    325;


  let enemyY =
    -80;


  let score =
    0;


  const keys =
    {};


  const keydown =
    event => {

      keys[event.key] =
        true;

    };


  const keyup =
    event => {

      keys[event.key] =
        false;

    };


  window.addEventListener(
    "keydown",
    keydown
  );


  window.addEventListener(
    "keyup",
    keyup
  );


  const loop =
    () => {

      if (
        !document.body.contains(
          canvas
        )
      ) {

        window.removeEventListener(
          "keydown",
          keydown
        );


        window.removeEventListener(
          "keyup",
          keyup
        );


        return;

      }


      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      ctx.fillStyle =
        "#20252a";


      ctx.fillRect(
        120,
        0,
        460,
        canvas.height
      );


      ctx.fillStyle =
        "#eee";


      for (
        let y = -40;
        y < canvas.height + 40;
        y += 70
      ) {

        ctx.fillRect(
          345,
          (y + score * 2) %
            (canvas.height + 70),
          10,
          35
        );

      }


      if (
        keys.ArrowLeft
      ) {

        carX -= 6;

      }


      if (
        keys.ArrowRight
      ) {

        carX += 6;

      }


      carX =
        Math.max(
          145,
          Math.min(
            500,
            carX
          )
        );


      enemyY +=
        5;


      if (
        enemyY >
        canvas.height + 20
      ) {

        enemyY =
          -80;

        score +=
          1;

      }


      ctx.fillStyle =
        "#e54343";


      ctx.fillRect(
        255,
        enemyY,
        55,
        80
      );


      ctx.fillStyle =
        "#20e59b";


      ctx.fillRect(
        carX,
        canvas.height - 100,
        55,
        80
      );


      ctx.fillStyle =
        "white";


      ctx.font =
        "14px Inter";


      ctx.fillText(
        `Puntos: ${score}`,
        15,
        canvas.height - 18
      );


      requestAnimationFrame(
        loop
      );

    };


  loop();

}


/* =====================================================
   BLOCKWORLD
===================================================== */

function startBlockGame() {

  const content =
    createGameWindow(
      "BlockWorld",
      "🧱"
    );


  content.innerHTML = `

    <div
      style="
        height:100%;
        display:grid;
        place-items:center;
        background:#78b7e5;
      "
    >

      <div
        id="blockWorld"
        style="
          position:relative;
          width:360px;
          height:260px;
          overflow:hidden;
          background:
            linear-gradient(
              #78b7e5 62%,
              #55a747 62%
            );
          cursor:crosshair;
        "
      ></div>

    </div>

  `;


  const world =
    content.querySelector(
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


      block.style.width =
        "30px";


      block.style.height =
        "30px";


      block.style.left =
        `${Math.max(
          0,
          event.offsetX - 15
        )}px`;


      block.style.top =
        `${Math.max(
          0,
          event.offsetY - 15
        )}px`;


      block.style.background =
        random([
          "#8b5a2b",
          "#65a845",
          "#7b7d80",
          "#d7b44d"
        ]);


      block.style.border =
        "2px solid rgba(0,0,0,.18)";


      world.appendChild(
        block
      );

    }
  );

}


/* =====================================================
   AIDO SPACE
===================================================== */

function startSpaceGame() {

  const content =
    createGameWindow(
      "Aido Space",
      "🚀"
    );


  content.innerHTML = `

    <div
      style="
        height:100%;
        background:
          radial-gradient(
            circle at center,
            #26386e,
            #03040a
          );
        display:grid;
        place-items:center;
        cursor:pointer;
      "
    >

      <div
        style="
          text-align:center;
          color:white;
        "
      >

        <div
          style="
            font-size:70px;
          "
        >
          🚀
        </div>

        <div
          style="
            margin-top:10px;
          "
        >
          Haz clic para despegar
        </div>

      </div>

    </div>

  `;


  const screen =
    content.firstElementChild;


  screen.addEventListener(
    "click",
    () =>
      showToast(
        "🚀 ¡Despegue de Aido Space!"
      )
  );

}


/* =====================================================
   GHA 5 DEMO
===================================================== */

function startGHAGame() {

  const content =
    createGameWindow(
      "GHA 5 · Demo",
      "🏙️"
    );


  content.innerHTML = `

    <div
      tabindex="0"
      style="
        height:100%;
        position:relative;
        overflow:hidden;
        background:
          linear-gradient(
            #68a8d9 0 50%,
            #53565b 50%
          );
        outline:none;
      "
    >

      <div
        style="
          position:absolute;
          bottom:28px;
          left:45%;
          font-size:48px;
        "
      >
        🚗
      </div>


      <div
        style="
          position:absolute;
          top:12px;
          left:12px;
          background:rgba(0,0,0,.55);
          padding:9px;
          border-radius:9px;
          color:white;
          font-size:11px;
        "
      >
        GHA 5 · Demo original · A / D
      </div>

    </div>

  `;

}


/* =====================================================
   MÚSICA
===================================================== */

function renderMusic() {

  return `

    <div class="app-page">

      <div class="app-title">
        🎵 AidoMusic
      </div>

      <div class="app-subtitle">
        Escucha archivos de música que tengas en tu PC.
      </div>


      <div
        class="settings-card"
        style="
          margin-top:18px;
        "
      >

        <strong>
          Biblioteca musical
        </strong>

        <p>
          Selecciona archivos de audio
          para reproducirlos.
        </p>

        <input
          id="musicFiles"
          type="file"
          accept="audio/*"
          multiple
        >

      </div>


      <div
        id="musicList"
        class="music-list"
      ></div>

    </div>

  `;

}


function wireMusic(
  content
) {

  const input =
    content.querySelector(
      "#musicFiles"
    );


  const list =
    content.querySelector(
      "#musicList"
    );


  if (
    !input ||
    !list
  )
    return;


  input.addEventListener(
    "change",
    () => {

      list.innerHTML =
        "";


      [
        ...input.files
      ]
      .forEach(
        file => {

          const url =
            URL.createObjectURL(
              file
            );


          const row =
            document.createElement(
              "div"
            );


          row.className =
            "music-item";


          row.innerHTML = `

            <span
              style="font-size:25px"
            >
              🎵
            </span>

            <div
              style="flex:1"
            >

              <strong>
                ${escapeHTML(file.name)}
              </strong>


              <audio
                controls
                style="
                  width:100%;
                  margin-top:7px;
                "
              >

                <source
                  src="${url}"
                >

              </audio>

            </div>

          `;


          list.appendChild(
            row
          );

        }
      );

    }
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

          <strong
            style="font-size:18px"
          >
            Aidophone
          </strong>

          <small>
            Conexión con AidoPC
          </small>


          <div
            style="
              padding:10px;
              border-radius:10px;
              background:
                rgba(32,229,155,.15);
            "
          >
            🟢 AidoPC disponible
          </div>


          <button
            id="connectPhone"
            style="
              padding:10px;
              border:0;
              border-radius:9px;
            "
          >
            🔎 Buscar dispositivo
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

            📋 Portapapeles

          </small>

        </div>

      </div>

    </div>

  `;

}


function wireAidophone(
  content
) {

  const button =
    content.querySelector(
      "#connectPhone"
    );


  if (!button)
    return;


  button.addEventListener(
    "click",
    () => {

      showToast(
        "📱 Buscando Aidophone…"
      );


      setTimeout(
        () =>
          showToast(
            "No hay Aidophone vinculado todavía."
          ),
        1600
      );

    }
  );

}


/* =====================================================
   UPDATE
===================================================== */

function renderUpdate() {

  return `

    <div class="app-page">

      <div class="app-title">
        🔄 Aido Update
      </div>

      <div class="app-subtitle">
        AidoOS Web Edition · versión 0.1.0 Beta
      </div>


      <div
        class="settings-card"
        style="margin-top:18px"
      >

        <strong>
          Estado del sistema
        </strong>

        <p id="updateStatus">
          Última comprobación: ahora.
        </p>

        <button
          id="checkUpdate"
          type="button"
        >
          Buscar actualizaciones
        </button>

      </div>


      <div class="settings-card">

        <strong>
          Canal
        </strong>

        <p>
          Beta · Web Edition
        </p>

      </div>

    </div>

  `;

}


function wireUpdate(
  content
) {

  const button =
    content.querySelector(
      "#checkUpdate"
    );


  const status =
    content.querySelector(
      "#updateStatus"
    );


  if (
    !button ||
    !status
  )
    return;


  button.addEventListener(
    "click",
    () => {

      let progress =
        0;


      const interval =
        setInterval(
          () => {

            progress +=
              20;


            status.textContent =
              `Buscando actualizaciones… ${progress}%`;


            if (
              progress >= 100
            ) {

              clearInterval(
                interval
              );


              status.textContent =
                "✓ AidoOS está actualizado.";


              addNotification(
                "Aido Update",
                "No hay actualizaciones pendientes.",
                "🔄"
              );


              showToast(
                "✅ AidoOS está actualizado"
              );

            }

          },
          180
        );

    }
  );

}


/* =====================================================
   NOTAS
===================================================== */

function renderNotes() {

  const saved =
    localStorage.getItem(
      "aido_notes"
    ) ||
    "";


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
          margin-top:18px;
          background:#101215;
          color:white;
          border:1px solid #333;
          border-radius:12px;
          padding:15px;
          resize:none;
        "
        placeholder="Escribe aquí…"
      >${escapeHTML(saved)}</textarea>


      <button
        id="saveNotes"
        style="
          margin-top:10px;
          padding:10px;
          border:0;
          border-radius:9px;
          background:#20e59b;
        "
      >
        💾 Guardar
      </button>

    </div>

  `;

}


function wireNotes(
  content
) {

  const area =
    content.querySelector(
      "#notesArea"
    );


  const save =
    content.querySelector(
      "#saveNotes"
    );


  if (
    !area ||
    !save
  )
    return;


  save.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "aido_notes",
        area.value
      );


      showToast(
        "💾 Nota guardada"
      );

    }
  );

}


/* =====================================================
   CALCULADORA
===================================================== */

function renderCalculator() {

  return `

    <div
      class="app-page"
      style="
        max-width:340px;
        margin:auto;
      "
    >

      <div class="app-title">
        🧮 Calculadora
      </div>


      <input
        id="calcInput"
        placeholder="Ej. 12 * 5 + 4"
        style="
          width:100%;
          padding:12px;
          margin-top:15px;
          background:#101215;
          color:white;
          border:1px solid #333;
          border-radius:10px;
        "
      >


      <button
        id="calcButton"
        style="
          width:100%;
          padding:11px;
          margin-top:8px;
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


function wireCalculator(
  content
) {

  const input =
    content.querySelector(
      "#calcInput"
    );


  const button =
    content.querySelector(
      "#calcButton"
    );


  const result =
    content.querySelector(
      "#calcResult"
    );


  if (
    !input ||
    !button ||
    !result
  )
    return;


  const calculate =
    () => {

      const expression =
        input.value
          .replace(
            /[^0-9+\-*/().% ]/g,
            ""
          )
          .trim();


      if (!expression) {

        result.textContent =
          "Escribe una operación.";

        return;

      }


      try {

        const value =
          Function(
            `"use strict"; return (${expression})`
          )();


        if (
          !Number.isFinite(
            value
          )
        ) {

          throw new Error(
            "Resultado no válido"
          );

        }


        result.textContent =
          String(
            value
          );

      }

      catch {

        result.textContent =
          "No pude calcularlo.";

      }

    };


  button.addEventListener(
    "click",
    calculate
  );


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        calculate();

      }

    }
  );

}


/* =====================================================
   ARCHIVOS
===================================================== */

function renderFiles() {

  return `

    <div class="app-page">

      <div class="app-title">
        📁 Explorador
      </div>


      <div class="app-subtitle">
        AidoPC · almacenamiento virtual 1 TB
      </div>


      <div
        class="settings-card"
        style="
          margin-top:18px;
        "
      >

        📁 Aplicaciones

        <br><br>

        🎮 AidoGames

        <br><br>

        🛍️ AidoStore

        <br><br>

        📄 Documentos

        <br><br>

        🎵 Música

        <br><br>

        🖼️ Imágenes

        <br><br>

        ⬇️ Descargas

      </div>


      <div class="settings-card">

        <strong>
          💾 SSD AidoPC
        </strong>

        <p>
          1 TB · 258 GB usados · 742 GB libres
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
      style="
        height:100%;
        display:flex;
        flex-direction:column;
      "
    >

      <div class="app-title">
        🎨 Aido Paint
      </div>


      <canvas
        id="paintCanvas"
        width="700"
        height="400"
        style="
          background:white;
          width:100%;
          flex:1;
          margin-top:15px;
          border-radius:10px;
          cursor:crosshair;
        "
      ></canvas>


      <div
        style="
          margin-top:8px;
          color:#999;
          font-size:10px;
        "
      >
        Haz clic y arrastra para dibujar.
      </div>

    </div>

  `;

}


function wirePaint(
  content
) {

  const canvas =
    content.querySelector(
      "#paintCanvas"
    );


  if (!canvas) return;


  const ctx =
    canvas.getContext(
      "2d"
    );


  let drawing =
    false;


  const point =
    event => {

      const rect =
        canvas.getBoundingClientRect();


      return {

        x:
          (
            event.clientX -
            rect.left
          ) *
          (
            canvas.width /
            rect.width
          ),

        y:
          (
            event.clientY -
            rect.top
          ) *
          (
            canvas.height /
            rect.height
          )

      };

    };


  canvas.addEventListener(
    "pointerdown",
    event => {

      drawing =
        true;


      canvas.setPointerCapture(
        event.pointerId
      );

    }
  );


  canvas.addEventListener(
    "pointerup",
    event => {

      drawing =
        false;


      try {

        canvas.releasePointerCapture(
          event.pointerId
        );

      }

      catch {}

    }
  );


  canvas.addEventListener(
    "pointermove",
    event => {

      if (!drawing)
        return;


      const p =
        point(
          event
        );


      ctx.fillStyle =
        "#111";


      ctx.beginPath();


      ctx.arc(
        p.x,
        p.y,
        4,
        0,
        Math.PI * 2
      );


      ctx.fill();

    }
  );

}


/* =====================================================
   BROWSER
===================================================== */

function renderBrowser() {

  return `

    <div class="browser">

      <div class="browser-toolbar">

        <button
          type="button"
          data-browser="back"
        >
          ←
        </button>


        <button
          type="button"
          data-browser="reload"
        >
          ↻
        </button>


        <input
          id="browserUrl"
          class="browser-url"
          value="https://example.com"
          placeholder="Buscar o escribir una dirección"
        >


        <button
          type="button"
          data-browser="go"
        >
          →
        </button>


        <button
          type="button"
          data-browser="external"
        >
          ↗
        </button>

      </div>


      <div class="browser-info">

        Aido NavegerPRO · Algunas páginas no permiten mostrarse dentro de otra web.

      </div>


      <iframe
        id="browserFrame"
        class="browser-frame"
        src="https://example.com"
        title="Aido NavegerPRO"
      ></iframe>

    </div>

  `;

}


function wireBrowser(
  content
) {

  const input =
    content.querySelector(
      "#browserUrl"
    );


  const frame =
    content.querySelector(
      "#browserFrame"
    );


  if (
    !input ||
    !frame
  )
    return;


  const navigate =
    () => {

      let value =
        input.value
          .trim();


      if (!value)
        return;


      if (
        !/^https?:\/\//i.test(
          value
        )
      ) {

        if (
          value.includes(".") &&
          !value.includes(" ")
        ) {

          value =
            "https://" +
            value;

        }

        else {

          value =
            "https://www.google.com/search?q=" +
            encodeURIComponent(
              value
            );

        }

      }


      input.value =
        value;


      frame.src =
        value;

    };


  const go =
    content.querySelector(
      '[data-browser="go"]'
    );


  if (go) {

    go.addEventListener(
      "click",
      navigate
    );

  }


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        navigate();

      }

    }
  );


  const reload =
    content.querySelector(
      '[data-browser="reload"]'
    );


  if (reload) {

    reload.addEventListener(
      "click",
      () => {

        frame.src =
          frame.src;

      }
    );

  }


  const back =
    content.querySelector(
      '[data-browser="back"]'
    );


  if (back) {

    back.addEventListener(
      "click",
      () => {

        try {

          frame.contentWindow
            .history
            .back();

        }

        catch {}

      }
    );

  }


  const external =
    content.querySelector(
      '[data-browser="external"]'
    );


  if (external) {

    external.addEventListener(
      "click",
      () => {

        let url =
          input.value
            .trim();


        if (
          !/^https?:\/\//i.test(
            url
          )
        ) {

          url =
            "https://" +
            url;

        }


        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }

}


/* =====================================================
   WIRING DE APPS
===================================================== */

function wireApp(
  appId,
  content
) {

  const map = {

    store:
      wireStore,

    aidoia:
      wireAidoIA,

    settings:
      wireSettings,

    office:
      wireOffice,

    games:
      wireGames,

    music:
      wireMusic,

    aidophone:
      wireAidophone,

    update:
      wireUpdate,

    notes:
      wireNotes,

    calculator:
      wireCalculator,

    paint:
      wirePaint,

    browser:
      wireBrowser

  };


  if (
    map[appId]
  ) {

    map[appId](
      content
    );

  }

}


/* =====================================================
   UTILIDADES
===================================================== */

function loadJSON(
  key,
  fallback
) {

  try {

    const raw =
      localStorage.getItem(
        key
      );


    return raw
      ? JSON.parse(raw)
      : fallback;

  }

  catch {

    return fallback;

  }

}


function saveJSON(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


function random(
  array
) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


function randomInt(
  min,
  max
) {

  return Math.floor(
    Math.random() *
      (
        max -
        min +
        1
      )
  ) + min;

}


function escapeHTML(
  value
) {

  return String(
    value
  )
  .replaceAll(
    "&",
    "&amp;"
  )
  .replaceAll(
    "<",
    "&lt;"
  )
  .replaceAll(
    ">",
    "&gt;"
  )
  .replaceAll(
    '"',
    "&quot;"
  )
  .replaceAll(
    "'",
    "&#039;"
  );

}


let toastTimer =
  null;


function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast)
    return;


  toast.textContent =
    message;


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
      2400
    );

}


/* =====================================================
   FIN
===================================================== */
