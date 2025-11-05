import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const testimonials = [
  {
    quote:
      "Hiems AI-automation har sparat oss 15 timmar i veckan. Våra kunder får svar direkt och vi kan fokusera på det vi är bäst på.",
    author: "Emma Karlsson",
    company: "VD, Stockholm VVS",
  },
  {
    quote:
      "ROI på 400% första året. AI-assistenten hanterar 80% av våra kundförfrågningar och bokningarna flödar in automatiskt.",
    author: "Johan Svensson",
    company: "Grundare, Service Expert AB",
  },
  {
    quote:
      "Vi trodde AI var för stora företag, men Hiems gjorde det enkelt och prisvärt. Nu kör systemet på autopilot.",
    author: "Maria Lindström",
    company: "Ägare, Lindströms El",
  },
  {
    quote:
      "Från första mötet till lansering tog det bara 2 veckor. Support och uppföljning har varit fenomenal.",
    author: "Anders Berg",
    company: "VD, Nordic Sales Group",
  },
];

export const TestimonialsGrid = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-background px-3 py-1 text-sm"
            >
              Testimonials
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Vad Våra Kunder Säger
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Hör från företag som redan har transformerat sin verksamhet med Hiems
            </motion.p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-3 py-12 lg:grid-cols-2"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemFadeIn}
              whileHover={{ y: -10 }}
              className="flex flex-col justify-between rounded-3xl border bg-background p-6 shadow-sm"
            >
              <div>
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-lg font-medium leading-relaxed">"{testimonial.quote}"</blockquote>
              </div>
              <div className="mt-6 flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="ml-4">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
