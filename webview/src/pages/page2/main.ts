import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './App.vue';
import { createVue } from '../../base';

createVue(App, (app)=> {
    app.use(ElementPlus)
})
