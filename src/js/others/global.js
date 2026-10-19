function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Elemento com id "${id}" não encontrado.`);
    return el;
}
export function setupTabNavigation({ menus, onEnter = {}, onChange, navBarId = "nav-bar", buttonPrefix = "button-header-", activeClass = "nav-bar-ativo", displayType = "flex", initial, }) {
    const navBar = getElement(navBarId);
    const tabs = menus.map((name) => ({
        name,
        button: getElement(`${buttonPrefix}${name}`),
        panel: getElement(name),
    }));
    let current;
    function updateIndicator(activeButton) {
        navBar.style.setProperty("--indicator-left", `${activeButton.offsetLeft}px`);
        navBar.style.setProperty("--indicator-width", `${activeButton.offsetWidth}px`);
    }
    function changeTo(id) {
        const previous = current;
        for (const tab of tabs) {
            const isActive = tab.name === id;
            tab.panel.style.display = isActive ? displayType : "none";
            tab.button.classList.toggle(activeClass, isActive);
            if (isActive)
                updateIndicator(tab.button);
        }
        current = id;
        onEnter[id]?.();
        onChange?.(id, previous);
    }
    for (const tab of tabs) {
        tab.button.addEventListener("click", () => changeTo(tab.name));
    }
    window.addEventListener("resize", () => {
        const active = tabs.find((t) => t.name === current);
        if (active)
            updateIndicator(active.button);
    });
    const resizeObserver = new ResizeObserver(() => {
        const active = tabs.find((t) => t.name === current);
        if (active)
            updateIndicator(active.button);
    });
    tabs.forEach((tab) => resizeObserver.observe(tab.button));
    if (initial) {
        const initialize = () => {
            changeTo(initial);
        };
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initialize, { once: true });
        }
        else {
            initialize();
        }
    }
    return { changeTo };
}
export function mover(objeto) {
    let draggedElement = null;
    let shiftX, shiftY;
    let isDragging = false;
    let animationFrameId = null;
    const MOVE_THRESHOLD = 5;
    // Valores de destino para a animação
    let targetX = 0;
    let targetY = 0;
    const updatePosition = () => {
        if (!draggedElement)
            return;
        // Aplica a posição apenas no momento em que a tela vai atualizar
        draggedElement.style.left = `${targetX}px`;
        draggedElement.style.top = `${targetY}px`;
        animationFrameId = requestAnimationFrame(updatePosition);
    };
    objeto.addEventListener('mousedown', (e) => {
        if (!e)
            return;
        draggedElement = objeto;
        const rect = draggedElement.getBoundingClientRect();
        shiftX = e.clientX - rect.left;
        shiftY = e.clientY - rect.top;
        const startX = e.clientX;
        const startY = e.clientY;
        isDragging = false;
        const onMouseMove = (e) => {
            if (!isDragging &&
                (Math.abs(e.clientX - startX) > MOVE_THRESHOLD ||
                    Math.abs(e.clientY - startY) > MOVE_THRESHOLD)) {
                isDragging = true;
                // Inicia o ciclo de animação
                animationFrameId = requestAnimationFrame(updatePosition);
            }
            if (isDragging) {
                // Em vez de mover o DOM aqui, apenas guardamos as coordenadas
                targetX = e.pageX - shiftX - window.scrollX;
                targetY = e.pageY - shiftY - window.scrollY;
            }
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (animationFrameId !== null) {
                // Para o ciclo de animação
                cancelAnimationFrame(animationFrameId);
            }
            draggedElement = null;
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}
export function setupSaveLoadUI({ options, defaultAction = "save", defaultOption, isUserLoggedIn = () => false, saveActionId = "save-action", loadActionId = "load-action", confirmButtonId = "confirm-save-load", autoSaveCheckboxId = "auto-save-checkbox", notificationId = "save-notification", notificationDuration = 3000, saveMessage = "Dados salvos com sucesso!", chosenActionClass = "acao-escolhida", chosenOptionClass = "opcao-escolhida", }) {
    const optionNames = Object.keys(options);
    const actionButtons = {
        save: getElement(saveActionId),
        load: getElement(loadActionId),
    };
    const optionButtons = optionNames.map((name) => ({ name, el: getElement(name) }));
    let selectedAction;
    let selectedOption;
    let notificationTimeout;
    /** Indica se o checkbox de auto save está marcado. */
    function isAutoSaveEnabled() {
        return getElement(autoSaveCheckboxId).checked;
    }
    /** Marca visualmente a ação (salvar/carregar) selecionada. */
    function selectAction(action) {
        selectedAction = action;
        document.querySelector(`.${chosenActionClass}`)?.classList.remove(chosenActionClass);
        actionButtons[action].classList.add(chosenActionClass);
    }
    /** Marca visualmente a opção (local/json/sql/online) selecionada. */
    function selectOption(name) {
        selectedOption = name;
        document.querySelector(`.${chosenOptionClass}`)?.classList.remove(chosenOptionClass);
        optionButtons.find((o) => o.name === name).el.classList.add(chosenOptionClass);
    }
    /** Mostra a notificação por alguns segundos. */
    function showNotification(message) {
        const notification = getElement(notificationId);
        notification.querySelector("p").innerText = message;
        notification.style.display = "block";
        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            notification.style.display = "none";
        }, notificationDuration);
    }
    /** Executa a ação escolhida (salvar/carregar) com a opção escolhida. */
    async function confirm() {
        if (!selectedAction || !selectedOption) {
            alert("Por favor, selecione uma ação e uma opção.");
            return;
        }
        const option = options[selectedOption];
        if (option.requiresLogin && !isUserLoggedIn()) {
            const verb = selectedAction === "save" ? "salvar" : "carregar";
            alert(`Você precisa estar logado para ${verb} online.`);
            return;
        }
        if (selectedAction === "save") {
            await option.save();
            showNotification(saveMessage);
        }
        else {
            await option.load();
        }
    }
    actionButtons.save.addEventListener("click", () => selectAction("save"));
    actionButtons.load.addEventListener("click", () => selectAction("load"));
    for (const { name, el } of optionButtons) {
        el.addEventListener("click", () => selectOption(name));
    }
    if (confirmButtonId) {
        getElement(confirmButtonId).addEventListener("click", confirm);
    }
    if (defaultAction)
        selectAction(defaultAction);
    if (defaultOption)
        selectOption(defaultOption);
    return { isAutoSaveEnabled, selectAction, selectOption, confirm, showNotification };
}
