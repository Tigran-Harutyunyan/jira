import { useToast } from "@/components/ui/toast/use-toast";

export function useToastMessage() {
  const { toast } = useToast();
  const showResponseError = (error: any) => {
    toast({
      title: error?.data?.statusMessage || error.message,
    });
  };
  return { showResponseError, toast };
}
