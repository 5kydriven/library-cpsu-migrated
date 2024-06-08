import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeAndDate = defineStore('dateAndTime', () =>{
    
    const getCurrentTime = () =>{
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight

        // Add leading zeroes if necessary
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        const currentTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
        const currentTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

        return { currentTime, currentTimeInSeconds };
    }
    
    
    const getCurrentDate = () =>{
        const currentDate = ref()
        let date = new Date();
    
        // Extract month, day, and year
        let month = date.toLocaleString('default', { month: 'long' });
        let day = date.getDate();
        let year = date.getFullYear();
        currentDate.value = month + ' ' + day + ', ' + year
        return {
            currentDate
        }
    
    }

    return{
        getCurrentTime,
        getCurrentDate
    }
})