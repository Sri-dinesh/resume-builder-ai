import Image from "next/image";

export default function ProductPreview() {
  return (
    <div className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-lg border border-white/10 shadow-2xl">
        <div className="from-primary/10 via-accent/10 absolute inset-0 bg-gradient-to-tr to-transparent" />
        <Image
          src="https://sjc.microlink.io/dACoBD81V0jhbU_TaUYiRrOVrhAXOh8TCYVdXmvVaYFIpbvF9B17bU0pnQF3gHfzVAOFzC-nwZVACScUpFYQsg.jpeg"
          alt="Huly App Interface"
          width={1200}
          height={800}
          className="h-auto w-full"
        />
      </div>
      {/* Glow effect */}
      <div className="bg-gradient-conic absolute -inset-x-20 top-0 h-[500px] opacity-30 blur-3xl" />
    </div>
  );
}
