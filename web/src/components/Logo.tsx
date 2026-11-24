import Image from "next/image";
import Link from "next/link";

export function Bird({ className = "h-9 w-auto" }: { className?: string }) {
  return <Image src="/images/hummingbird.png" alt="" width={541} height={443} className={className} priority />;
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Lost Voices of Fentanyl home">
      <Bird className="h-9 w-auto drop-shadow-[0_0_18px_rgba(143,108,255,.55)] transition group-hover:drop-shadow-[0_0_24px_rgba(143,108,255,.8)]" />
      <span className="leading-none whitespace-nowrap">
        <span className="block text-[0.85rem] sm:text-[0.95rem] font-semibold tracking-[0.16em] sm:tracking-[0.18em] uppercase">Lost Voices</span>
        <span className="block text-[0.62rem] sm:text-[0.68rem] tracking-[0.3em] sm:tracking-[0.32em] uppercase text-lilac mt-1">of Fentanyl</span>
      </span>
    </Link>
  );
}
