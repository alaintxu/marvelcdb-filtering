import { CSSProperties, useEffect, useRef } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import { setSanitizedHtml } from "../../sanitizeHtml";
import { cx } from "../../styles/cx";

type Props = {
    html: string,
    as?: "div" | "i",
    className?: string,
    style?: CSSProperties,
    title?: string,
    xstyle?: StyleXStyles,
}

const SanitizedHtml = ({ html, as = "div", className, style, title, xstyle }: Props) => {
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (elementRef.current) {
            setSanitizedHtml(elementRef.current, html);
        }
    }, [html]);

    // stylex.props returns its own className and style, so merge them instead of spreading over the caller's.
    const styleXProps = stylex.props(xstyle);
    const attributes = {
        className: cx(className, styleXProps.className),
        style: { ...style, ...styleXProps.style },
        title,
    };
    const setElement = (element: HTMLElement | null) => { elementRef.current = element; };
    return as === "i"
        ? <i ref={setElement} {...attributes} />
        : <div ref={setElement} {...attributes} />;
};

export default SanitizedHtml
