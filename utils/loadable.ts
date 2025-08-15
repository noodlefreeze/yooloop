import type { Atom } from 'jotai'
import { atom } from 'jotai'

const cache1 = new WeakMap()
const memo1 = <T>(create: () => T, dep1: object): T =>
  (cache1.has(dep1) ? cache1 : cache1.set(dep1, create())).get(dep1)

const isPromiseLike = <Value>(p: unknown): p is PromiseLike<Awaited<Value>> => typeof (p as any)?.then === 'function'

export type Loadable<Value> =
  | { state: 'loading'; data?: Awaited<Value> }
  | { state: 'hasError'; error: unknown }
  | { state: 'hasData'; data: Awaited<Value> }

export function loadable<Value>(anAtom: Atom<Value>): Atom<Loadable<Value>> {
  let lastSuccessfulData: Awaited<Value> | undefined

  return memo1(() => {
    const loadableCache = new WeakMap<PromiseLike<Awaited<Value>>, Loadable<Value>>()
    const refreshAtom = atom(0)

    const derivedAtom = atom(
      (get, { setSelf }) => {
        get(refreshAtom)
        let value: Value
        try {
          value = get(anAtom)
        } catch (error) {
          return { state: 'hasError', error } as Loadable<Value>
        }
        if (!isPromiseLike<Value>(value)) {
          return { state: 'hasData', data: value } as Loadable<Value>
        }
        const promise = value
        const cached1 = loadableCache.get(promise)
        if (cached1) {
          return cached1
        }
        promise.then(
          (data) => {
            lastSuccessfulData = data
            loadableCache.set(promise, { state: 'hasData', data })
            setSelf()
          },
          (error) => {
            loadableCache.set(promise, { state: 'hasError', error })
            setSelf()
          },
        )

        const cached2 = loadableCache.get(promise)
        if (cached2) {
          return cached2
        }
        loadableCache.set(promise, { state: 'loading', data: lastSuccessfulData } as Loadable<Value>)
        return { state: 'loading', data: lastSuccessfulData } as Loadable<Value>
      },
      (_get, set) => {
        set(refreshAtom, (c) => c + 1)
      },
    )

    return atom((get) => get(derivedAtom))
  }, anAtom)
}
