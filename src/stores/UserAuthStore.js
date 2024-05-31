import {
    getAuth, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { defineStore } from "pinia";
  import { auth } from "./firebase";
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  export const useAuthStore = defineStore("authStore", () => {
    const user = ref({});
    const router = useRouter();
    // const isLoading = ref(true);

    const init = () => {
      onAuthStateChanged(auth, (userDetails) => {
        console.log(userDetails);
        if (userDetails) {
          const uid = userDetails.uid;
          user.value = {
            email: userDetails.email,
            uid,
          };
        //   router.push( "/dashboard" );
        } else {
          // isLoading.value = false;
          user.value = {};
        //   router.replace({ name: "signin" });         
        }
        // isLoading.value = true;
      });
    };

    const isAuthenticated = () => {
      // Check if user is defined
      if (!user.value) {
        return false;
      }

      // Check if email is defined and not null
      return Boolean(user.value.email);
    };

    const createUser = async (credentials) => {
        const errMsg = ref()
          try {
            await createUserWithEmailAndPassword(getAuth(), credentials.email, credentials.password);
            console.log("Account created successfuly");

          } catch(error){
                switch (error.code) {
                    case 'auth/invalid-email':
                        errMsg.value = "Invalid email"
                        break;
                    case 'auth/email-already-in-use':
                        errMsg.value = "Email already in use"
                        break;
                    case 'auth/weak-password':
                        errMsg.value = "weak password"
                        break;
                    case 'auth/missing-password':
                        errMsg.value = "password must not be empty"
                        break;
                    default:
                        break;
                    }
                    
                return { error: true, message: errMsg }
          };
    }

    const loginUser = async (credentials) => {
      try {
        const userCredentials = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        // for debugging
        // console.log(userCredentials.user);
      } catch (err) {
        const errCode = err.code;
        let errMessage;

        switch (errCode) {
          case "auth/invalid-email":
            errMessage = "Email is invalid";
            break;
          case "auth/user-not-found":
            errMessage = "User is not registered.";
            break;
          case "auth/wrong-password":
            errMessage = "Wrong password.";
            break;
          case "auth/invalid-credential":
            errMessage = "Incorrect email or password";
            break;
          default:
            console.log(err.code);
            errMessage = "Unknown error";
        }

        return { error: true, message: errMessage }
      }
    };


    const logoutUser = async () => {
      try {
        // isLoading.value = true;
        await signOut(auth);
        // isLoading.value = false;
        console.log("User logged out successfully");
      } catch (err) {
        console.error("Error logging out:", err);
      }
      
    };

    return {
        createUser,
        loginUser,
        logoutUser,
        init,
        user,
        // isLoading,
        isAuthenticated
    };
  });