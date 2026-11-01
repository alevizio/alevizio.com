import { MdArrowForward } from "react-icons/md";
import { MARK, MARK_IN_WORDMARK, WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./wordmark-paths";

/* The first pass's top as the file sets it (Navigation 10:1863, the
 * headline 10:1806, the field 10:1809), still while the map under it
 * plays. The field sits over the map's top edge, as it does in the file. */
export const FirstPassTop = () => (
  <>
    <div className="absolute inset-x-0 top-0 flex h-[78px] items-center justify-between bg-night/50 px-20 shadow-[0_24px_55px_rgba(160,255,215,0.1)] backdrop-blur-[20px]">
      <svg viewBox={WORDMARK_VIEWBOX} aria-hidden className="h-[34.947px] w-[180px] text-white">
        <g transform={MARK_IN_WORDMARK}>
          {MARK.map((d) => (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
          ))}
        </g>
        {WORDMARK_LETTERS.map((d) => (
          <path key={d} d={d} fill="currentColor" />
        ))}
      </svg>
      <div className="flex items-center gap-4 text-[14px] leading-none text-white">
        <span className="p-4">Team</span>
        <span className="p-4">Contact</span>
        <span className="flex items-center gap-2 rounded-full bg-mist py-2 pr-3.5 pl-5 font-mono text-night">
          Get Started <MdArrowForward className="size-5" />
        </span>
      </div>
    </div>
    <div className="absolute top-[206px] left-20">
      <p className="w-[799px] text-[72px] leading-[1.1] text-mint">Cloud-native Geospatial Developer Tools</p>
      <p className="mt-2 text-[24px] leading-[1.4] font-light whitespace-nowrap text-mist">Cloud-native tools to supercharge your geospatial workflows.</p>
    </div>
    <div className="absolute top-[549px] left-20 flex w-[420px] items-center gap-8 rounded-full border border-white/30 bg-[#1e2b27] py-2 pr-2 pl-6 shadow-[0_24px_110px_20px_rgba(160,255,215,0.1)]">
      <span className="flex-1 text-[14px] leading-none text-white/50">Enter your email...</span>
      <span className="flex h-12 items-center gap-2 rounded-full bg-mist pr-5 pl-6 font-mono text-[16px] leading-none text-night">
        Get Started <MdArrowForward className="size-5" />
      </span>
    </div>
  </>
);
