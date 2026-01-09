import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import About from '../views/AboutUsView.vue';
import Test from '../views/TestView.vue';
import SignUp from '../views/SignUpView.vue';
import Login from '../views/LoginView.vue';
import SettingsView from '../views/SettingsView.vue';
import AdminPanel from '@/views/AdminPanelView.vue';
import Comments from '../views/CommentsView.vue';
import Result from '@/views/ResultView.vue';
import ReportBug from '../views/BugRreportView.vue';
import VerifyEmail from '../views/VerifyEmailView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/signup', component: SignUp },
    { path: '/login', component: Login },
    { path: '/settings', component: SettingsView },
    { path: '/test', component: Test },
    { path: '/AdminPanel', component: AdminPanel },
    { path: '/comments', component: Comments },
    { path: '/result', component: Result },
    { path: '/reportBug', component: ReportBug },
    { path: '/verifyEmail', component: VerifyEmail},

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
