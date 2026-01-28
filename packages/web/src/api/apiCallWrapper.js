import notificationTypes from '@/enums/notificationTypes';
import createNotification from '@/notification/notification';

export default async function apiCallWrapper(apiCall) {
  let response = {};
  try {
    response = await apiCall();
    if (response.data.msg) {
      createNotification(response.data.msg, notificationTypes.Success, 5);
    }
  } catch (error) {
    createNotification(error.response.data.msg, notificationTypes.Error, 5);
    return error.response;
  }

  return response;
}
