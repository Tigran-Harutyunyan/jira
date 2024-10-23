import { createSessionClient } from "@/lib/appwrite";
import { type Models } from 'appwrite';

const current = ref<Models.Session | null>(null); // Reference to current user object  
const { account } = createSessionClient();

export const useUserSession = () => {
    const isPending = ref(false);

    const getSession = async () => {
        // Check if already logged in to initialize the store. 
        await account?.getSession('current').then((user: Models.Session) => {
            current.value = user;
        });

        return {
            current: current.value
        };
    }

    return { isPending, current, getSession }
};
