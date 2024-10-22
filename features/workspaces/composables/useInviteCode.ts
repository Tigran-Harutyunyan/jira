export const useInviteCode = () => {
  const params = useRoute().params;
  return params.inviteCode as string;
};
