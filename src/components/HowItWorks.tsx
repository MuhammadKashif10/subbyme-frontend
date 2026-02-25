import { motion } from "framer-motion";
import { FileEdit, Users, CheckCircle2, Wrench } from "lucide-react";

const steps = [
  {
    icon: FileEdit,
    title: "Post a Job",
    description: "Describe your project, set your budget, and publish your job in minutes. Our platform connects you with qualified local contractors.",
  },
  {
    icon: Users,
    title: "Receive Applications",
    description: "Get competitive quotes from verified contractors. Compare profiles, ratings, and proposals to find the best fit for your project.",
  },
  {
    icon: CheckCircle2,
    title: "Choose the Right Contractor",
    description: "Review portfolios and reviews, then hire with confidence. SubbyMe ensures all contractors are verified and qualified.",
  },
  {
    icon: Wrench,
    title: "Get the Job Done",
    description: "Track progress, communicate easily, and pay securely through our platform. Your project completed on your terms.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute left-1/2 top-0 h-px w-full max-w-2xl -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container-main">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Four simple steps to connect with skilled contractors and get your project done.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="group relative"
              variants={itemVariants}
            >
              <motion.div
                className="relative h-full rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-colors"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.15)",
                  transition: { duration: 0.3 },
                }}
              >
                {/* Step number with gradient */}
                <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 text-primary transition-colors group-hover:from-primary/20 group-hover:to-blue-500/20">
                  <step.icon className="h-6 w-6" strokeWidth={2} />
                </div>

                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
