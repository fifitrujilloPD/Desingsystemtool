import svgPaths from "./svg-yoetbt6118";

export default function Buttom() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="buttom">
      <div className="content-stretch flex gap-[4px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit] size-full">
        <div className="relative shrink-0 size-[24px]" data-name="arrow_back">
          <div className="absolute inset-[16.67%]" data-name="icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3573eb00} fill="var(--fill-0, #003D6D)" id="icon" />
            </svg>
          </div>
        </div>
        <p className="font-['Roboto:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#003d6d] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Lader
        </p>
        <div className="relative shrink-0 size-[24px]" data-name="arrow_forward">
          <div className="absolute inset-[16.67%]" data-name="icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={svgPaths.p3997600} fill="var(--fill-0, #003D6D)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(1,17,31,0.1),inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)]" />
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}