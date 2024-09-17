import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {
        id: '',
        role:'user'
      },
      isAuthenticated: false,
      showSideBar: true,
    }
  },
  mutations: {
    initialiseStore(state) {
      if (sessionStorage.getItem('access_token')) {
        if (sessionStorage.getItem('store')) {
          this.replaceState(
            Object.assign(state, JSON.parse(sessionStorage.getItem('store')))
          )
        }
      }
    },
    setUser(state, user) {
      state.user = { ...state.user, ...user},
      state.isAuthenticated = true
    },
    removeUser(state) {
      state.user = {id: ''},
      state.isAuthenticated = false
    },

  },
  actions: {
    // registerUser({commit}, user) {
      
    // },
    // loginUser({commit}, user) {

    // },
    // logoutUser({commit}, user) {

    // },
    // deleteUser({commit}, user) {

    // }
  },
  getters: {
    getRole : state => state.user.role,
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user
  },
});

store.subscribe((mutations, state) => {
  sessionStorage.setItem('store',JSON.stringify(state))
})

store.commit('initialiseStore')

export default store;