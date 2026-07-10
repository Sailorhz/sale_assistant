import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Routinelle",
};

const LAST_UPDATED = "2026-07-10";

export default function TermsOfServicePage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto w-full max-w-3xl space-y-8 pb-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="text-sm text-[#53685d]">Last updated: {LAST_UPDATED}</p>
        </header>

        <Section title="1. Acceptance of these terms">
          <p>
            By creating a Routinelle account or otherwise using the app, you
            agree to these Terms of Service and to our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            . If you do not agree, do not use Routinelle.
          </p>
        </Section>

        <Section title="2. What Routinelle is -- and isn't">
          <p>
            Routinelle generates cosmetic skincare routine suggestions based
            on answers you provide. It is a cosmetic guidance tool, not a
            medical device, diagnostic tool, or substitute for professional
            medical or dermatological advice. Product suggestions reflect
            profile fit, routine role, ingredient facts, budget, and
            availability -- retailer links are separate from ranking logic
            and Routinelle does not receive payment for ranking a given
            product higher.
          </p>
          <p>
            If your answers indicate signs that may need professional
            attention, Routinelle will pause routine guidance and direct you
            to seek professional care instead of showing product
            suggestions. This is a safety measure, not a diagnosis, and you
            should always seek qualified medical advice for any health
            concern.
          </p>
        </Section>

        <Section title="3. Eligibility and accounts">
          <p>
            You must be able to form a binding contract in your country of
            residence to create an account, and you must meet the minimum
            age described in our Privacy Policy. You are responsible for
            keeping your login credentials confidential and for all
            activity under your account. Tell us promptly if you suspect
            unauthorized use of your account.
          </p>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Use Routinelle for any unlawful purpose, or to misrepresent your identity.</li>
            <li>Attempt to circumvent rate limits, security controls, or access data you are not authorized to access.</li>
            <li>Scrape, reverse-engineer, or resell the catalog or recommendation content without our written permission.</li>
            <li>Use the app in a way that could disable, overburden, or impair it for other users.</li>
          </ul>
        </Section>

        <Section title="5. Product and retailer links">
          <p>
            Routinelle links to third-party retailers so you can view or
            purchase suggested products. We do our best to keep product
            data (price, availability, formulation) current, but retailer
            prices, stock, and formulations can change without notice and
            are outside our control. Purchases you make through a retailer
            are governed by that retailer&apos;s own terms, not ours.
          </p>
        </Section>

        <Section title="6. Intellectual property">
          <p>
            The Routinelle app, its design, and its original written
            content are owned by [legal entity name] or its licensors.
            Product names, brand names, and trademarks referenced in the
            catalog belong to their respective owners and are used only to
            accurately describe and link to those products.
          </p>
        </Section>

        <Section title="7. Disclaimers">
          <p>
            Routinelle is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo;, without warranties of any kind, express or
            implied, including fitness for a particular purpose or
            non-infringement. We do not warrant that recommendations will be
            free of errors, that the app will be uninterrupted, or that any
            product suggested will be suitable for your individual skin.
            Always patch-test new products and stop use if irritation
            occurs.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by applicable law, [legal
            entity name] will not be liable for indirect, incidental, or
            consequential damages arising from your use of Routinelle.
            Nothing in these terms limits liability that cannot be limited
            under applicable law (for example, liability for death or
            personal injury caused by negligence, where applicable).
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            You may stop using Routinelle and request account deletion at
            any time from your{" "}
            <Link href="/account" className="underline">
              account page
            </Link>
            . We may suspend or terminate accounts that violate these terms
            or the acceptable-use section above.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            [Specify governing law and jurisdiction -- e.g. the laws of
            France, without prejudice to any mandatory consumer-protection
            rights you have in your own country of residence.]
          </p>
        </Section>

        <Section title="11. Changes to these terms">
          <p>
            We may update these terms as Routinelle evolves. Material
            changes will be reflected by updating the &ldquo;Last
            updated&rdquo; date above, and, where appropriate, by more
            prominent notice.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>Questions about these terms: [contact email].</p>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-[#33463c]">
        {children}
      </div>
    </section>
  );
}
