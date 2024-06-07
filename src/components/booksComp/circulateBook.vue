<script setup>
import { ref, onMounted } from "vue";
import { CountryService } from "@/service/CountryService";

// const selectedCountry = ref();
const countries = ref();
const countrie = ref();
const selectedCountry = ref();
const selected = ref();
const filteredCountries = ref();

const search = (event) => {
    if (!event.query.trim().length) {
        filteredCountries.value = [...countries.value];
    } else {
        filteredCountries.value = countries.value.filter((country) => {
            return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
}


// const countries = ref([
//     { name: 'Australia', code: 'AU' },
//     { name: 'Brazil', code: 'BR' },
//     { name: 'China', code: 'CN' },
//     { name: 'Egypt', code: 'EG' },
//     { name: 'France', code: 'FR' },
//     { name: 'Germany', code: 'DE' },
//     { name: 'India', code: 'IN' },
//     { name: 'Japan', code: 'JP' },
//     { name: 'Spain', code: 'ES' },
//     { name: 'United States', code: 'US' }
// ]);

onMounted(() => {
    CountryService.getCountries().then((data) => (countries.value = data));
    CountryService.getCountries().then((data) => (countrie.value = data));
});
</script>

<template>
    <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-900">Student Name</label>
        <AutoComplete v-model="selectedCountry" optionLabel="name" :suggestions="filteredCountries" @complete="search"
            inputClass="w-full" :pt="{
                root: {
                    class: 'w-full'
                }
            }">
            <template #option="slotProps">
                <div class="flex align-options-center">
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </AutoComplete>
    </div>
    <div class="mb-4">
        <Dropdown v-model="selected" :options="countrie" filter optionLabel="name" placeholder="Select a book"
            class="w-full">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">    
                    <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex items-center">
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Dropdown>
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Borrow Book" severity="secondary"></Button>
        <Button type="button" label="Return Book" severity="secondary"></Button>
    </div>
</template>