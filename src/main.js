import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import Vue3Lottie from 'vue3-lottie';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vue3Lottie);
app.mount('#app');
