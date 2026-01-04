/**
 *  // Check if the user is logged in by checking if he has the cookie isLoggedIn and its value is true
 * @returns {boolean} If the user is logged in
 */
function isLoggedIn() {
  const cookies = document.cookie.split(';');
  const isLoggedInCookie = cookies.find(cookie => cookie.trim().startsWith('isLoggedIn='));
  return isLoggedInCookie;
}

export default isLoggedIn;