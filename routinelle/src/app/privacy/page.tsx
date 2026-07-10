import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Routinelle",
};

const LAST_UPDATED = "2026-07-10";

export default function PrivacyPolicyPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#1f2a24] sm:px-6"
    >
      <div className="mx-auto w-full max-w-3xl space-y-8 pb-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-sm text-[#53685d]">Last updated: {LAST_UPDATED}</p>
        </header>

        <Section title="Who we are">
          <p>
            Routinelle (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides cosmetic
            skincare routine guidance. This policy explains what personal
            data we collect through the Routinelle app, why, and what
            controls you have over it.
          </p>
          <p>
            <strong>Data controller:</strong> [Legal entity name], [registered
            address]. Contact for privacy questions or to exercise your
            rights: [privacy contact email].
          </p>
        </Section>

        <Section title="Routinelle gives cosmetic guidance, not medical advice">
          <p>
            Routinelle provides cosmetic-scope skincare suggestions only. It
            does not diagnose, treat, or provide medical advice. When your
            answers indicate signs that may need professional attention
            (for example swelling, pain, or symptoms that are persistent or
            worsening), the app pauses routine guidance and recommends
            seeking professional care instead. Nothing in the app or this
            policy should be read as a medical service.
          </p>
        </Section>

        <Section title="What we collect, and why">
          <p>We collect only what&apos;s needed to generate and improve your routine recommendations:</p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong>Account details.</strong> Email address and password
              (password is never visible to us in plain text -- it is
              handled by our authentication provider, Supabase). Used to let
              you sign in and save your routine.
            </li>
            <li>
              <strong>Skin profile answers.</strong> Skin type, concerns,
              sensitivity signals, budget, and market, given during
              onboarding. Used to fit a routine to your profile. Stored only
              if you consent to profile/routine storage on your account page.
            </li>
            <li>
              <strong>Generated and saved routines.</strong> The AM/PM steps
              Routinelle recommended for you, so you can view them again
              and understand what changed later.
            </li>
            <li>
              <strong>Check-in outcomes (optional).</strong> If you opt in
              to check-ins, structured comfort/irritation/progress signals
              (selected from fixed options -- we do not collect free-text
              descriptions of symptoms) to help update future guidance.
            </li>
            <li>
              <strong>Safety escalation events.</strong> If your answers
              indicate signs that may need professional care, we log that
              this occurred (category, severity, and which routine/step it
              relates to) so we can audit that the safety pathway is working
              correctly. This log does not include free-text health
              descriptions.
            </li>
            <li>
              <strong>Basic product-interaction and usage events.</strong>
              Which recommendation steps and retailer links you interact
              with, to understand whether recommendations are useful and to
              maintain the catalog.
            </li>
            <li>
              <strong>Technical and security data.</strong> IP address (used
              transiently to apply rate limiting against abuse, not stored
              long-term for profiling) and error reports (see
              &ldquo;Error monitoring&rdquo; below).
            </li>
          </ul>
          <p>
            We do <strong>not</strong> request camera access, photo library
            access, or precise location for any recommendation in the
            current version of the app.
          </p>
        </Section>

        <Section title="Your consent choices">
          <p>
            On your account page, you separately control: (1) whether we
            store your skin profile and generated routine for account use,
            and (2) whether we store future check-in outcomes. Both are
            off by default and take effect immediately when you change
            them. Withdrawing consent does not affect the lawfulness of
            processing carried out before you withdrew it.
          </p>
        </Section>

        <Section title="Cookies and similar technologies">
          <p>
            Routinelle uses only the cookies our authentication provider
            (Supabase) sets to keep you signed in. We do not use
            advertising or cross-site tracking cookies, and we do not sell
            or share personal data with data brokers or advertisers.
          </p>
        </Section>

        <Section title="Error monitoring">
          <p>
            We use Sentry to catch and fix bugs. Error reports are
            configured to exclude request bodies, cookies, and default
            personal-data collection, and we do not enable session replay
            or screen-recording features -- given check-in and safety
            answers are health-adjacent, we deliberately keep this
            integration minimal rather than default-permissive.
          </p>
        </Section>

        <Section title="Who processes data on our behalf">
          <p>
            We use a small number of infrastructure providers to run
            Routinelle, each acting as a data processor under our
            instructions:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Supabase</strong> -- database, authentication, and
              file storage.
            </li>
            <li>
              <strong>Vercel</strong> -- application hosting.
            </li>
            <li>
              <strong>Upstash</strong> -- rate-limiting infrastructure (sees
              only IP addresses and request counts, transiently).
            </li>
            <li>
              <strong>Sentry</strong> -- error monitoring, configured as
              described above.
            </li>
          </ul>
          <p>
            Some of these providers may process data outside your country
            of residence, including in the United States. Where that
            applies, we rely on appropriate safeguards (such as Standard
            Contractual Clauses) as required by applicable data protection
            law. [Confirm and finalize the specific transfer mechanism for
            each processor before relying on this section for real users.]
          </p>
        </Section>

        <Section title="How long we keep data">
          <p>
            We keep account and profile data for as long as your account is
            active and you have not requested deletion. Safety-event and
            analytics logs are retained for [retention period -- to be set]
            for auditing and product-quality purposes, after which they are
            deleted or anonymized.
          </p>
        </Section>

        <Section title="Your rights, and how to exercise them">
          <p>
            Subject to applicable law (including, for users in the EU/EEA
            and UK, the GDPR/UK GDPR), you have the right to access,
            correct, delete, or export your personal data, and to object to
            or restrict certain processing.
          </p>
          <p>
            You can request deletion of your profile, routine, and check-in
            data at any time from your{" "}
            <Link href="/account" className="underline">
              account page
            </Link>
            . This immediately withdraws your storage consents and files a
            deletion request that we act on promptly; it is not always
            instantaneous, since some records may briefly persist for
            operational or legal reasons before final removal.
          </p>
          <p>
            To exercise any other right, or if you are unsatisfied with how
            we&apos;ve handled a request, contact us at [privacy contact
            email]. If you are in the EU, you also have the right to lodge a
            complaint with your local data protection authority (in France,
            the CNIL).
          </p>
        </Section>

        <Section title="Children">
          <p>
            Routinelle is not directed to children, and we do not knowingly
            collect personal data from children under [age -- confirm the
            correct threshold for your target markets, e.g. 16 in much of
            the EU]. If you believe a child has provided us with personal
            data, contact us and we will delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we make material changes to this policy, we will update the
            &ldquo;Last updated&rdquo; date above and, where appropriate,
            provide more prominent notice.
          </p>
        </Section>

        <p className="text-sm text-[#53685d]">
          See also our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>
          .
        </p>
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
