import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUserSession } from '@/features/auth/composables/useUserSession';

export default defineNuxtRouteMiddleware(async () => {
    const { getSession } = await useUserSession();

    try {
        const { current } = await getSession();

        if (!current || !current.userId) {
            navigateTo('/sign-in');
        }
    } catch {
        return navigateTo('/sign-in');
    }
    return;
})