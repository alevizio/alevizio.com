import svgPaths from "./svg-ectekmh7x3";
import imgImage4 from "figma:asset/9bedae1a0a866d804b6b66159248f7938c255179.png";

export default function AlevizioCom() {
  return (
    <div className="bg-[#dedbd1] relative size-full" data-name="alevizio.com">
      <div className="absolute content-stretch flex flex-col gap-[140px] items-start left-0 p-[140px] top-0 w-[1440px]">
        <div className="h-[53px] relative shrink-0 w-[80.116px]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80.1162 53">
            <path d={svgPaths.p3e2d6e80} fill="var(--fill-0, #1E1E1E)" id="Union" />
          </svg>
        </div>
        <div className="content-stretch flex flex-col font-['Instrument_Sans:Regular',sans-serif] font-normal gap-[16px] items-start leading-[normal] relative shrink-0 text-black w-[674px]">
          <p className="min-w-full relative shrink-0 text-[52px] w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>{`a relentless mind shaping product, brand & interaction`}</p>
          <p className="relative shrink-0 text-[18px] w-[625px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            I design products, identities, and interactions that bring clarity to complex ideas — from early concepts to polished systems used by real people.
          </p>
        </div>
      </div>
      <div className="absolute h-[861px] right-0 top-0 w-[490px]" data-name="image 4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[100.1%] left-[-40.65%] max-w-none top-[-0.05%] w-[140.65%]" src={imgImage4} />
        </div>
      </div>
    </div>
  );
}