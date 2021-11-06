import firebase from '@/plugin/firebase'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

export const state = () => ({
})
  
export const mutations = {
}

export const actions = {
    login() {
        console.log('login action')
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log('success : ' + user)
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('error : ' + errorCode)
            });
    }
}

export const getters = {
}
