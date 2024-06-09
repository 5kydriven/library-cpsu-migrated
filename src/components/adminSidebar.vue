<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

const transactions = ref([
    {
        label: 'Transactions',
        icon: 'sync_alt',
        items: [
            {
                label: 'Borrowed Books',
                route: '/borrow-books'
            },
            {
                label: 'Returned Books',
                route: '/return-books'
            }
        ]
    }
]);

// const books = ref([
//     {
//         label: 'Books',
//         icon: 'library_books',
//         items: [
//             {
//                 label: 'Book List',
//                 route: '/books-list'
//             },
//             {
//                 label: 'Books Location',
//                 route: '/books-location'
//             }
//         ]
//     }
// ]);
</script>

<template>
    <aside id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul class="space-y-2 font-medium">
                <li>
                    <RouterLink to="/librarian"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="material-icons-outlined">
                            home
                        </span>
                        <span class="ms-3">Dashboard</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/students-list"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="material-icons-outlined">
                            people
                        </span>
                        <span class="flex-1 ms-3 whitespace-nowrap">Students</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/students-list"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="material-icons-outlined">
                            library_books
                        </span>
                        <span class="flex-1 ms-3 whitespace-nowrap">Books</span>
                    </RouterLink>
                    <!-- <PanelMenu :model="books">
                        <template #item="{ item }">
                            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    :href="href" @click="navigate">
                                    <span :class="item.icon" />
                                    <span class="ml-2 text-color">{{ item.label }}</span>
                                </a>
                            </router-link>
                            <a v-else
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                :href="item.url" :target="item.target">
                                <span class="material-icons">{{ item.icon }}</span>
                                <span class="ml-2">{{ item.label }}</span>
                                <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
                            </a>
                        </template>
                    </PanelMenu> -->
                </li>
                <li>
                    <RouterLink to="/student-logs"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="material-icons-outlined">
                            list_alt
                        </span>
                        <span class="flex-1 ms-3 whitespace-nowrap">Log's</span>
                    </RouterLink>
                </li>
                <li>
                    <PanelMenu :model="transactions">
                        <template #item="{ item }">
                            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    :href="href" @click="navigate">
                                    <span :class="item.icon" />
                                    <span class="ml-2 text-color">{{ item.label }}</span>
                                </a>
                            </router-link>
                            <a v-else
                                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                :href="item.url" :target="item.target">
                                <span class="material-icons-outlined">{{item.icon}}</span>
                                <span class="ml-2">{{ item.label }}</span>
                                <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
                            </a>
                        </template>
                    </PanelMenu>
                </li>
            </ul>
        </div>
    </aside>
</template>