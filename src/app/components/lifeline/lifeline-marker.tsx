import { forwardRef, type CSSProperties } from "react"
import { Film, Image as ImageIcon } from "lucide-react"
import { cn } from "../ui/utils"
import { CompanyIcon } from "./company-icon"
import {
  getLifelineEventEffect,
  getLifelineEventImage,
  getLifelineEventKey,
  LifelineEventText,
} from "./lifeline-event"
import { useLifelineFireworks } from "./lifeline-fireworks"
import { useLifelineHoverImage } from "./lifeline-hover-image"
import { aggregateLifelinePeople, LifelinePeople } from "./lifeline-people"
import type { LifelineMarker } from "./types"

interface LifelineMarkerColumnProps {
  marker: LifelineMarker
  birthYear: number
  showAge?: boolean
  minWidth: number
  animateIntro?: boolean
  introDelay?: number
  introDuration?: number
}

export const LifelineMarkerColumn = forwardRef<
  HTMLDivElement,
  LifelineMarkerColumnProps
>(function LifelineMarkerColumn(
  {
    marker,
    birthYear,
    showAge = true,
    minWidth,
    animateIntro = false,
    introDelay = 0,
    introDuration = 420,
  },
  ref,
) {
  const age = marker.age ?? marker.year - birthYear
  const people = aggregateLifelinePeople(marker)
  const hoverImage = useLifelineHoverImage()
  const fireworks = useLifelineFireworks()
  // A year with lines but no logos keeps the logo row open, so its first
  // line sits level with every other year's, and its tick runs down
  // through the open row.
  const openLogoRow = !marker.companies?.length && marker.events.length > 0

  return (
    <div
      ref={ref}
      className="group relative shrink-0 pr-8 transition-opacity duration-300 ease-out will-change-opacity"
      style={{ width: minWidth }}
      aria-label={marker.label ?? `${marker.year}`}
    >
      <div
        className={cn("relative", animateIntro && "lifeline-marker-intro")}
        style={{
          animationDelay: animateIntro ? `${introDelay}ms` : undefined,
          ...(animateIntro
            ? ({
                "--lifeline-marker-fade-ms": `${introDuration}ms`,
              } as CSSProperties)
            : {}),
        }}
      >
        {/* 5px above the rail; then 5px below it, or, with the logo row
            open, down to the row's foot (pt-6 + h-4 below the rail). */}
        <span
          className={cn(
            "absolute left-0 top-[var(--lifeline-rail)] z-10 w-px bg-zinc-400 transition-colors duration-300 group-hover:bg-zinc-600 dark:bg-zinc-700 dark:group-hover:bg-zinc-400",
            openLogoRow
              ? "h-[calc(2.5rem+5px)] -translate-y-[5px]"
              : "h-[10px] -translate-y-1/2",
          )}
          aria-hidden="true"
        />

        <div className="flex w-full flex-col items-start text-left">
          {showAge && (
            <p className="mb-5 h-4 text-[11px] font-medium leading-4 tabular-nums text-zinc-500 transition-colors duration-300 group-hover:text-black dark:text-zinc-600 dark:group-hover:text-zinc-400">
              {age}
            </p>
          )}

          <p className="mb-6 h-5 whitespace-nowrap text-[15px] font-medium leading-5 tabular-nums text-zinc-500 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
            {marker.label ?? marker.year}
          </p>

          <div className="relative w-full pb-10 text-zinc-500 transition-colors duration-300 group-hover:text-black dark:group-hover:text-zinc-300">
            {/* When this column carries people, the content block reserves
                the band's height as a floor: short and average columns put
                their portraits on the same line as every other column, and
                a column whose events run past the floor pushes its own
                portraits below them instead of under them. pb-6 is the gap
                in the overflow case — absorbed by the floor otherwise. */}
            <div
              className={cn(
                "flex w-full flex-col items-start pt-6",
                people.length > 0 &&
                  "min-h-[var(--lifeline-people-top)] pb-6",
              )}
            >
              {marker.badges && marker.badges.length > 0 && (
                <div className="mb-3 flex items-center justify-start gap-2">
                  {marker.badges.map((badge) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={badge.src}
                      src={badge.src}
                      alt={badge.alt}
                      className="h-4 w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ))}
                </div>
              )}

              {/* h-4 whatever the marks: a taller wordmark overflows the row
                  evenly rather than pushing its year's first line down. */}
              {marker.companies && marker.companies.length > 0 && (
                <div className="mb-2 flex h-4 items-center justify-start gap-1.5">
                  {marker.companies.map((company) => (
                    <CompanyIcon
                      key={company.id}
                      id={company.id}
                      label={company.name}
                      className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ))}
                </div>
              )}
              {openLogoRow && <div aria-hidden="true" className="mb-2 h-4" />}

              <div className="min-h-[3.25rem] space-y-4">
                {marker.events.map((event, index) => {
                  const image = getLifelineEventImage(event)
                  const effect = getLifelineEventEffect(event)

                  return (
                    <p
                      key={getLifelineEventKey(event, index)}
                      className={cn(
                        "max-w-[18rem] text-left text-[14px] leading-[1.55] tracking-[-0.01em]",
                        effect && "cursor-pointer",
                      )}
                      data-lifeline-interactive={effect ? "" : undefined}
                      onMouseEnter={
                        image && hoverImage
                          ? () => hoverImage.show(image)
                          : undefined
                      }
                      onMouseLeave={
                        image && hoverImage ? hoverImage.hide : undefined
                      }
                      onClick={
                        effect && fireworks
                          ? () => fireworks.launch(effect)
                          : undefined
                      }
                    >
                      <LifelineEventText event={event} />
                      {image && (
                        // Glued to the last word with a no-break space so
                        // the icon can never wrap onto a line of its own.
                        <span className="whitespace-nowrap">
                          {" "}
                          {image.video ? (
                            <Film
                              className="ml-0.5 inline-block h-3 w-3 -translate-y-px text-zinc-400 transition-colors duration-300 dark:text-zinc-600"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          ) : (
                            <ImageIcon
                              className="ml-0.5 inline-block h-3 w-3 -translate-y-px text-zinc-400 transition-colors duration-300 dark:text-zinc-600"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      )}
                    </p>
                  )
                })}
              </div>
            </div>

            {people.length > 0 && (
              <div className="w-full">
                <LifelinePeople people={people} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})