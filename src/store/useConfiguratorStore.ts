import { create } from 'zustand';

interface ConfiguratorState {
    width: number;
    height: number;
    productType: 'CASEMENT' | 'WINDOW_WALL';
    glassType: 'DOUBLE' | 'TRIMAX';
    hasThermalBlind: boolean;
    setDimensions: (w: number, h: number) => void;
    setOption: (key: string, value: any) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
    width: 36,
    height: 48,
    productType: 'CASEMENT',
    glassType: 'DOUBLE',
    hasThermalBlind: false,
    setDimensions: (width, height) => set({ width, height }),
    setOption: (key, value) => set((state) => ({ ...state, [key]: value })),
}));