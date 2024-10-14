import { useToast } from '@/components/ui/toast/use-toast'
import { createSessionClient } from "@/lib/appwrite";
import { type Models } from 'appwrite';

const current = ref<Models.Session | null>(null); // Reference to current user object

const { toast } = useToast();

const { account } = createSessionClient();

export const useUserSession = () => {
    const response = ref<ResponseType>();
    const isPending = ref(false);

    const register = async (name: string, email: string, password: string) => {
        try {
            isPending.value = true;

            response.value = await $fetch(`/api/auth/register`, {
                method: "post",
                body: {
                    name,
                    email,
                    password
                }
            });

            return response.value;

        } catch (error) {
            toast({
                title: error.message,
            });
        } finally {
            isPending.value = false;
        }
    }

    const login = async (email: string, password: string) => {
        try {
            isPending.value = true;

            response.value = await $fetch(`/api/auth/login`, {
                method: "post",
                body: {
                    email,
                    password
                }
            });

            if (response.value?.success) {
                toast({
                    title: 'Logged in',
                });
                navigateTo('/')
            }

        } catch (error) {
            toast({
                title: error.message,
            });
        } finally {
            isPending.value = false;
        }
    }

    const logout = async () => {
        try {
            isPending.value = true;

            response.value = await $fetch(`/api/auth/logout`, {
                method: "post",
            });

            if (response.value?.success) {
                navigateTo('/sign-in')
            }

        } catch (error) {
            toast({
                title: error.message,
            });
        } finally {
            isPending.value = false;
        }

    }

    const getSession = async () => {
        // Check if already logged in to initialize the store.

        await account?.getSession('current').then((user: Models.Session) => {
            current.value = user;
        });

        return {
            current: current.value
        };

    }

    return { isPending, current, register, login, logout, getSession }
};
