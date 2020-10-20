import Vue from 'vue';
import App from './App.vue';
import ImageUploader from 'vue-image-upload-resize';

Vue.use(ImageUploader);

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount('#app');
