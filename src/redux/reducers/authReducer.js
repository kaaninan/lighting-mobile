const initialState = {
	loggedIn: false,
	// User
	user: {}
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN': {

			return {
				...state,
				loggedIn: true,
			}
		}
		case 'UPDATE': {

			return {
				...state,
			}
		}
		case 'CONFIRM': {
			state.user.isConfirmed = true
			return {
				...state,	
			}
		}
		case 'LOGOUT': {
			return {
				...state,
				loggedIn: false,
				user: {}
			}
		}

		default: {
			return state;
		}
	}
};

export default authReducer;