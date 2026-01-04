
import NotificationCard from '@/components/notificationCard.vue';
import notificationTypes from '@/enums/notificationTypes';
import { createApp } from 'vue';


export default function createNotification(notificationContent, notificationType = notificationTypes.Success, notificationDuration = 3000) {
  const card = createApp(NotificationCard, { message: notificationContent, visibilityTimer: notificationDuration, cardType: notificationType });
  const vm = card.mount(document.createElement('div')); // Mount the card inside of a div
  document.getElementById('notificationContainer').appendChild(vm.$el);

}
