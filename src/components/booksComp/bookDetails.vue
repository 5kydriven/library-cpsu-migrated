<script setup>
import { ref } from 'vue';

const props = defineProps({
    book: Object
});

</script>
<template>
    <div>{{ props.book.title }}</div>
    <div>{{ props.book.isbn }}</div>
    <div>{{ props.book.price }}</div>
    <div>{{ props.book.notes }}</div>
    <div>{{ props.book.accountNumber }}</div>
    <div>{{ props.book.college }}</div>
    <div>{{ props.book.bibliography }}</div>
    <div>{{ props.book.copyright }}</div>
    <div>{{ props.book.additionalTitle }}</div>
    <div>{{ props.book.subArea }}</div>
    <div>{{ props.book.author }}</div>
    <div>{{ props.book.dealer }}</div>
    <div>{{ props.book.price }}</div>
    <div>{{ props.book.volume }}</div>
    <div>{{ props.book.callNumber }}</div>
    <div>{{ props.book.section }}</div>
    <div>{{ props.book.additionalSubject }}</div>
    <div>{{ props.book.publisher }}</div>
    <div>{{ props.book.pubPlace }}</div>
    <div>{{ props.book.totalPrice }}</div>
    <div>{{ props.book.title }}</div>
    <div>{{ props.book.remarks }}</div>
    <div>{{ props.book.addedEntryTitle }}</div>
</template>