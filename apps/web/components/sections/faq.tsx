import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container, Eyebrow } from '@/components/primitives';

const faqs = [
  {
    q: 'How often do you check my monitors?',
    a: 'Every 30 seconds on the Pro plan and every 15 seconds on Business. The free Starter plan checks every 5 minutes — still faster than most providers.',
  },
  {
    q: 'Do you charge for alert phone calls or SMS?',
    a: 'No. Every alert channel — phone calls, SMS, Slack, email, webhooks — is included on every paid plan with no per-message fees.',
  },
  {
    q: 'Can I bring my own status page domain?',
    a: 'Yes. On the Business plan you can host your status page on a custom domain with your own branding and SSL.',
  },
  {
    q: 'What counts as a monitor?',
    a: 'A monitor is a single endpoint you want to check — one URL, one TCP port, one ping target, or one heartbeat. Each can be checked from multiple regions.',
  },
];

export function FAQ() {
  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        <div className="text-center">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked
          </h2>
        </div>
        <Accordion className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
