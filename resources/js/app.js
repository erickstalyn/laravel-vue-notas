
require('./bootstrap');

window.Vue = require('vue');


Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('notas', require('./components/NotasComponent.vue').default);


const app = new Vue({
    el: '#app',
});
