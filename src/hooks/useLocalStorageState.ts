import { useState } from "react";
// import ls from 'local-storage';

const useLocalStorageState = (key, defVal) => {
	const getFromLocalStorageOrSetDefault = () => {
		const st = localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))
		if (st) {
			return st
		}
		return defVal
	}
	
	const [value,setValue] = useState(() => getFromLocalStorageOrSetDefault())

	const SetValue = (newVal) => {
    
    localStorage.setItem(key, JSON.stringify(newVal));       
		// ls.set(key, newVal)
		setValue(newVal)
	}
	
	return [value, SetValue]
}

export default useLocalStorageState