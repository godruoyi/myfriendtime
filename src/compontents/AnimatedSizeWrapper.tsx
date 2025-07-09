import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';
import { debounce } from 'lodash-es';

const appWindow = getCurrentWindow();

const setTauriWindowSize = debounce(
    async (physicalHeight: number) => {
        try {
            const currentSize = await appWindow.outerSize();
            if (Math.abs(currentSize.height - physicalHeight) > 2) {
                await appWindow.setSize(new PhysicalSize(currentSize.width, physicalHeight + 0));
            }
        } catch (e) {
            console.error('Failed to set window size', e);
        }
    },
    16,
    { leading: false, trailing: true }
);

interface AnimatedSizeWrapperProps {
    children: React.ReactNode;
}

const AnimatedSizeWrapper: React.FC<AnimatedSizeWrapperProps> = ({ children }) => {
    const appWindow = getCurrentWindow();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const height = useMotionValue(0);
    useEffect(() => {
        return height.on('change', async latestHeight => {
            const scaleFactor = await appWindow.scaleFactor();
            const physicalHeight = Math.ceil(latestHeight * scaleFactor);
            setTauriWindowSize(physicalHeight);
        });
    }, [height]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(async entries => {
            if (entries[0]) {
                const newHeight = entries[0].contentRect.height;
                height.set(newHeight);
            }
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [height]);

    return (
        <motion.div ref={containerRef} style={{ height }} className="animated-container">
            <div ref={contentRef}>{children}</div>
        </motion.div>
    );
};

export default AnimatedSizeWrapper;
