import { createContext, useContext, useReducer } from "react";

const EarningsContext = createContext(null);
const EarningsDispatchContext = createContext(null);

export function EarningProvider({ children }) {
	const [earnings, dispatch] = useReducer(earningsReducer, initialsEarnings);

	return (
		<EarningsContext.Provider value={earnings}>
			<EarningsDispatchContext.Provider value={dispatch}>
				{children}
			</EarningsDispatchContext.Provider>
		</EarningsContext.Provider>
	);
}

export function useEarnings() {
	return useContext(EarningsContext);
}

export function useEarningsDispatch() {
	return useContext(EarningsDispatchContext);
}

function earningsReducer(earnings, action) {
	switch (action.type) {
		case "added": {
			return [
				...earnings,
				{
					id: action.id,
					title: action.title,
					date: action.date,
					value: action.value,
				},
			];
		}
		case "deleted": {
			return earnings.filter(item => item.id !== action.id);
		}
		default: {
			throw new Error("Unknown action: " + action.type);
		}
	}
}

const initialsEarnings = [
	{
		id: 0,
		title: "Przykładowa wartość",
		value: 0,
		date: "01.12.2000",
	},
];
