import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { defineStore } from "pinia";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const router = useRouter();
  // const isLoading = ref(true);

  const handleAuthState = () => {
    onAuthStateChanged(auth, async (userDetails) => {
      if (userDetails) {
        const uid = userDetails.uid;
        const docSnap = await getDoc(doc(db, "accountRoles", uid));
        const role = docSnap.data().role;
        user.value = {
          email: userDetails.email,
          uid,
          role
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      // console.log(user.uid)
      await setDoc(doc(db, "accountRoles", userCredential.user.uid), { role: 'student' });
      console.log("Account created successfuly");
    } catch (error) {
      console.log(error)
      let errMsg;
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg = "Invalid email"
          break;
        case 'auth/email-already-in-use':
          errMsg = "Email already in use"
          break;
        case 'auth/weak-password':
          errMsg = "weak password"
          break;
        case 'auth/missing-password':
          errMsg = "password must not be empty"
          break;
        default:
          break;
      }

      return { error: true, message: errMsg }
    };
  }

  const loginUser = async (credentials) => {
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      // Get the user's role from Firestore
      const docSnap = await getDoc(doc(db, "accountRoles", user.uid));

      const role = docSnap.data().role;
      // console.log(role)
      // Return the role
      return { role: role };
    } catch (err) {
      const errCode = err.code;
      console.log(err);
      let errMessage;

      // Handle different authentication errors
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
          errMessage = "Unknown error";
      }
      return { error: true, message: errMessage };
    }
  };



  const logoutUser = async () => {
    try {
      // isLoading.value = true;
      await signOut(auth);
      // isLoading.value = false;
      router.push("/")
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Error logging out:", err);
    }

  };

  return {
    createUser,
    loginUser,
    logoutUser,
    handleAuthState,
    user,
    // isLoading,
    isAuthenticated
  };
});