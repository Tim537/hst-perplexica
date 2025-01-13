interface SideBarToolTipProps {
  children: React.ReactNode;
  text: string;
  spacing?: string;
}

export default function SideBarToolTip({
  children,
  text,
  spacing = '8px',
}: SideBarToolTipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="fixed ml-[4rem] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out pointer-events-none -mt-[1.5rem] translate-x-[10px] group-hover:translate-x-0 z-50">
        <div className="flex items-center justify-center hst:hidden bg-[url('/lightTip.svg')] dark:bg-[url('/darkTip.svg')] bg-no-repeat bg-[length:100%_100%] min-w-[85px] h-[30px] absolute -left-[0.5rem] -top-[0.1rem] translate-x-[10px] group-hover:translate-x-0 transition-all duration-200 ease-out pl-2 pr-0 ">
          <span className="text-[0.625rem] text-black/70 dark:text-white/70 whitespace-nowrap">
            {text}
          </span>
        </div>

        <div className="hidden hst:flex items-center justify-center bg-[url('/hstTip.svg')] bg-no-repeat bg-contain w-[85px] h-[30px] absolute -left-[1.6rem] -top-[0.1rem] translate-x-[10px] group-hover:translate-x-0 transition-all duration-200 ease-out ">
          <span className="text-[0.7rem] text-hst-accent ml-[0.5rem]">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
