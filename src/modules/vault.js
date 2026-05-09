export function computeSafeBalance(totalFunds, goals = [], bills = []) {
  const goalSum = goals.reduce((sum, goal) => sum + (goal.amount || 0), 0);
  const billSum = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  return Math.max(0, totalFunds - goalSum - billSum);
}
