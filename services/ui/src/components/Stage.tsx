import type { ReactNode } from "react";

type StageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Stage constrains slide content to the same safe area that viewers will see in presentation mode.
 * Keeping this shared wrapper ensures the editor, presenter view, and exported slides render identically.
 */
export function Stage({ children, className }: StageProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 justify-center px-6 py-6 md:px-8 lg:px-10">
      <div className={`flex w-full flex-1 flex-col ${className ?? ""}`}>
        {children}
      </div>
    </div>
  );
}
