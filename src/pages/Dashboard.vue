<template>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    <div class="grid grid-cols-4 gap-4 my-4">
        <div class="flex justify-between mb-3 border shadow shadow-2 p-3 border-round">
            <div>
                <span class="block text-xl font-medium mb-3">Student's</span>
                <div class="text-gray-900 font-medium text-lg">152</div>
            </div>
            <div class="flex items-center justify-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                <span class="material-icons-outlined text-primary-500 text-xl">
                    group
                </span>
            </div>
        </div>
        <div class="flex justify-between mb-3 border shadow shadow-2 p-3 border-round">
            <div>
                <span class="block text-xl font-medium mb-3">Book's</span>
                <div class="text-gray-900 font-medium text-lg">2451</div>
            </div>
            <div class="flex items-center justify-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                <span class="material-icons-outlined text-primary-500 text-xl">
                    library_books
                </span>
            </div>
        </div>
        <div class="flex justify-between mb-3 border shadow shadow-2 p-3 border-round">
            <div>
                <span class="block text-xl font-medium mb-3">Borrowed Books</span>
                <div class="text-gray-900 font-medium text-lg">2</div>
            </div>
            <div class="flex items-center justify-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                <span class="material-icons-outlined text-primary-500 text-xl">
                    book
                </span>
            </div>
        </div>
        <div class="flex justify-between mb-3 border shadow shadow-2 p-3 border-round">
            <div>
                <span class="block text-xl font-medium mb-3">Book's Returned today</span>
                <div class="text-gray-900 font-medium text-lg">0</div>
            </div>
            <div class="flex items-center justify-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                <span class="material-icons-outlined text-primary-500 text-xl">
                    book
                </span>
            </div>
        </div>
    </div>

    <div class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
        <p class="text-2xl text-gray-400 dark:text-gray-500">
            carousel
        </p>
    </div>
</template>