/**
 * lib/acta-store.ts
 *
 * Store global de actas, persistido en localStorage con zustand.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Acta } from '@/types/acta'

interface ActaStoreState {
  actas: Acta[]
  crearActa: (acta: Acta) => void
  actualizarActa: (acta: Acta) => void
  eliminarActa: (id: string) => void
  obtenerActa: (id: string) => Acta | undefined
  limpiarTodo: () => void
}

export const useActaStore = create<ActaStoreState>()(
  persist(
    (set, get) => ({
      actas: [],

      crearActa: (acta) =>
        set((state) => ({ actas: [acta, ...state.actas] })),

      actualizarActa: (acta) =>
        set((state) => ({
          actas: state.actas.map((a) => (a.id === acta.id ? acta : a)),
        })),

      eliminarActa: (id) =>
        set((state) => ({ actas: state.actas.filter((a) => a.id !== id) })),

      obtenerActa: (id) => get().actas.find((a) => a.id === id),

      limpiarTodo: () => set({ actas: [] }),
    }),
    {
      name: 'lebaux-actas-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
