import { createSessionClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";

const runtimeConfig = useRuntimeConfig();

const DATABASE_ID = runtimeConfig.APPWRITE_DATABASE_ID;
const WORKSPACES_ID = runtimeConfig.public.appwrite.APPWRITE_WORKSPACES_ID;
const IMAGES_BUCKET_ID = runtimeConfig.public.appwrite.APPWRITE_IMAGES_BUCKET_ID;

export default defineEventHandler(async (event) => {
    const { image, name } = await readBody(event);

    try {
        const { account, databases, storage } = await createSessionClient(event);

        const user = await account.get();

        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {

            const file = await storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                image,
            );

            const arrayBuffer = await storage.getFilePreview(
                IMAGES_BUCKET_ID,
                file.$id,
            );

            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        }

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
                imageUrl: uploadedImageUrl,
                inviteCode: generateInviteCode(6),
            },
        );

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                userId: user.$id,
                workspaceId: workspace.$id,
                role: MemberRole.ADMIN,
            },
        );

        return { workspace };



    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 