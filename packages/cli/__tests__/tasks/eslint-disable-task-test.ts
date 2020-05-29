import { CheckupProject, stdout, getTaskContext, clearFilePaths } from '@checkup/test-helpers';

import EslintDisableTask from '../../src/tasks/eslint-disable-task';
import EslintDisableTaskResult from '../../src/results/eslint-disable-task-result';

describe('eslint-disable-task', () => {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject('foo', '0.0.0');
    project.files['index.js'] = `
    // eslint-disable-line no-eval
    /* eslint-disable */

    function foo(obj) { // adding this here because without babel parser, recast fails on this
      return {     // eslint-disable-line
        ...obj
      }
    }
    `;

    project.writeSync();
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the types found in the app and outputs to the console', async () => {
    const result = await new EslintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const eslintDisableTaskResult = <EslintDisableTaskResult>result;

    eslintDisableTaskResult.toConsole();

    expect(stdout()).toMatchInlineSnapshot(`
      "=== Number of Eslint Overrides ===

      Eslint Overrides Found: 3

      "
    `);
  });

  it('returns all the types found in the app and outputs to json', async () => {
    const result = await new EslintDisableTask(
      'internal',
      getTaskContext({
        paths: project.filePaths,
      })
    ).run();
    const eslintDisableTaskResult = <EslintDisableTaskResult>result;

    const json = eslintDisableTaskResult.toJson();
    expect({ ...json, ...{ result: clearFilePaths(json.result.eslintDisables) } })
      .toMatchInlineSnapshot(`
      Object {
        "meta": Object {
          "friendlyTaskName": "Number of Eslint Overrides",
          "taskClassification": Object {
            "category": "insights",
            "priority": "low",
          },
          "taskName": "eslint-disables",
        },
        "result": Array [
          Object {
            "data": Array [
              1,
            ],
          },
          Object {
            "data": Array [
              1,
            ],
          },
          Object {
            "data": Array [
              1,
            ],
          },
        ],
      }
    `);
  });
});