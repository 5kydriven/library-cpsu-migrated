import './assets/main.css';
import PrimeVue from 'primevue/config';
import aura from './presets/aura';
import 'material-icons/iconfont/material-icons.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// components
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import OverlayPanel from 'primevue/overlaypanel';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Dialog from 'primevue/dialog';
import InputMask from 'primevue/inputmask';
import PanelMenu from 'primevue/panelmenu';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Skeleton from 'primevue/skeleton';
import Carousel from 'primevue/carousel';
import FileUpload from 'primevue/fileupload';

const app = createApp(App)

app.component('InputMask', InputMask)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Row', Row)
app.component('Calendar', Calendar)
app.component('InputNumber', InputNumber)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('MultiSelect', MultiSelect)
app.component('Button', Button)
app.component('ProgressBar', ProgressBar)
app.component('Tag', Tag)
app.component('Dropdown', Dropdown)
app.component('Slider', Slider)
app.component('OverlayPanel', OverlayPanel)
app.component('Toast', Toast)
app.component('Dialog', Dialog)
app.component('PanelMenu', PanelMenu)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Skeleton', Skeleton)
app.component('Carousel', Carousel)
app.component('FileUpload', FileUpload)

app.use(PrimeVue, {
    unstyled: true,
    pt: aura,
});

app.use(ToastService);
app.use(createPinia())
app.use(router)

app.mount('#app')
