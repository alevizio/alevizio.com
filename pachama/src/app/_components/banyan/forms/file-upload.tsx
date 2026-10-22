"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { MdErrorOutline, MdOutlineCloudUpload } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";

/* Banyan's File Upload: a dashed drop zone, a progress bar while it
 * uploads, the image filling the zone when it's done, and Replace image.
 * Nothing is sent anywhere: the file stays in this tab as an object URL. */
const LIMIT = 1024 * 1024;
type Status = "empty" | "uploading" | "done" | "error";

export const FileUpload = ({ label = "Upload image", className }: { label?: string; className?: string }) => {
  const ids = useId();
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const [status, setStatus] = useState<Status>("empty");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<{ name: string; url: string }>();
  const [error, setError] = useState("");

  // Let go of the object URL when it's replaced, and of the timer on unmount.
  useEffect(() => {
    if (!file) return;
    return () => URL.revokeObjectURL(file.url);
  }, [file]);
  useEffect(() => () => clearInterval(timer.current), []);

  const fail = (message: string) => {
    setError(message);
    setStatus("error");
  };

  const take = (picked: File | undefined) => {
    if (!picked) return;
    clearInterval(timer.current);
    if (!picked.type.startsWith("image/")) return fail(`${picked.name} isn't an image. Try a PNG or an SVG.`);
    if (picked.size > LIMIT) return fail(`${picked.name} is ${(picked.size / LIMIT).toFixed(1)} MB; the limit is 1 MB.`);
    setFile({ name: picked.name, url: URL.createObjectURL(picked) });
    setStatus("uploading");
    setProgress(0);
    let done = 0;
    timer.current = setInterval(() => {
      done += 10;
      setProgress(done);
      if (done < 100) return;
      clearInterval(timer.current);
      setStatus("done");
    }, 90);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    take(e.dataTransfer.files[0]);
  };

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-1", className)}>
      <span id={`${ids}label`} className="text-xs leading-4 text-bn-heavy">
        {label}
      </span>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex h-60 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-dashed border-bn-medium bg-white/30 px-6 text-center text-bn-heavy",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bn-heavy",
          dragging && "border-solid border-bn-heavy bg-bn-green-lightest",
          status === "error" && "border-bn-red",
          status === "done" && "border-transparent",
        )}
      >
        <input
          ref={input}
          type="file"
          accept="image/*"
          aria-labelledby={`${ids}label`}
          aria-describedby={`${ids}hint`}
          onChange={(e) => {
            take(e.target.files?.[0]);
            e.target.value = "";
          }}
          className="sr-only"
        />
        {status === "done" && file ? (
          // eslint-disable-next-line @next/next/no-img-element -- a local object URL, not a site image
          <img src={file.url} alt={`Preview of ${file.name}`} className="absolute inset-0 size-full object-cover" />
        ) : status === "uploading" ? (
          <>
            <MdOutlineCloudUpload aria-hidden className="size-6" />
            <span className="text-sm leading-5 font-medium">Uploading…</span>
            <progress
              value={progress}
              max={100}
              aria-label={`Uploading ${file?.name ?? "file"}`}
              className="mt-2 h-1 w-48 appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-bn-green [&::-webkit-progress-bar]:bg-bn-grey-light [&::-webkit-progress-value]:bg-bn-green"
            />
          </>
        ) : (
          <>
            {status === "error" ? <MdErrorOutline aria-hidden className="size-6 text-bn-red" /> : <MdOutlineCloudUpload aria-hidden className="size-6" />}
            <span className="text-sm leading-5 font-medium">
              Drop files to attach or <span className="underline">browse</span>
            </span>
            <span id={`${ids}hint`} className={cn("max-w-xs text-xs leading-4", status === "error" ? "text-bn-red-dark" : "text-bn-medium")}>
              {status === "error" ? error : "PNG or SVG, transparent background, 200 × 300 px or smaller, up to 1 MB"}
            </span>
          </>
        )}
      </label>
      <div className="mt-2 flex items-center gap-3">
        {status === "done" ? (
          <Button hierarchy="secondary" size="sm" onClick={() => input.current?.click()}>
            Replace image
          </Button>
        ) : (
          <Button hierarchy="secondary" size="sm" disabled={status !== "empty" && status !== "error"} onClick={() => input.current?.click()}>
            Choose file
          </Button>
        )}
        <p aria-live="polite" className="text-xs leading-4 text-bn-medium">
          {status === "done" && file ? `${file.name}, ready. It stays in this tab.` : ""}
        </p>
      </div>
    </div>
  );
};
