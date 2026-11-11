'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { GraphNodeType } from '@/entities/graph/api'
import { STORE_KEYS } from '@/shared/config/store-keys'

export type GraphRendererMode = 'physics' | 'flow'

export type GraphForces = {
    center: number
    repel: number
    linkStrength: number
    linkDistance: number
}

export type GraphDisplay = {
    nodeSize: number
    linkWidth: number
    labelFadeZoom: number
    showLabels: boolean
    drift: boolean
    localDepth: 1 | 2
}

export type GraphColors = Record<GraphNodeType, string | null>

export type GraphSettingsState = {
    rendererMode: GraphRendererMode
    forces: GraphForces
    display: GraphDisplay
    colors: GraphColors
    hintDismissed: boolean
    setRendererMode: (mode: GraphRendererMode) => void
    setForces: (patch: Partial<GraphForces>) => void
    setDisplay: (patch: Partial<GraphDisplay>) => void
    setColor: (type: GraphNodeType, value: string | null) => void
    setHintDismissed: (value: boolean) => void
    reset: () => void
}

export const DEFAULT_GRAPH_FORCES: GraphForces = {
    center: 0.03,
    repel: 450,
    linkStrength: 0.18,
    linkDistance: 170
}

export const DEFAULT_GRAPH_DISPLAY: GraphDisplay = {
    nodeSize: 5,
    linkWidth: 1.15,
    labelFadeZoom: 0.55,
    showLabels: true,
    drift: true,
    localDepth: 1
}

export const DEFAULT_GRAPH_COLORS: GraphColors = {
    entry: null,
    person: null,
    place: null
}

const defaults = {
    rendererMode: 'physics' as GraphRendererMode,
    forces: DEFAULT_GRAPH_FORCES,
    display: DEFAULT_GRAPH_DISPLAY,
    colors: DEFAULT_GRAPH_COLORS,
    hintDismissed: false
}

type PersistedGraphSettings = {
    rendererMode?: GraphRendererMode
    forces?: GraphForces
    display?: GraphDisplay
    colors?: GraphColors
    hintDismissed?: boolean
}

export const useGraphSettings = create<GraphSettingsState>()(
    persist(
        (set) => ({
            ...defaults,
            setRendererMode: (mode) => set({ rendererMode: mode }),
            setForces: (patch) =>
                set((state) => ({
                    forces: { ...state.forces, ...patch }
                })),
            setDisplay: (patch) =>
                set((state) => ({
                    display: { ...state.display, ...patch }
                })),
            setColor: (type, value) =>
                set((state) => ({
                    colors: { ...state.colors, [type]: value }
                })),
            setHintDismissed: (value) => set({ hintDismissed: value }),
            reset: () =>
                set({
                    rendererMode: defaults.rendererMode,
                    forces: { ...DEFAULT_GRAPH_FORCES },
                    display: { ...DEFAULT_GRAPH_DISPLAY },
                    colors: { ...DEFAULT_GRAPH_COLORS },
                    hintDismissed: false
                })
        }),
        {
            name: STORE_KEYS.GRAPH_SETTINGS,
            version: 2,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                rendererMode: state.rendererMode,
                forces: state.forces,
                display: state.display,
                colors: state.colors,
                hintDismissed: state.hintDismissed
            }),
            migrate: (persisted, version) => {
                const state = (persisted ?? {}) as PersistedGraphSettings
                if (version < 2) {
                    return {
                        ...state,
                        rendererMode: state.rendererMode ?? 'physics',
                        forces: { ...DEFAULT_GRAPH_FORCES },
                        display: { ...DEFAULT_GRAPH_DISPLAY, ...state.display },
                        colors: { ...DEFAULT_GRAPH_COLORS, ...state.colors },
                        hintDismissed: Boolean(state.hintDismissed)
                    }
                }
                return {
                    rendererMode: state.rendererMode ?? 'physics',
                    forces: { ...DEFAULT_GRAPH_FORCES, ...state.forces },
                    display: { ...DEFAULT_GRAPH_DISPLAY, ...state.display },
                    colors: { ...DEFAULT_GRAPH_COLORS, ...state.colors },
                    hintDismissed: Boolean(state.hintDismissed)
                }
            }
        }
    )
)
