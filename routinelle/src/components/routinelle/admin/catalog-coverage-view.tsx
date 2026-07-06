import type { CatalogCoverageReport } from "@/lib/catalog/catalog-coverage";

export function CatalogCoverageView({
  coverage,
}: {
  coverage: CatalogCoverageReport;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Catalog coverage gaps</h1>
        <p className="text-sm leading-6 text-[#53685d]">
          Coverage counts only eligible, published, current products for the
          first market catalog.
        </p>
      </div>

      <section className="space-y-3" aria-labelledby="coverage-gaps-title">
        <h2 id="coverage-gaps-title" className="text-lg font-semibold">
          Priority gaps
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.gaps.slice(0, 18).map((gap) => (
            <div
              key={`${gap.market}-${gap.routineStep}-${gap.priorityProfile}-${gap.priceBand}`}
              className="rounded-lg border border-[#d6c48d] bg-[#fff8e6] p-3 text-sm"
            >
              <p className="font-semibold">
                {gap.routineStep} · {gap.priorityProfile}
              </p>
              <p className="mt-1 text-[#53685d]">
                {gap.market} · {gap.priceBand} budget
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="coverage-grid-title">
        <h2 id="coverage-grid-title" className="text-lg font-semibold">
          Coverage grid
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[#d8d0c3] bg-white">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="bg-[#fbfaf7]">
              <tr>
                <th className="p-3">Market</th>
                <th className="p-3">Step</th>
                <th className="p-3">Profile</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Eligible</th>
                <th className="p-3">State</th>
              </tr>
            </thead>
            <tbody>
              {coverage.cells.map((cell) => (
                <tr
                  key={`${cell.market}-${cell.routineStep}-${cell.priorityProfile}-${cell.priceBand}`}
                  className="border-t border-[#d8d0c3]"
                >
                  <td className="p-3">{cell.market}</td>
                  <td className="p-3">{cell.routineStep}</td>
                  <td className="p-3">{cell.priorityProfile}</td>
                  <td className="p-3">{cell.priceBand}</td>
                  <td className="p-3">{cell.eligibleCount}</td>
                  <td className="p-3">
                    {cell.hasGap ? "Gap" : "Covered"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
