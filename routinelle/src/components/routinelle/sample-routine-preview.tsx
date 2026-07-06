import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RoutineStep = {
  label: string;
  role: string;
  detail: string;
};

const morningSteps: RoutineStep[] = [
  {
    label: "Cleanse",
    role: "Gentle low-foam cleanser",
    detail: "Removes overnight oil without leaving skin feeling tight.",
  },
  {
    label: "Hydrate",
    role: "Lightweight humectant layer",
    detail: "Glycerin or hyaluronic acid helps hold water in the surface layers.",
  },
  {
    label: "Protect",
    role: "Daily broad-spectrum sunscreen",
    detail: "Helps protect skin from UV exposure that can worsen visible spots.",
  },
];

const eveningSteps: RoutineStep[] = [
  {
    label: "Cleanse",
    role: "Remove sunscreen and daily residue",
    detail: "A steady cleanse keeps the routine simple before any support step.",
  },
  {
    label: "Hydrate",
    role: "Barrier-supporting moisturizer",
    detail: "Panthenol and glycerin can support comfort and hydration.",
  },
  {
    label: "Optional support",
    role: "Calming niacinamide step",
    detail: "Introduced gradually when skin is calm, not stacked with strong actives.",
  },
];

function RoutineColumn({
  id,
  title,
  steps,
}: {
  id: string;
  title: string;
  steps: RoutineStep[];
}) {
  return (
    <section className="space-y-3" aria-labelledby={id}>
      <div className="flex items-center justify-between gap-3">
        <h3 id={id} className="text-lg font-semibold">
          {title}
        </h3>
        <Badge
          variant="outline"
          className="border-[#c8d2c7] bg-[#eef4ed] text-[#31463a]"
        >
          Example
        </Badge>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <Card
            key={`${title}-${step.label}`}
            className="rounded-lg border-[#d8d0c3] bg-white/80 shadow-none"
          >
            <CardContent className="space-y-2 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="font-semibold text-[#1f2a24]">{step.label}</p>
                <p className="text-sm text-[#53685d]">{step.role}</p>
              </div>
              <p className="text-sm leading-6 text-[#53685d]">{step.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function SampleRoutinePreview() {
  return (
    <section
      id="sample-preview"
      className="border-t border-[#d8d0c3] bg-[#fbfaf7]"
      aria-labelledby="sample-preview-title"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-14">
        <div className="space-y-5">
          <Badge className="bg-[#31463a] text-white hover:bg-[#31463a]">
            Sample preview
          </Badge>
          <div className="space-y-3">
            <h2
              id="sample-preview-title"
              className="text-2xl font-semibold leading-tight text-[#1f2a24] sm:text-3xl"
            >
              See the kind of routine Routinelle will explain before you sign
              up.
            </h2>
            <p className="text-base leading-7 text-[#53685d]">
              This is an example, not a personalized recommendation. Your real
              routine will depend on your skin type, concerns, budget, and local
              product availability.
            </p>
          </div>

          <Card className="rounded-lg border-[#d8d0c3] bg-white shadow-none">
            <CardHeader>
              <CardTitle className="text-base text-[#1f2a24]">
                Example profile context
              </CardTitle>
              <CardDescription className="leading-6 text-[#53685d]">
                Oily-combination skin, hydration need, visible pores, and a
                cautious approach to irritation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-lg border-[#c8d2c7] bg-[#eef4ed] shadow-none">
            <CardContent className="space-y-2 p-5">
              <p className="text-sm font-semibold text-[#31463a]">
                Why this fits the sample profile
              </p>
              <p className="text-sm leading-6 text-[#31463a]">
                Niacinamide can support the look of uneven tone and oiliness,
                while panthenol and glycerin help support hydration and barrier
                comfort. For irritation-prone skin, Routinelle would start
                gently rather than stacking strong actives.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <RoutineColumn
            id="am-routine"
            title="AM routine"
            steps={morningSteps}
          />
          <RoutineColumn
            id="pm-routine"
            title="PM routine"
            steps={eveningSteps}
          />
        </div>

        <Card className="rounded-lg border-[#d8d0c3] bg-white/90 shadow-none lg:col-span-2">
          <CardContent className="grid gap-3 p-5 sm:grid-cols-[0.35fr_0.65fr] sm:items-start">
            <p className="text-sm font-semibold text-[#1f2a24]">
              Neutrality cue
            </p>
            <p className="text-sm leading-6 text-[#53685d]">
              Example recommendations are ranked by routine role, ingredient
              fit, budget, and local availability, not by brand payment.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
