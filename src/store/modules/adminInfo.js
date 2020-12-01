const state = () => ({
  info: {}
});

// this.$store.commit('xxx')
const mutations = {
    set(state, payload) {
        state.info = payload;
        sessionStorage.setItem('adminInfo', JSON.stringify(payload));
    },
    del(state) {
        state.info = {};
        sessionStorage.removeItem('adminInfo');
    }
}

// this.$store.dispatch('xxx')
const actions = {
    set({ commit }, payload) {
        commit('set', payload);
    },
    del({ commit }) {
        commit('del');
    }
}

// computed 调用 mapGetters(['xxx'...])
const getters = {
    getInfo(state) {
        let res = JSON.parse(sessionStorage.getItem('adminInfo'));
        return state.info ? state.info : res;
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}