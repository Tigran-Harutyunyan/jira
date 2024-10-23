import { createSessionClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { Query } from "node-appwrite";

const { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, MEMBERS_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const formData = await readFormData(event);
    const name = formData.get('name');
    const image = formData.get('image');
    const workspaceId = formData.get('workspaceId');

    try {
        const { account, databases, storage } = await createSessionClient(event);

        const user = await account.get();

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [
                Query.equal("workspaceId", workspaceId),
                Query.equal("userId", user.$id)
            ]
        );

        if (!members.documents[0]) {
            return createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            });
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
        }

        const project = await databases.createDocument(
            DATABASE_ID,
            PROJECTS_ID,
            ID.unique(),
            {
                name,
                imageUrl: uploadedImageUrl,
                workspaceId
            },
        );

        return { ...project };


    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 