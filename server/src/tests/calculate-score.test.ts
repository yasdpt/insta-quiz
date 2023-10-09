import { calculateScore } from "../events/answer";

test("Answer time 6 returns perfect 10 score", () => {
  expect(calculateScore(6)).toBe(10);
});

test("Answer time 15 returns 5 score", () => {
  expect(calculateScore(15)).toBe(5);
});

test("Answer time 10 returns 8 score", () => {
  expect(calculateScore(10)).toBe(8);
});

test("Answer time 7 returns 9 score", () => {
  expect(calculateScore(7)).toBe(9);
});

test("Answer time 8 returns 9 score", () => {
  expect(calculateScore(8)).toBe(9);
});

test("Answer time 2 returns perfect 10 score", () => {
  expect(calculateScore(2)).toBe(10);
});

test("Answer time 16 returns 6 score", () => {
  expect(calculateScore(16)).toBe(5);
});

test("Answer time 20 returns 0 score", () => {
  expect(calculateScore(20)).toBe(1);
});

test("Answer time 17 returns 0 score", () => {
  expect(calculateScore(17)).toBe(4);
});
