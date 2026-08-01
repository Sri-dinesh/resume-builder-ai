import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white px-6 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-primary text-2xl font-bold">
          StreamLine
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <Link href="#features" className="hover:text-primary text-gray-600">
            Features
          </Link>
          <Link
            href="#testimonials"
            className="hover:text-primary text-gray-600"
          >
            Testimonials
          </Link>
          <Link href="#pricing" className="hover:text-primary text-gray-600">
            Pricing
          </Link>
        </nav>
        <Button>Get Started</Button>
      </div>
    </header>
  );
}
