const testimonials = [
  {
    quote:
      "StreamLine has revolutionized our team's workflow. It's a game-changer!",
    author: "Jane Doe",
    company: "Tech Innovators Inc.",
  },
  {
    quote:
      "The best project management tool we've ever used. Highly recommended!",
    author: "John Smith",
    company: "Creative Solutions LLC",
  },
  {
    quote:
      "StreamLine helped us increase productivity by 40%. It's incredible!",
    author: "Emily Johnson",
    company: "Startup Ventures",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto">
        <h2 className="mb-12 text-center text-3xl font-bold">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg bg-gray-50 p-6">
              <p className="mb-4 text-lg">&quot;{testimonial.quote}&quot;</p>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
