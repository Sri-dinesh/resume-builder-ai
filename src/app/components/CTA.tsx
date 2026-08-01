import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="container mx-auto text-center">
        <h2 className="mb-6 text-3xl font-bold">
          Ready to Streamline Your Workflow?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Join thousands of teams already using StreamLine to boost their
          productivity.
        </p>
        <Button size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
}
