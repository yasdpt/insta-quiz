import { calculateScore } from "../events/answer";

test("Answer time 6 returns perfect 10 score", () => {
  expect(calculateScore(6)).toBe(10);
});

test("Answer time 15 returns 1 score", () => {
  expect(calculateScore(15)).toBe(1);
});

test("Answer time 10 returns 6 score", () => {
  expect(calculateScore(10)).toBe(6);
});

test("Answer time 2 returns perfect 10 score", () => {
  expect(calculateScore(2)).toBe(10);
});

test("Answer time 16 returns 0 score", () => {
  expect(calculateScore(16)).toBe(0);
});

test("Answer time 20 returns 0 score", () => {
  expect(calculateScore(20)).toBe(0);
});
