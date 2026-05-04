function Container2() {
  return <div className="bg-white rounded-[4px] shrink-0 size-[22px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[4px] px-[5px] py-px rounded-[10px] size-[32px] top-[4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container2 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[20px] left-[44px] top-[10px] w-[37px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#0b1220] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">white</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white border border-[#e4e7ec] border-solid relative rounded-[14px] size-full" data-name="Container">
      <Container1 />
      <Text />
    </div>
  );
}