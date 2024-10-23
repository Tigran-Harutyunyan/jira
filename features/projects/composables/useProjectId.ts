export const useProjectId = () => {
  const params = useRoute().params;
  return params.projectId as string;
};
