import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { ID } from "node-appwrite";

export default defineEventHandler(async (event) => {
    const { name, email, password } = await readBody(event);

    try {
        const { account } = await createAdminClient();

        await account.create(
            ID.unique(),
            email,
            password,
            name,
        );

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