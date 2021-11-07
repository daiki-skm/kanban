import { GoogleAuthProvider, getAuth, signInWithPopup, setPersistence, browserSessionPersistence, onAuthStateChanged, signOut } from "firebase/auth"

export const state = () => ({
    loggedIn: false,
    userUid: '',
    userName: ''
})
  
export const mutations = {
    setLoginStatus(state, loggedIn) { // 認証状態を双方向に変化
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
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        await signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log('success : ' + user.uid + ' : ' + user.displayName)
                commit('setUserUid', user.uid)
                commit('setUserName', user.displayName)
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('error : ', errorCode)
            });

        await setPersistence(auth, browserSessionPersistence)
            .then(() => {
                console.log('Initialized!')
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    },
    logout ({ commit }) {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('logout')
        }).catch((error) => {
            console.log('logout error')
        });
    },
    onAuth({ commit }) {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            user = user ? user : {}
            commit('setUserUid', user.uid)
            commit('setUserName', user.displayName)
            commit('setLoginStatus', user.uid ? true : false)
        });
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
