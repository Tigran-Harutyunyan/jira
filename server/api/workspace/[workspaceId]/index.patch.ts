import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { ID } from "node-appwrite";
import { type Workspace } from '@/features/workspaces/types';

const { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID, IMAGES_BUCKET_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const formData = await readFormData(event);
        const name = formData.get('name');
        const image = formData.get('image') ?? '';

        const { account, databases, storage } = await createSessionClient(event);

        const user = await account.get();

        const params = event.context.params;

        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

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
        } else {
            uploadedImageUrl = image;
        }

        const workspace = await databases.updateDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                name,
                imageUrl: uploadedImageUrl
            }
        );

        return { workspace };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 