import { AUTH_COOKIE } from "@/features/auth/constants";
import { createAdminClient } from "@/lib/appwrite";

export default defineEventHandler(async (event) => {
    try {
        deleteCookie(event, AUTH_COOKIE);
        const { account } = await createAdminClient();
        account.deleteSession('current');

        return { success: true };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 