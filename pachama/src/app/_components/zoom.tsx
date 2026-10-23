"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode } from "react";
import { MdClose, MdOpenInFull } from "react-icons/md";

/** A picture that opens bigger when clicked: a native modal dialog, so
 *  Escape and a click outside close it and focus comes back to the
 *  picture. Tall screens scroll inside it. */
export const Zoom = ({ src, alt, children }: { src: StaticImageData; alt: string; children: ReactNode }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label={`Enlarge: ${alt}`}
        onClick={() => dialog.current?.showModal()}
        className="group/zoom relative block w-full cursor-zoom-in rounded-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        {children}
        <span
          aria-hidden
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100"
        >
          <MdOpenInFull className="size-4" />
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[92dvh] w-[min(92vw,100rem)] max-w-none overflow-auto rounded-[12px] bg-white p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm open:motion-safe:animate-[zoom-open_0.4s_var(--ease-arrive)]"
      >
        <Image src={src} alt={alt} sizes="(min-width: 1740px) 1600px, 92vw" className="block h-auto w-full" />
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="fixed top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-ink shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MdClose aria-hidden className="size-6" />
        </button>
      </dialog>
    </>
  );
};
