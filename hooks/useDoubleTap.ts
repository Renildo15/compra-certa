import { useRef } from "react";

const useDoubleTap = (onDoubleTap: () => void, delay=300) => {
    const lastTap = useRef<number>(0);

    const handleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < delay) {
            onDoubleTap();
            lastTap.current = 0; // Reset last tap after double tap
        } else {
            lastTap.current = now; // Update last tap time
        }
    };

    return handleTap;
}

export default useDoubleTap;