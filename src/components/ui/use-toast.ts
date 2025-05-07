
import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Export the original useToast hook
const useToast = useHookToast;

// Define a type for the toast function with variants
type ToastFunction = {
  (props: ToastProps): { id: string; dismiss: () => void; update: (props: any) => void };
  success: (props: Omit<ToastProps, "variant">) => { id: string; dismiss: () => void; update: (props: any) => void };
  error: (props: Omit<ToastProps, "variant">) => { id: string; dismiss: () => void; update: (props: any) => void };
  warning: (props: Omit<ToastProps, "variant">) => { id: string; dismiss: () => void; update: (props: any) => void };
  info: (props: Omit<ToastProps, "variant">) => { id: string; dismiss: () => void; update: (props: any) => void };
};

// Create the base toast function
const toast = ((props: ToastProps) => {
  return hookToast(props);
}) as ToastFunction;

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
