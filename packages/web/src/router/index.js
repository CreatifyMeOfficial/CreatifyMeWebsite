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
import VerifyEmail from '../views/VerifyEmailView.vue';
import SettingsPage from '../components/settingsPage.vue';
import ProfilePage from '../components/profilePage.vue';
import PersonalitiesPage from '@/components/personalitiesPage.vue';
import TagsPage from '@/components/TagsPage.vue';
import CreateQuestionPage from '@/components/createQuestionPage.vue';
import QuestionsPage from '@/components/questionsPage.vue';
import UsersPage from '@/components/usersPage.vue';

import resetPassword from '@/views/ResetPassword.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home , meta: {
      title: 'Home page',
      description: 'A leading Arab platform that provides you with tools and assessments to discover and develop your true passion, offers you a personal development plan, and connects your unique skills with the best job opportunities that match your personality and capabilities. Start your professional journey from your point of passion.'
    } },
    { path: '/about', component: About , meta: {
      title: 'About page',
      description: 'A leading Arab platform that provides you with tools and assessments to discover and develop your true passion, offers you a personal development plan, and connects your unique skills with the best job opportunities that match your personality and capabilities. Start your professional journey from your point of passion.'
    } },
    { path: '/signup', component: SignUp , meta: {
      title: 'SignUp page',
      description: 'Join us and start your passion discovery journey! Register now on the leading Arab platform to discover your talents, develop your skills, and access real job opportunities that match your personality and passion.'
    } },
    { path: '/login', component: Login , meta: {
      title: 'Login page',
      description: 'Join us and start your passion discovery journey! Register now on the leading Arab platform to discover your talents, develop your skills, and access real job opportunities that match your personality and passion.'
    } },
    {
      path: '/settings',
      component: SettingsView,
      children: [
        { path: '', component: SettingsPage },       // /settings
        { path: 'profile', component: ProfilePage }  // /settings/profile
      ]
    },
    { path: '/resetPassword', component: resetPassword },
    { path: '/test', component: Test , meta: {
      title: 'Test page',
      description: 'Passion & Skills Test | Discover Your Talents - Test yourself for free with our platform to identify your true passion, strengths, and suitable careers for your personality. Get a personal development plan.'
    }},
    {
      path: '/AdminPanel',
      component: AdminPanel,
      children: [
        { path: '', component: UsersPage },
        { path: 'questions', component: QuestionsPage },
        { path: 'createQuestion', component: CreateQuestionPage },
        { path: 'tags', component: TagsPage },
        { path: 'personalities', component: PersonalitiesPage },
      ]
    },
    { path: '/comments', component: Comments },
    { path: '/result', component: Result },
    { path: '/reportBug', component: ReportBug },
    { path: '/verifyEmail', component: VerifyEmail },

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
