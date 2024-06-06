<script setup>
import { useAuthStore } from "@/stores/UserAuthStore";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const store = useAuthStore()
const isLogin = ref(true)

const credentials = reactive({
    email: "",
    password: "",
});

const loading = ref(false);
const loginErr = ref(null);


const onSubmit = async (isNew) => {

    loading.value = true;
    if (isNew) {
        const res = await store.createUser(credentials);

        if (res) {
            if (res.error) loginErr.value = res.message
        } else {
            router.push("/user-account")
        }
    } else {
        const res = await store.loginUser(credentials);
        console.log(res)
        if (res.error) {
            loginErr.value = res.message
        } else if (res.role === 'student') {
            router.push("/user-profile")
        } else {
            router.push("/librarian")
        }
    }
    loading.value = false;
};
</script>

<template>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 ">
        <div
            class="w-full bg-white rounded-lg border shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <a href="#" class="w-full flex justify-center mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="h-20 rounded-full shadow-md mr-2" src="/logo.png" alt="logo" />
            </a>
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-base sm:text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    {{ isLogin ? 'Sign in to your account' : 'Create an account' }}
                </h1>

                <form class="space-y-4 md:space-y-6">
                    <div class="flex items-center justify-center font-semibold p-2 mb-2 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                        role="alert" v-if="loginErr">
                        <div>{{ loginErr }}</div>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                            email</label>
                        <input type="email" name="email" id="email"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@company.com" required v-model="credentials.email" />
                    </div>
                    <div>
                        <label for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required v-model="credentials.password" />
                    </div>
                    <Button @click="onSubmit(isLogin ? false : true)" :label="isLogin ? 'Sign In' : 'Sign Up'"
                        class="w-full font-medium" :loading="loading"/>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400" v-if="isLogin">
                        Don’t have an account yet? <a @click.prevent="isLogin = !isLogin"
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                    </p>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400" v-else>
                        Already have an account? <a @click.prevent="isLogin = !isLogin"
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>