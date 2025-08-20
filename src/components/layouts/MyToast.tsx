import
    {
        Loader2Icon,
        SquareActivityIcon,
        SquareCheckBig,
        TriangleAlert,
        XCircle,
        XIcon,
    } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export type ToastType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "danger"
  | "loading";

interface CustomToastOptions {
  message: string;
  type?: ToastType;
  onConfirm?: () => void;
  onCancel?: () => void;
  duration?: number;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export function useMyToast() {
  // Default icons
  const defaultIcons: Record<ToastType, React.ReactNode> = {
    success: <SquareCheckBig className="text-white" size={24} />,
    warning: <TriangleAlert className="text-white" size={24} />,
    error: <XCircle className="text-white" size={24} />,
    info: <SquareActivityIcon className="text-white" size={24} />,
    danger: <XIcon className="text-white" size={24} />,
    loading: <Loader2Icon className="text-violet-800 animate-spin" size={24} />,
  };

  // Default gradient glass styles
  const gradientGlassStyle = (type: ToastType): React.CSSProperties => {
    const gradients: Record<ToastType, string> = {
      success:
        "linear-gradient(135deg, rgba(46, 204, 112, 0.486) 0%, rgba(39, 174, 96, 0.4) 100%)",
      warning:
        "linear-gradient(135deg, rgba(243, 202, 18, 0.491) 0%, rgba(211, 84, 0, 0.4) 100%)",
      error:
        "linear-gradient(135deg, rgba(230, 44, 23, 0.52) 0%, rgba(192, 57, 43, 0.4) 100%)",
      info:
        "linear-gradient(135deg, rgba(52, 211, 219, 0.476) 0%, rgba(41, 128, 185, 0.4) 100%)",
      danger:
        "linear-gradient(135deg, rgba(168, 16, 41, 0.646) 0%, rgba(90, 13, 30, 0.4) 100%)",
      loading:
        "linear-gradient(135deg, rgba(138, 40, 112, 0.646) 0%, rgba(103, 11, 74, 0.4) 100%)",
    };

    return {
      background: gradients[type],
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(10px) saturate(180%)",
      borderRadius: 20,
      border: "1.5px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
      color: "#fff",
      fontWeight: 600,
      padding: "14px 22px",
      maxWidth: 420,
      display: "flex",
      alignItems: "center",
      gap: 14,
      overflow: "hidden",
      cursor: "default",
    };
  };

  // Show toast
  const showToast = ({
    message,
    type = "info",
    onConfirm,
    onCancel,
    duration,
    icon,
    style,
  }: CustomToastOptions) => {
    // Danger type with confirmation buttons
    if (type === "danger" && (onConfirm || onCancel)) {
      return toast.custom(
        ({ id }) => (
          <div
            style={{
              ...gradientGlassStyle(type),
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
              }}
            >
              {icon || defaultIcons[type]}
              <span>{message}</span>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                gap: 12,
              }}
            >
              <button
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: 12,
                  padding: "8px 20px",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => {
                  toast.dismiss(id);
                  onConfirm?.();
                }}
              >
                Confirm
              </button>

              <button
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 12,
                  padding: "8px 20px",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => {
                  toast.dismiss(id);
                  onCancel?.();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: duration || 10000 }
      );
    }

    // Normal toast
    return toast(message, {
      icon: icon || defaultIcons[type],
      style: style || gradientGlassStyle(type),
      duration: duration || 4500,
    });
  };

  // Update an existing toast (useful for loading → success)
  const updateToast = (
    id: string,
    { message, type = "info", icon, style, duration }: Partial<CustomToastOptions>
  ) => {
    toast(message || "", {
      id,
      icon: icon || defaultIcons[type],
      style: style || gradientGlassStyle(type),
      duration: duration || 4500,
    });
  };

  // Dismiss toast
  const dismissToast = (id?: string) => {
    toast.dismiss(id);
  };

  return { showToast, updateToast, dismissToast };
}