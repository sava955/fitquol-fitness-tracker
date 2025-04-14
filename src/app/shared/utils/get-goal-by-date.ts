import { Goal } from '../../core/models/goals/goal';

export function getGoalByDate(goals: Goal[], value: Date): Goal {
  const goal = goals
    .filter((d: Goal) => new Date(d.fromDate) <= new Date(setDate(value)))
    .sort(
      (a: Goal, b: Goal) =>
        new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
    )[0];

  return goal;
}

function setDate(date: Date): string {
  const d = new Date(date);
  const timezoneOffset = d.getTimezoneOffset();

  d.setHours(0, 0, 0, 0);
  d.setMinutes(d.getMinutes() - timezoneOffset);

  return d.toISOString();
}
