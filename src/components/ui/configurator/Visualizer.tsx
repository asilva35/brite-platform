'use client';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';

export const Visualizer = () => {
    const { width, height, hasThermalBlind, hasSolarShades, hasInsectScreen, productType } = useConfiguratorStore();

    // Dynamic scaling: 1 inch = 10 SVG units
    const strokeWidth = 12;
    const viewWidth = width * 10 + strokeWidth * 2;
    const viewHeight = height * 10 + strokeWidth * 2;

    return (
        <div className="flex flex-col items-center justify-center w-full p-8 bg-slate-50 rounded-xl border border-slate-200 min-h-[500px]">
            <div className="relative w-full max-w-lg drop-shadow-2xl">
                <svg
                    viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                    className="w-full h-auto transition-all duration-500 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 1. Glass Pane with subtle gradient */}
                    <defs>
                        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e2e8f0" />
                            <stop offset="100%" stopColor="#94a3b8" />
                        </linearGradient>
                    </defs>

                    <rect
                        x={strokeWidth}
                        y={strokeWidth}
                        width={width * 10}
                        height={height * 10}
                        fill="url(#glassGrad)"
                    />

                    {/* 2. Thermal Blinds - Conditional layer */}
                    {hasThermalBlind && (
                        <g>
                            {[...Array(Math.floor(height / 2))].map((_, i) => (
                                <rect
                                    key={i}
                                    x={strokeWidth + 2}
                                    y={strokeWidth + (i * 20)}
                                    width={(width * 10) - 4}
                                    height="8"
                                    fill="white"
                                    fillOpacity="0.4"
                                />
                            ))}
                        </g>
                    )}

                    {/* 2.1 SOLAR SHADES - Conditional layer */}
                    {hasSolarShades && (
                        <g>
                            {[...Array(Math.floor(height / 2))].map((_, i) => (
                                <rect
                                    key={i}
                                    x={strokeWidth + 2}
                                    y={strokeWidth + (i * 20)}
                                    width={(width * 10) - 4}
                                    height="8"
                                    fill="gray"
                                    fillOpacity="0.9"
                                />
                            ))}
                        </g>
                    )}

                    {/* 2.2 INSECT SCREEN - Conditional layer */}
                    {hasInsectScreen && (
                        <g>
                            {[...Array(Math.floor(height / 2))].map((_, i) => (
                                <rect
                                    key={i}
                                    x={strokeWidth + 2}
                                    y={strokeWidth + (i * 20)}
                                    width={(width * 10) - 4}
                                    height="8"
                                    fill="red"
                                    fillOpacity="0.2"
                                />
                            ))}
                        </g>
                    )}

                    {/* 3. Aluminum Frame */}
                    <rect
                        x={strokeWidth / 2}
                        y={strokeWidth / 2}
                        width={width * 10 + strokeWidth}
                        height={height * 10 + strokeWidth}
                        fill="none"
                        stroke="#1e293b" // Slate-800 to simulate anodized aluminum
                        strokeWidth={strokeWidth}
                        rx="2" // Slightly rounded edges
                    />

                    {/* 4. Design lines to simulate depth (Casement Style) */}
                    {productType === 'CASEMENT' && (
                        <rect
                            x={strokeWidth + 5}
                            y={strokeWidth + 5}
                            width={(width * 10) - 10}
                            height={(height * 10) - 10}
                            fill="none"
                            stroke="#334155"
                            strokeWidth="1"
                        />
                    )}
                </svg>

                {/* 5. Dimension labels */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400">
                    WIDTH: {width}"
                </div>
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-slate-400">
                    HEIGHT: {height}"
                </div>
            </div>
        </div>
    );
};