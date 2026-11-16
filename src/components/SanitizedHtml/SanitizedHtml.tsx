import { CSSProperties, useEffect, useRef } from "react";
import { setSanitizedHtml } from "../../sanitizeHtml";

type Props = {
    html: string,
    as?: "div" | "i",
    className?: string,
    style?: CSSProperties,
    title?: string
}

const SanitizedHtml = ({ html, as = "div", className, style, title }: Props) => {
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (elementRef.current) {
            setSanitizedHtml(elementRef.current, html);
        }
    }, [html]);

    const attributes = { className, style, title };
    const setElement = (element: HTMLElement | null) => { elementRef.current = element; };
    return as === "i"
        ? <i ref={setElement} {...attributes} />
        : <div ref={setElement} {...attributes} />;
};

export default SanitizedHtml;
