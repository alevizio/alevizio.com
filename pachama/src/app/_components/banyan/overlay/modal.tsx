"use client";

import { useId, useRef, type ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";
import { BN } from "../ui";
import { GLASS } from "./glass";

/* Banyan's modal: glass with 16px corners and 24px padding, a title in
 * Matter Medium 24/32 with a close button, the body in 16/24, and one, two
 * or three buttons on the right (tertiary, secondary, primary). The page
 * behind fades to 80% white. Built on <dialog>: Escape closes it and focus
 * goes back to whatever opened it. */
type ModalSize = "sm" | "md" | "lg" | "xl";

const WIDTH: Record<ModalSize, string> = {
  sm: "w-[28rem]", // 448
  md: "w-[38rem]", // 608
  lg: "w-[48rem]", // 768
  xl: "w-[72rem]", // 1152
};

/** The panel on its own: what the dialog shows, also used as a still. */
export const ModalPanel = ({
  title,
  titleId,
  onClose,
  actions,
  children,
  className,
}: {
  title: string;
  titleId?: string;
  onClose?: () => void;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4 rounded-2xl p-6 text-bn-heavy", GLASS, className)}>
    <div className="flex items-center gap-2.5 py-1">
      <h4 id={titleId} className="flex-1 text-[24px] leading-8 font-medium">
        {title}
      </h4>
      <button type="button" aria-label="Close" onClick={onClose} className={cn("-my-3 -mr-3 grid place-items-center rounded-2xl p-3 hover:bg-bn-glass-2/60", BN.focus)}>
        <MdClose aria-hidden className="size-6" />
      </button>
    </div>
    <div className="text-[16px] leading-6">{children}</div>
    {actions ? <div className="flex flex-wrap justify-end gap-2">{actions}</div> : null}
  </div>
);

/** A button that opens a modal. Any button in its footer finishes the job
 *  and closes it. */
export const ModalDemo = ({
  open: openLabel,
  title,
  size = "sm",
  actions,
  children,
}: {
  open: string;
  title: string;
  size?: ModalSize;
  actions: ReactNode;
  children: ReactNode;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <Button hierarchy="secondary" size="sm" onClick={() => dialog.current?.showModal()}>
        {openLabel}
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className={cn("m-auto max-w-[calc(100vw-2rem)] overflow-visible border-0 bg-transparent p-0 text-bn-heavy backdrop:bg-white/80 backdrop:backdrop-blur-[2px]", WIDTH[size])}
      >
        <ModalPanel
          title={title}
          titleId={titleId}
          onClose={() => dialog.current?.close()}
          actions={
            <div className="contents" onClick={(e) => e.target instanceof Element && e.target.closest("button") && dialog.current?.close()}>
              {actions}
            </div>
          }
        >
          {children}
        </ModalPanel>
      </dialog>
    </>
  );
};
