import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "./cn";

/* A Slack artifact embedded in the cream world: deliberately NOT in the
 * Messa fonts — it renders in the system stack, like a real client would.
 * Colors are Slack's own (#1D1C1D ink, #1264A3 thread blue, #616061 meta).
 * Avatars are gradient placeholders (drop real photos in later via
 * `avatarClassName`). Rows highlight on hover, consecutive messages from one
 * author group, and threads/last-reply read like the real app. */

export type SlackReaction = {
  emoji: string;
  count: number;
  /** Renders in the "you reacted" blue pill style. */
  mine?: boolean;
};

export type SlackFace = {
  /** Avatar letter — the fallback when no photo is set. */
  initial: string;
  /** Tailwind classes for the avatar tile (the gradient fallback). */
  avatarClassName: string;
  /** A real avatar photo; when set, it renders instead of the initial tile. */
  avatarSrc?: string;
};

export type SlackThreadMeta = {
  count: number;
  /** The faces shown in the reply pile. */
  faces: readonly SlackFace[];
  /** e.g. "last reply 2h ago". */
  last: string;
};

export type SlackMessage = SlackFace & {
  author: string;
  time: string;
  body: ReactNode;
  reactions?: readonly SlackReaction[];
  /** A shared image, rendered as a Slack file block under the text. */
  attachment?: {
    src: string;
    alt: string;
    /** The file-name label Slack shows above the preview. */
    name: string;
    width: number;
    height: number;
  };
  edited?: boolean;
  /** Grouped under the previous same-author message (no avatar/name repeat). */
  continuation?: boolean;
  /** A thread hanging off this message. */
  thread?: SlackThreadMeta;
};

export type SlackDay = {
  date: string;
  messages: readonly SlackMessage[];
};

type SlackThreadProps = {
  channel: string;
  topic: string;
  days: readonly SlackDay[];
  /** The channel member face-pile in the header. */
  members?: readonly SlackFace[];
  className?: string;
};

const Avatar = ({
  initial,
  avatarClassName,
  avatarSrc,
  className,
}: SlackFace & { className?: string }) => {
  const size = className ?? "h-9 w-9 text-[15px]";
  if (avatarSrc) {
    return (
      <Image
        src={avatarSrc}
        alt=""
        width={72}
        height={72}
        className={cn(
          "shrink-0 rounded-[10px] object-cover ring-1 ring-black/5",
          size,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-[10px] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] ring-1 ring-black/5",
        avatarClassName,
        size,
      )}
    >
      {initial}
    </span>
  );
};

export const SlackThread = ({
  channel,
  topic,
  days,
  members,
  className,
}: SlackThreadProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-xl border border-[#E8D9C5] bg-white shadow-[0_8px_32px_rgba(70,55,35,0.08)] [font-family:-apple-system,BlinkMacSystemFont,'Segoe_UI',Helvetica,Arial,sans-serif]",
      className,
    )}
  >
    <div className="flex items-center justify-between gap-3 border-b border-[#E2E2E2] px-5 py-3">
      <div className="min-w-0">
        <p className="text-[15px] font-bold text-[#1D1C1D]">
          <span aria-hidden className="mr-1 text-[#616061]">
            #
          </span>
          {channel}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#616061]">{topic}</p>
      </div>
      {members && members.length > 0 ? (
        <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#E2E2E2] px-1.5 py-1">
          <span className="flex -space-x-1.5">
            {members.map((m) => (
              <Avatar
                key={m.initial}
                initial={m.initial}
                avatarClassName={m.avatarClassName}
                avatarSrc={m.avatarSrc}
                className="h-5 w-5 rounded-[6px] text-[10px] ring-2 ring-white"
              />
            ))}
          </span>
          <span className="text-xs font-medium text-[#616061]">
            {members.length}
          </span>
        </span>
      ) : null}
    </div>

    <div className="px-3 pb-4 pt-1 sm:px-4">
      {days.map((day) => (
        <div key={day.date}>
          <div className="relative my-4 text-center">
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 border-t border-[#E2E2E2]"
            />
            <span className="relative inline-flex rounded-full border border-[#E2E2E2] bg-white px-3 py-0.5 text-xs font-bold text-[#1D1C1D]">
              {day.date}
            </span>
          </div>

          <ul>
            {day.messages.map((message, i) => (
              <li
                key={`${message.author}-${message.time}-${i}`}
                className={cn(
                  "group relative -mx-2 flex gap-2.5 rounded-md px-2 transition-colors hover:bg-[#F8F8F8]",
                  message.continuation ? "py-0.5" : "mt-2 py-1 first:mt-0",
                )}
              >
                {message.continuation ? (
                  <span className="w-9 shrink-0 pt-[3px] pr-1 text-right text-[10px] leading-4 text-[#616061] opacity-0 transition-opacity group-hover:opacity-100">
                    {message.time}
                  </span>
                ) : (
                  <Avatar
                    initial={message.initial}
                    avatarClassName={message.avatarClassName}
                    avatarSrc={message.avatarSrc}
                  />
                )}
                <div className="min-w-0 flex-1">
                  {message.continuation ? null : (
                    <p className="text-[15px] leading-5">
                      <span className="font-bold text-[#1D1C1D]">
                        {message.author}
                      </span>{" "}
                      <span className="text-xs text-[#616061]">
                        {message.time}
                      </span>
                    </p>
                  )}
                  <p className="text-[15px] leading-[22px] text-[#1D1C1D]">
                    {message.body}
                    {message.edited ? (
                      <span className="ml-1 text-xs text-[#616061]">
                        (edited)
                      </span>
                    ) : null}
                  </p>

                  {message.attachment ? (
                    <figure className="mt-1.5">
                      <figcaption className="text-[13px] font-medium text-[#1D1C1D]">
                        {message.attachment.name}
                      </figcaption>
                      <Image
                        src={message.attachment.src}
                        alt={message.attachment.alt}
                        width={message.attachment.width}
                        height={message.attachment.height}
                        sizes="240px"
                        className="mt-1 h-auto w-60 max-w-full rounded-lg border border-[#E2E2E2] bg-[#FBF7F0]"
                      />
                    </figure>
                  ) : null}

                  {message.reactions ? (
                    <ul className="mt-1.5 flex flex-wrap gap-1">
                      {message.reactions.map((reaction) => (
                        <li
                          key={reaction.emoji}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                            reaction.mine
                              ? "border-[#1D9BD1] bg-[#E8F5FA] text-[#1264A3]"
                              : "border-transparent bg-[#F6F6F6] text-[#1D1C1D]",
                          )}
                        >
                          <span aria-hidden>{reaction.emoji}</span>
                          <span className="font-medium">{reaction.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {message.thread ? (
                    <span className="group/th mt-1.5 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-transparent py-0.5 pr-2 pl-1 transition-colors hover:border-[#E2E2E2] hover:bg-white hover:shadow-sm">
                      <span className="flex -space-x-1">
                        {message.thread.faces.map((f) => (
                          <Avatar
                            key={f.initial}
                            initial={f.initial}
                            avatarClassName={f.avatarClassName}
                            avatarSrc={f.avatarSrc}
                            className="h-5 w-5 rounded-[6px] text-[10px] ring-2 ring-white"
                          />
                        ))}
                      </span>
                      <span className="text-[13px] font-bold text-[#1264A3]">
                        {message.thread.count} replies
                      </span>
                      <span className="text-xs text-[#616061] group-hover/th:hidden">
                        {message.thread.last}
                      </span>
                      <span className="hidden text-xs font-medium text-[#616061] group-hover/th:inline">
                        View thread
                      </span>
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);
