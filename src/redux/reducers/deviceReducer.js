const initialState = {
	// BluetoothManager
	device: null,
	manager: null,
	
	// Status
	isConnected: false,

	// Details
	name: null,
	serialNumber: null,
	firmwareRevision: null,
	hardwareRevision: null,
	manufacturer: 'Inteachlab Technologies',
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
		case 'UPDATE': {

			return {
				...state,
				device: action.payload.device,
				manager: action.payload.manager,
				isConnected: true,
				name: action.payload.name,
				serialNumber: null,
				firmwareRevision: null,
				hardwareRevision: null,
				manufacturer: 'BAUMIND', // TODO
			}
		}
		case 'DISCONNECT': {
			state.manager.cancelTransaction('batteryLevel')
			state.manager.cancelTransaction('batteryStatus')
			state.manager.cancelTransaction('ledValue')
			state.manager.cancelTransaction('ledStatus')
			state.manager.cancelTransaction('ledMode')
			state.manager.destroy()

			return {
				...state,
				device: null,
				isConnected: false,
			}
		}
		default: {
			return state;
		}
	}
};

export default deviceReducer;