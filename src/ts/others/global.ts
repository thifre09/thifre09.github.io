export interface TabNavigationOptions<T extends string> {
    /** Nomes dos menus. Cada um precisa de um painel com id igual ao nome. */
    menus: readonly T[];
    /** Efeitos especiais executados ao entrar em um menu específico. */
    onEnter?: Partial<Record<T, () => void>>;
    /** Executada em toda troca de menu, depois do onEnter. */
    onChange?: (id: T, previous: T | undefined) => void;
    /** Id da barra de navegação que contém o indicador. */
    navBarId?: string;
    /** Prefixo do id dos botões (ex.: "button-header-" + "game"). */
    buttonPrefix?: string;
    /** Classe aplicada ao botão ativo. */
    activeClass?: string;
    /** Valor de display aplicado ao painel visível. */
    displayType?: string;
    /** Menu exibido inicialmente. Se omitido, não ativa nenhum. */
    initial?: T;
}

export function getElement(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Elemento com id "${id}" não encontrado.`);
    return el;
}

export function setupTabNavigation<T extends string>({
    menus,
    onEnter = {},
    onChange,
    navBarId = "nav-bar",
    buttonPrefix = "button-header-",
    activeClass = "nav-bar-ativo",
    displayType = "flex",
    initial,
}: TabNavigationOptions<T>) {
    const navBar = getElement(navBarId);

    const tabs = menus.map((name) => ({
        name,
        button: getElement(`${buttonPrefix}${name}`),
        panel: getElement(name),
    }));

    let current: T | undefined;

    function updateIndicator(activeButton: HTMLElement) {
        navBar.style.setProperty("--indicator-left", `${activeButton.offsetLeft}px`);
        navBar.style.setProperty("--indicator-width", `${activeButton.offsetWidth}px`);
    }

    function changeTo(id: T) {
        const previous = current;

        for (const tab of tabs) {
            const isActive = tab.name === id;
            tab.panel.style.display = isActive ? displayType : "none";
            tab.button.classList.toggle(activeClass, isActive);
            if (isActive) updateIndicator(tab.button);
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
        if (active) updateIndicator(active.button);
    });

    const resizeObserver = new ResizeObserver(() => {
        const active = tabs.find((t) => t.name === current);
        if (active) updateIndicator(active.button);
    });
    tabs.forEach((tab) => resizeObserver.observe(tab.button));

    if (initial) {
        const initialize = () => {
            changeTo(initial);
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initialize, { once: true });
        } else {
            initialize();
        }
    }

    return { changeTo };
}

export function mover(objeto: HTMLElement) {
    let draggedElement: HTMLElement | null = null;
    let shiftX: number, shiftY: number;
    let isDragging = false;
    let animationFrameId: number | null = null;
    const MOVE_THRESHOLD = 5;

    // Valores de destino para a animação
    let targetX = 0;
    let targetY = 0;

    const updatePosition = () => {
        if (!draggedElement) return;

        // Aplica a posição apenas no momento em que a tela vai atualizar
        draggedElement.style.left = `${targetX}px`;
        draggedElement.style.top = `${targetY}px`;

        animationFrameId = requestAnimationFrame(updatePosition);
    };

    objeto.addEventListener('mousedown', (e: MouseEvent) => {
        if (!e) return;

        draggedElement = objeto;
        const rect = draggedElement.getBoundingClientRect();

        shiftX = e.clientX - rect.left;
        shiftY = e.clientY - rect.top;

        const startX = e.clientX;
        const startY = e.clientY;
        isDragging = false;

        const onMouseMove = (e: MouseEvent) => {
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