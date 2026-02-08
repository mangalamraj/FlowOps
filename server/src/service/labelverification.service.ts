import { getDimensionService } from "./order.service";

export function pctToInches(dimensions: any) {
  const cartonWidthIn = 24;
  const cartonHeightIn = 10;

  return {
    left_in: dimensions.distance.left_pct * cartonWidthIn,
    right_in: dimensions.distance.right_pct * cartonWidthIn,
    top_in: dimensions.distance.top_pct * cartonHeightIn,
    bottom_in: dimensions.distance.bottom_pct * cartonHeightIn,
  };
}

export function verifyBarcodePositionRules(distIn: any, rules: any[]) {
  const results = [];
  const filteredRules = rules[0].dimensions.filter(
    (rule) =>
      rule.entity === "barcode" &&
      ["edge", "bottom", "left"].includes(rule.reference),
  );
  for (const rule of filteredRules) {
    const ref = rule.reference;
    const required = rule.value;
    let actual: number;

    if (ref === "edge" || "left" || "bottom") {
      actual = Math.min(
        distIn.left_in,
        distIn.right_in,
        distIn.top_in,
        distIn.bottom_in,
      );
    } else {
      actual = distIn[`${ref}_in`];
    }
    const passed = actual >= required;

    results.push({
      rule: `${ref} minimum distance ${required} in`,
      status: passed ? "PASS" : "FAIL",
      actual: Number(actual.toFixed(2)),
      required,
    });
  }
  return results;
}
