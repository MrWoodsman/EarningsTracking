import { createContext, useContext, useReducer } from "react";

const DataContext = createContext(null);
const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
	const [data, dispatch] = useReducer(dataReducer, initialsData);

	return (
		<DataContext.Provider value={data}>
			<DataDispatchContext.Provider value={dispatch}>{children}</DataDispatchContext.Provider>
		</DataContext.Provider>
	);
}

export function useData() {
	return useContext(DataContext);
}

export function useDataDispatch() {
	return useContext(DataDispatchContext);
}

export function usePropertyValue(propertyName) {
	const data = useData();
	const propertyValue = data.find(item => item.nazwa === propertyName)?.wartosc;
	return propertyValue;
}

function dataReducer(data, action) {
	switch (action.type) {
		case "added": {
			return [
				...data,
				{
					nazwa: action.nazwa,
					wartosc: action.wartosc,
				},
			];
		}
		case "edited": {
			return data.map(item => {
				if (item.nazwa === action.nazwa) {
					return {
						...item,
						wartosc: action.wartosc,
					};
				}
				return item;
			});
		}
		case "deleted": {
			return data.filter(item => item.nazwa !== action.nazwa);
		}
		case "new": {
			return [
				...data,
				{
					nazwa: action.nazwa,
					wartosc: action.wartosc,
				},
			];
		}
		default: {
			throw new Error("Unknown action: " + action.type);
		}
	}
}

const initialsData = [
	{ nazwa: "loged", wartosc: false },
	{ nazwa: "session_id", wartosc: null },
	{ nazwa: "access_token", wartosc: null },
	{ nazwa: "shouldNavigate", wartosc: true },
	{ nazwa: "firstLoad", wartosc: true },
	{ nazwa: "isAuthenticated", wartosc: false },
];
