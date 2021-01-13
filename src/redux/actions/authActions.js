export const login = (payload) => ({
	type: 'LOGIN',
	payload,
});

export const update = (payload) => ({
	type: 'UPDATE',
	payload,
});

export const logout = (payload) => ({
	type: 'LOGOUT',
	payload,
});

export const confirm_user = () => ({
	type: 'CONFIRM',
});