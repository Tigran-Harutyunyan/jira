import { createSessionClient } from "@/lib/appwrite";
import { type Workspace } from '@/features/workspaces/types';

const { DATABASE_ID, WORKSPACES_ID } = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    try {
        const { databases } = await createSessionClient(event);

        const params = event.context.params;

        const workspaceId = params && 'workspaceId' in params ? params.workspaceId : '';

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
        );

        return {
            $id: workspace.$id,
            name: workspace.name,
            imageUrl: workspace.imageUrl
        };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
}); 