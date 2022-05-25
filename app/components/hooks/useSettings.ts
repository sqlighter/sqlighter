//
// useSettings.ts - user settings saved in localStorage (or the user profile)
//

// TODO persist settings in user profile if user is signed in

// Persistence based on localStorage APIs
import createPersistedState from "use-persisted-state"

// Persisted settings sync across sessions, tabs and different browser windows
const useSettingsState = createPersistedState("sqltr")

// Settings need to be serializable/deserializable to json
interface Settings {
  [key: string]: string | string[] | boolean | boolean[] | number | number[] | Settings | Settings[]
}

/**
 * Hook used to persist user settings across sessions, tabs, windows
 * @param key The settings key should be module.something, eg. sqltr.pins
 * @param initialValue Initial value to be assigned to this setting
 * @returns Settings value and function used to update value
 */
export function useSettings<T extends Settings = {}>(key: string, initialValue: T = null) {
  const [settingsCollection, setSettingsCollection] = useSettingsState({})

  // assign initial value if not set
  if (settingsCollection[key] == undefined) {
    const update = Object.assign({}, settingsCollection)
    update[key] = initialValue
    setSettingsCollection(update)
  }

  /** Assign new value to setting, persist to storage or profile */
  function setSettings(value: T) {
    if (settingsCollection[key] !== value) {
      const update = Object.assign({}, settingsCollection)
      update[key] = value
      setSettingsCollection(update)
      console.debug(`useSettings.setSettings - key: ${key}, value: ${JSON.stringify(value)}`, update)
    }
  }

  return [settingsCollection[key], setSettings]
}

// References:
// https://usehooks.com/useLocalStorage/
// https://www.npmjs.com/package/use-persisted-state
