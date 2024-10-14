import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event);

    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(
            email,
            password,
        );

        setCookie(event, AUTH_COOKIE, session.secret, {
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        })

        return { success: true };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }

}); 