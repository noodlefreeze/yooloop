import { atom } from 'jotai'

function createRefreshShadowingAtoms() {
  const baseAtom = atom(0)
  const valueAtom = atom((get) => get(baseAtom))
  const setAtom = atom(null, (_, set) => set(baseAtom, (prev) => prev ^ 1))

  return [valueAtom, setAtom] as const
}
export const [refreshShadowingAtom, setRefreshShadowingAtom] = createRefreshShadowingAtoms()

const shadowingBaseAtom = atom(async (get) => {
  get(refreshShadowingAtom)

  return await shadowingDB.getAllMetadataWithAudios()
})

export const shadowingAtom = loadable(shadowingBaseAtom)
