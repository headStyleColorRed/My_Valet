
export default {
	state: {
		email: null,
		username: null,
		password: null,
		role: "user",
		logged: false,
	},
	mutations: {
		setUserLoginData(state, userData) {
			state.email = userData.email;
			state.username = userData.username;
			state.password = userData.password
			state.role = userData.role;
			state.logged = true;
		},
		resetAuthState(state) {
			state.email = null
			state.username = null;
			state.password = null
			state.role = null;
			state.logged = false;
		}
	},
	getters: {
		logged: (state) => {
			return state.logged;
		},
		role: (state) => {
			return state.role;
		},
		username: (state) => {
			return state.username;
		},
		email: (state) => {
			return state.email;
		},
		password: (state) => {
			return state.password
		}
	}
}