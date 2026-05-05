import { create } from 'zustand';

interface ConfiguratorState {
    width: number;
    height: number;
    productType: 'CASEMENT' | 'WINDOW_WALL';
    glassType: 'DOUBLE' | 'TRIMAX';
    hasThermalBlind: boolean;
    hasSolarShades: boolean;
    hasInsectScreen: boolean;
    setDimensions: (w: number, h: number) => void;
    setOption: (key: string, value: any) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
    width: 36,
    height: 48,
    productType: 'CASEMENT',
    glassType: 'DOUBLE',
    hasThermalBlind: false,
    hasSolarShades: false,
    hasInsectScreen: false,
    setDimensions: (width, height) => set({ width, height }),
    setOption: (key, value) => set((state) => ({ ...state, [key]: value })),
}));