// src/components/AnimatedSizeWrapper.tsx
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';
import { debounce } from 'lodash-es';

const appWindow = getCurrentWindow();

const setTauriWindowSize = debounce(async (physicalHeight: number) => {
    try {
        const currentSize = await appWindow.outerSize();
        if (Math.abs(currentSize.height - physicalHeight) > 2) {
            await appWindow.setSize(new PhysicalSize(currentSize.width, physicalHeight + 0));
        }
    } catch (e) {
        console.error('Failed to set window size', e);
    }
}, 16, { leading: false, trailing: true });

interface AnimatedSizeWrapperProps {
    children: React.ReactNode;
}

const AnimatedSizeWrapper: React.FC<AnimatedSizeWrapperProps> = ({ children }) => {
    const appWindow = getCurrentWindow();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 使用 useMotionValue 来驱动高度动画
    const height = useMotionValue(0);

    // 当 height 这个 MotionValue 变化时，执行副作用
    useEffect(() => {
        return height.on('change', async (latestHeight) => {
            // 1. 更新 Tauri 窗口尺寸
            const scaleFactor = await appWindow.scaleFactor();
            const physicalHeight = Math.ceil(latestHeight * scaleFactor);
            setTauriWindowSize(physicalHeight);
        });
    }, [height]);

    // 使用 ResizeObserver 监测内容区域的实际高度变化
    useEffect(() => {
        const resizeObserver = new ResizeObserver(async (entries) => {
            if (entries[0]) {
                const newHeight = entries[0].contentRect.height;

                // 2. 驱动 motion value 变化，而不是直接设置样式
                // 这会触发一个从当前值到新值的弹簧动画
                height.set(newHeight);
            }
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [height]);

    return (
        // 外层容器使用 motion.div，并将其高度绑定到我们的 motion value
        <motion.div ref={containerRef} style={{ height }} className="animated-container">
            {/* 内层容器用于测量实际内容高度 */}
            <div ref={contentRef}>
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedSizeWrapper;
