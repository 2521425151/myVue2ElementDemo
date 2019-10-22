export default {
    state:{
        homePageName:'首页'
    },
    getters:{
        HPName(state){
            return state.homePageName
        }
    },
    mutations:{
        getHomePageName(state,data){
            state.homePageName = data
        }
    },
    actions:{
        async setHomePageName({ commit }, data){
            commit('getHomePageName',data)

        }
    }
}
