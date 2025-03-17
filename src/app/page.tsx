// import logo from "@/images/logo.png";
// import resumePreview from "@/images/resume-preview.jpg";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Link from "next/link";

// import Spline from "@splinetool/react-spline";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
//       <div className="max-w-prose space-y-3">
//         <Image
//           src={logo}
//           alt="Logo"
//           width={150}
//           height={150}
//           className="mx-auto md:ms-0"
//         />
//         <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
//           Create the{" "}
//           <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
//             Perfect Resume
//           </span>{" "}
//           in Minutes
//         </h1>
//         <p className="text-lg text-gray-500">
//           Our <span className="font-bold">AI resume builder</span> helps you
//           design a professional resume, even if you&apos;re not very smart.
//         </p>
//         <Button asChild size="lg" variant="premium">
//           <Link href="/resumes">Get Started</Link>
//         </Button>
//       </div>
//       <div>
//         <Image
//           src={resumePreview}
//           alt="Resume preview"
//           width={600}
//           className="shadow-md lg:rotate-[1.5deg]"
//         />
//       </div>
//     </main>
//   );
// }

import logo from "@/images/logo.png";
// import resumePreview from "@/images/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Import the Spline component
import Spline from "@splinetool/react-spline";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      {/* Left Section: Text and Call-to-Action */}
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create the{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>{" "}
          in Minutes
        </h1>
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI resume builder</span> helps you
          design a professional resume, even if you&apos;re not very smart.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get Started</Link>
        </Button>
      </div>

      {/* Right Section: Spline Model */}
      <div className="relative h-[700px] w-full max-w-[600px]">
        {/* Add the Spline component */}
        <Spline
          scene="https://prod.spline.design/1ae0GADE6VCYShP1/scene.splinecode"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </main>
  );
}
