import { Button } from "@/components/ui/button";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f7f4ef] text-[#1f2a24]"
    >
      <section className="mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <nav
          aria-label="Public preview"
          className="flex items-center justify-between gap-4 text-sm"
        >
          <span className="font-semibold">Routinelle</span>
          <span className="max-w-[11rem] text-right text-[#53685d] sm:max-w-none">
            Cosmetic skincare guidance
          </span>
        </nav>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-14">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase text-[#53685d]">
                First routine before signup
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
                A clear AM/PM skincare routine based on skin needs, ingredient
                fit, budget, and local availability.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#53685d]">
                Routinelle is built to explain what each step is for, what fits
                your skin, and what to avoid. It gives cosmetic skincare
                guidance, not medical diagnosis.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="rounded-lg bg-[#31463a] px-5 text-white hover:bg-[#26372e]"
              >
                <a href="#sample-preview">View sample preview</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-[#b9c4b8] bg-white/65 px-5 text-[#31463a] hover:bg-white"
              >
                <a href="/onboarding">Start my routine</a>
              </Button>
            </div>

            <p className="max-w-xl text-sm leading-6 text-[#6b746d]">
              No account required to see the sample. The full questionnaire
              will ask short skin, concern, sensitivity, budget, and availability
              questions before creating a personal routine.
            </p>
          </div>

          <aside
            className="rounded-lg border border-[#d8d0c3] bg-white/75 p-5 shadow-none"
            aria-label="Routinelle guidance principles"
          >
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-[#53685d]">
                  What Routinelle checks
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">
                  Routine role first, product browsing second.
                </h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-[#53685d]">
                <li>Skin type and main concerns.</li>
                <li>Ingredient fit and barrier comfort.</li>
                <li>Budget and local availability.</li>
                <li>Reasons to start gently or avoid over-stacking actives.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {children}
    </main>
  );
}
