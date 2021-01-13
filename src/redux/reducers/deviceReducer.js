const initialState = {
	// BluetoothManager
	device: null,
	manager: null,
	
	// Status
	isConnected: false,

	// Details
	name: null,
};

const deviceReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'CONNECT': {

			return {
				...state,
				device: action.payload.device,
				manager: action.payload.manager,
				isConnected: true,
				name: action.payload.name,
			}
		}
		case 'DISCONNECT': {
			console.warn('disconnect reducer')
			state.manager.cancelTransaction('monitorID')
			// state.device.cancelConnection()
			// 	.then(e => {})
			// 	.catch(error => {})
			// // state.manager.destroy()

			return {
				...state,
				device: null,
				isConnected: false,
				name: null,
			}
		}
		default: {
			return state;
		}
	}
};

export default deviceReducer;