export const connectDevice = (payload) => {
	return {
		type: "CONNECT",
		payload
	};
};

export const disconnectDevice = (payload) => {
	return {
		type: "DISCONNECT",
		payload
	};
};
