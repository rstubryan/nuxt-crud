export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie('auth_token');

  if (authToken.value && to.path === '/login') {
    return navigateTo('/dashboard');
  }

  if (!authToken.value && to.path === '/dashboard') {
    return navigateTo('/login');
  }
});