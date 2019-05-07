export default {
  namespaced: true,
  state: {
    drawType: ''
  },
  mutations: {
    TOOGLE_TOOLS: (state, type) => {
      state.drawType = type
    }
  }
}
