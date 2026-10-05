import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { enableMapSet } from "immer";
import Card from "../components/Card/SingleCard/Card";
import { MCCard } from "../store/entities/cards";
import { createStore } from "../store/configureStore";

enableMapSet();

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en" }
    }),
    initReactI18next: { type: "3rdParty", init: jest.fn() }
}));

jest.mock("react-lazy-load-image-component", () => ({
    __esModule: true,
    LazyLoadImage: (props: {
        className?: string;
        src: string;
        alt?: string;
        afterLoad?: () => void;
        onError?: () => void;
    }) => (
        <img
            className={props.className}
            src={props.src}
            alt={props.alt}
            onLoad={props.afterLoad}
            onError={props.onError}
        />
    )
}));

jest.mock("../components/Modal", () => ({ Modal: () => null }));
jest.mock("../components/Card/SingleCard/CardTop", () => ({
    __esModule: true,
    default: () => null
}));

const mockCard = (overrides: Partial<MCCard> = {}): MCCard => ({
    code: "01001a",
    pack_code: "core",
    pack_name: "Core Set",
    name: "Spider-Man",
    real_name: "Peter Parker",
    type_code: "hero",
    type_name: "Hero",
    faction_code: "spider-man",
    faction_name: "Spider-Man",
    set_code: "core",
    card_set_code: "core_hero",
    card_set_name: "Core Heroes",
    card_set_type_name_code: "hero",
    position: 1,
    linked_to_code: "",
    linked_to_name: "",
    imagesrc: "/bundles/cards/01001a.png",
    ...overrides
});

describe("card image retry action", () => {
    let container: HTMLElement;
    let root: Root;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
        root = createRoot(container);
    });

    afterEach(async () => {
        await act(async () => root.unmount());
        container.remove();
    });

    const renderCard = async (card = mockCard()) => {
        await act(async () => {
            root.render(<Provider store={createStore()}><Card card={card} /></Provider>);
        });
    };

    const triggerImageEvent = (image: HTMLImageElement, eventName: "load" | "error") => {
        act(() => {
            image.dispatchEvent(new Event(eventName, { bubbles: true }));
        });
    };

    it("retries only the displayed face and shows loading and reload states", async () => {
        await renderCard();

        const retryButton = container.querySelector<HTMLButtonElement>('button[aria-label="Cargando imagen"]');
        const frontImage = container.querySelector<HTMLImageElement>(".front-image");
        expect(retryButton).not.toBeNull();
        expect(retryButton?.disabled).toBe(true);
        expect(frontImage).not.toBeNull();

        triggerImageEvent(frontImage!, "load");
        const reloadButton = container.querySelector<HTMLButtonElement>('button[aria-label="Recargar imagen"]');
        expect(reloadButton?.disabled).toBe(false);

        act(() => {
            container.querySelector<HTMLButtonElement>('button[title="Gira la carta"]')?.click();
        });
        expect(container.querySelector<HTMLButtonElement>('button[aria-label="Cargando imagen"]')?.disabled).toBe(true);

        const backImage = container.querySelector<HTMLImageElement>(".back-image");
        expect(backImage).not.toBeNull();
        triggerImageEvent(backImage!, "load");

        const loadedBackImage = container.querySelector<HTMLImageElement>(".back-image");
        const loadedFrontImage = container.querySelector<HTMLImageElement>(".front-image");
        act(() => {
            container.querySelector<HTMLButtonElement>('button[aria-label="Recargar imagen"]')?.click();
        });

        expect(container.querySelector<HTMLImageElement>(".back-image")).not.toBe(loadedBackImage);
        expect(container.querySelector<HTMLImageElement>(".front-image")).toBe(loadedFrontImage);
        expect(container.querySelector<HTMLButtonElement>('button[aria-label="Cargando imagen"]')?.disabled).toBe(true);
    });

    it("retries the active English fallback source after an error", async () => {
        await renderCard();

        const frontImage = container.querySelector<HTMLImageElement>(".front-image");
        expect(frontImage).not.toBeNull();
        triggerImageEvent(frontImage!, "error");
        expect(frontImage?.src).toBe("https://marvelcdb.com/bundles/cards/01001a.png");

        triggerImageEvent(frontImage!, "error");
        const retryButton = container.querySelector<HTMLButtonElement>('button[aria-label="Recargar imagen"]');
        expect(retryButton?.disabled).toBe(false);

        act(() => retryButton?.click());
        const retriedFrontImage = container.querySelector<HTMLImageElement>(".front-image");
        expect(retriedFrontImage).not.toBe(frontImage);
        expect(retriedFrontImage?.src).toBe("https://marvelcdb.com/bundles/cards/01001a.png");
    });
});
