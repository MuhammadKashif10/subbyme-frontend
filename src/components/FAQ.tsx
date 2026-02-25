import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I post a job on SubbyMe?",
    a: "Simply sign up as a client, create your account, and click 'Post a Job'. Describe your project, set your budget, and choose the category. Your job will be visible to verified contractors in your area within minutes.",
  },
  {
    q: "Are contractors verified on SubbyMe?",
    a: "Yes. All contractors on SubbyMe go through a verification process. We verify qualifications, insurance, and trade credentials. You can also view ratings and reviews from previous clients before hiring.",
  },
  {
    q: "How does payment work?",
    a: "SubbyMe uses secure payments through Stripe. For job payments, funds are held in escrow until the work is complete, protecting both clients and contractors. Contractors pay a weekly subscription to access jobs and messaging.",
  },
  {
    q: "What if I'm not satisfied with the work?",
    a: "We encourage open communication throughout the project. If issues arise, our support team can help mediate. Escrow payments can be released only after your approval, giving you control over when contractors get paid.",
  },
  {
    q: "How much does it cost for contractors to join?",
    a: "Contractors can subscribe from $10/week for our Standard plan, which includes profile visibility, up to 20 messages per month, and job applications. Our Premium plan at $25/week offers unlimited messages and priority placement.",
  },
  {
    q: "Can I message contractors before hiring?",
    a: "Absolutely. You can browse contractor profiles, view their work and reviews, and message them directly through SubbyMe to discuss your project before making a hiring decision.",
  },
];

type FAQItemProps = {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ q, a, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm"
      layout
      initial={false}
      whileHover={{
        borderColor: "hsl(var(--primary) / 0.3)",
        backgroundColor: "hsl(var(--card) / 0.9)",
      }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-primary/5"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 text-primary"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60 px-5 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-border/60 py-20 sm:py-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="container-main">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Everything you need to know about SubbyMe. Can't find the answer? Contact our support.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-2xl space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
