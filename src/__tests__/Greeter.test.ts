import { JsonFileStorage, UpdateApp } from '../index';

test('My Greeter', () => {
  expect(new JsonFileStorage('/test.json',"/files").getLatestVersion()).toBe("0.0.0");
});