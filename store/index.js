import { GoogleAuthProvider, getAuth, signInWithPopup, setPersistence, browserSessionPersistence, onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth"

export const state = () => ({
  loggedIn: false,
  userUid: '',
  userName: ''
})
  
export const mutations = {
  setLoginStatus(state, loggedIn) {
    state.loggedIn = loggedIn
  },
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  }
}

export const actions = {
  async login({ commit }) {
    console.log('login action')
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken

        const user = result.user
        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)
        
        console.log('login success')
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message

        const credential = GoogleAuthProvider.credentialFromError(error)

        console.log('login error: ', errorCode, errorMessage)
      })

    await setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log('keeping state')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('keeping state error: ', errorCode, errorMessage)
      })
  },
  async loginGuest({ commit }) {
    console.log('guest login action')
    const auth = getAuth()

    await signInAnonymously(auth)
      .then((result) => {
        const user = result.user
        commit('setUserUid', user.uid)
        commit('setUserName', user.displayName)

        console.log('guest login success')
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message

        console.log('guest login error: ', errorCode, errorMessage)
      })

    await setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log('guest keeping state')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('guest keeping state error: ', errorCode, errorMessage)
      })
  },
  logout ({ commit }) {
    const auth = getAuth()
    signOut(auth).then(() => {
      console.log('logout success')
      commit('setLoginStatus', false)
    }).catch((error) => {
      console.log('logout error', error)
    })
  },
  onAuth({ commit }) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      user = user ? user : {}
      commit('setUserUid', user.uid)
      commit('setUserName', user.displayName)
      commit('setLoginStatus', user.uid ? true : false)
      console.log('onAuth')
    })
  }
}

export const getters = {
  getLoggedIn(state) {
    return state.loggedIn
  },
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  }
}
