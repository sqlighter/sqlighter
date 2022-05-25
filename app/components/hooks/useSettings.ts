//
// useSettings.ts - user settings saved in localStorage (or the user profile)
//

import createPersistedState from "use-persisted-state"

// Persisted settings sync across sessions, tabs and different browser windows
const useSettingsState = createPersistedState("settings")

// Settings need to be serializable/deserializable to json
export type Settings =
  | string
  | string[]
  | boolean
  | boolean[]
  | number
  | number[]
  | { [key: string]: Settings }
  | Settings[]

/**
 * Hook used to persist user settings across sessions, tabs, windows
 * @param key The settings key should be module.something, eg. sqlighter.pins
 * @param initialValue Initial value to be assigned to this setting
 * @returns Settings value and function used to update value
 */
export function useSettings<T extends Settings = {}>(key: string, initialValue: T = null) {
  // TODO persist settings in user profile if user is signed in
  const [settingsCollection, setSettingsCollection] = useSettingsState({})
  console.assert(settingsCollection, `useSettings - settingsCollection is not defined`)

  /** Assign new value to setting, persist to storage or profile */
  function setSettings(value: T) {
    if (!(key in settingsCollection) || settingsCollection[key] !== value) {
      const update = Object.assign({}, settingsCollection)
      update[key] = value
      setSettingsCollection(update)
      // console.debug(`useSettings.setSettings - key: ${key}, value: ${JSON.stringify(value)}`, update)
    }
  }

  const settings =
    settingsCollection !== undefined && key in settingsCollection ? settingsCollection[key] : initialValue
  return [settings, setSettings]
}

// References:
// https://usehooks.com/useLocalStorage/
// https://www.npmjs.com/package/use-persisted-state
