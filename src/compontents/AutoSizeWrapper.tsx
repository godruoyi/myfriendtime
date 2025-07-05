import React, { useRef, useEffect, useCallback } from 'react';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';
import { debounce } from "lodash-es";

interface AutoSizeWrapperProps {
    children: React.ReactNode;
    debounceMs?: number;
}

const AutoSizeWrapper: React.FC<AutoSizeWrapperProps> = ({ children, debounceMs = 50 }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const appWindow = getCurrentWindow();
    const minHeight = 400;

    const handleResize = useCallback(
        debounce(async (logicalHeight: number) => {
            try {
                const scaleFactor = await appWindow.scaleFactor();
                const physicalHeight = Math.ceil(logicalHeight * scaleFactor);
                const minPhysicalHeight = Math.ceil(minHeight * scaleFactor);
                const finalPhysicalHeight = Math.max(physicalHeight, minPhysicalHeight);
                const currentPhysicalSize = await appWindow.outerSize();

                if (Math.abs(currentPhysicalSize.height - finalPhysicalHeight) > scaleFactor) {
                    console.log(
                        `Resizing: logicalH=${logicalHeight}, scale=${scaleFactor}, physicalH=${finalPhysicalHeight}`
                    );
                    await appWindow.setSize(
                        new PhysicalSize(currentPhysicalSize.width, finalPhysicalHeight + 0)
                    );
                }
            } catch (error) {
                console.error("Failed to resize window:", error);
            }
        }, debounceMs),
        [debounceMs]
    );

    useEffect(() => {
        const element = wrapperRef.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const newHeight = Math.ceil(entry.contentRect.height);
                handleResize(newHeight);
            }
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
            handleResize.cancel();
        };
    }, [handleResize]);

    return (
        <div ref={wrapperRef}>
            {children}
        </div>
    );
};

export default AutoSizeWrapper;
