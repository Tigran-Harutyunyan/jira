export const useWorkspaceId = () => {
    const params = useRoute().params;
    return params.workspaceId as string;
};