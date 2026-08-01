import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Everything App
          <br />
          <span className="text-gray-400">for your teams</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
          Huly, an open-source platform, serves as an all-in-one replacement of
          Linear, Jira, Slack, and Notion.
        </p>
        <Button className="group from-primary to-accent relative bg-gradient-to-r px-8 py-6 text-lg hover:opacity-90">
          <span className="relative z-10">Try it free</span>
          <div className="absolute inset-0 bg-white/20 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl" />
        </Button>
      </div>
    </div>
  );
}
