import { useState, useEffect, useRef } from "react";

export const observerConfig = {
    root: null,
    rootMargin: "500px",
    threshold: 0,
};

export function useObserver(options) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [options]);

    return [observerRef, isIntersecting];
}