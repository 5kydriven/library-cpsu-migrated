import { ref } from "vue";
export function formatDate() {
    const dateFormat = ref()
    let date = new Date();
    date = new Date(date);

    let month = date.getMonth() + 1; 
    let day = date.getDate();
    let year = date.getFullYear();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    dateFormat.value = `${month}/${day}/${year}`
    
    return {dateFormat};
}

