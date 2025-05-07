
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Export the original useToast hook
const useToast = useHookToast;

// Add variant methods to the toast function
const toast = (props: ToastProps) => {
  return hookToast(props);
};

// Add variant methods to the toast object
toast.success = (props: Omit<ToastProps, "variant">) => {
  return hookToast({ ...props, variant: "default" });
};

toast.error = (props: Omit<ToastProps, "variant">) => {
  return hookToast({ ...props, variant: "destructive" });
};

toast.warning = (props: Omit<ToastProps, "variant">) => {
  return hookToast({ ...props, variant: "default" });
};

toast.info = (props: Omit<ToastProps, "variant">) => {
  return hookToast({ ...props, variant: "default" });
};

export { useToast, toast };
export type { ToastActionElement, ToastProps };
