import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type AlertType = "info" | "success" | "warning" | "error";

interface Alert {
  id: string;
  message: string;
  type: AlertType;
  modal?: boolean;
}

interface AlertContextValue {
  showAlert: (message: string, type?: AlertType, modal?: boolean) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback(
    (message: string, type: AlertType = "info", modal: boolean = false) => {
      const id = Math.random().toString(36).substring(7);
      setAlerts((prev) => [...prev, { id, message, type, modal }]);

      // Auto-dismiss toast alerts after 5 seconds (not modals)
      if (!modal) {
        setTimeout(() => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, 5000);
      }
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const toastAlerts = alerts.filter((a) => !a.modal);
  const modalAlerts = alerts.filter((a) => a.modal);

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getAlertColors = (type: AlertType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          icon: "text-emerald-400",
          text: "text-emerald-100",
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
        };
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: "text-red-400",
          text: "text-red-100",
          glow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
        };
      case "warning":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          icon: "text-amber-400",
          text: "text-amber-100",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
        };
      default:
        return {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          icon: "text-cyan-400",
          text: "text-cyan-100",
          glow: "shadow-[0_0_30px_rgba(6,182,212,0.4)]",
        };
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toastAlerts.map((alert) => {
          const colors = getAlertColors(alert.type);
          return (
            <div
              key={alert.id}
              className={`
                pointer-events-auto
                ${colors.bg} ${colors.border} ${colors.glow}
                backdrop-blur-xl border rounded-xl
                px-5 py-4 min-w-[340px] max-w-md
                transition-all duration-200 hover:scale-[1.02]
              `}
              style={{
                animation: "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${colors.icon} mt-0.5`}>
                  {getAlertIcon(alert.type)}
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${colors.text} leading-relaxed`}
                >
                  {alert.message}
                </span>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className={`flex-shrink-0 ${colors.icon} hover:opacity-70 transition-opacity -mt-1`}
                  aria-label="Close"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Alerts */}
      {modalAlerts.map((alert) => {
        const colors = getAlertColors(alert.type);
        return (
          <div
            key={alert.id}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => removeAlert(alert.id)}
            />

            {/* Modal */}
            <div
              className={`
                relative
                ${colors.bg} ${colors.border} ${colors.glow}
                backdrop-blur-xl border-2 rounded-2xl
                p-8 max-w-md w-full
              `}
              style={{
                animation:
                  "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {/* Icon */}
              <div className={`flex justify-center mb-5 ${colors.icon}`}>
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="scale-[2.5]">{getAlertIcon(alert.type)}</div>
                </div>
              </div>

              {/* Message */}
              <p
                className={`text-center text-lg font-semibold mb-8 ${colors.text} leading-relaxed`}
              >
                {alert.message}
              </p>

              {/* Dismiss Button */}
              <button
                onClick={() => removeAlert(alert.id)}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-semibold text-base
                  ${colors.bg} ${colors.border} ${colors.text}
                  border-2 backdrop-blur-xl
                  hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  ${colors.glow}
                `}
              >
                Got it
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(calc(100% + 24px));
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </AlertContext.Provider>
  );
}
