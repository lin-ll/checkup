import { stdout, getTaskContext, EmberProject } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import EmberInRepoAddonEnginesTask from '../src/tasks/ember-in-repo-addons-engines-task';
import EmberInRepoAddonEnginesTaskResult from '../src/results/ember-in-repo-addons-engines-task-result';

describe('ember-in-repo-addons-engines-task', () => {
  let emberProject: EmberProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(() => {
    emberProject = new EmberProject('checkup-app', '0.0.0', (emberProject) => {
      emberProject.addDependency('ember-cli', '^3.15.0');
    });
    emberProject.addInRepoAddon('admin', 'latest');
    emberProject.addInRepoAddon('shopping-cart', 'latest');
    emberProject.addInRepoEngine('foo-engine', 'latest');
    emberProject.addInRepoEngine('shmoo-engine', 'latest');
    emberProject.writeSync();
  });

  afterEach(() => {
    emberProject.dispose();
  });

  it('can read task and output to console', async () => {
    const result = await new EmberInRepoAddonEnginesTask(
      pluginName,
      getTaskContext({}, { cwd: emberProject.baseDir })
    ).run();
    const taskResult = <EmberInRepoAddonEnginesTaskResult>result;

    taskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('can read task as JSON', async () => {
    const result = await new EmberInRepoAddonEnginesTask(
      pluginName,
      getTaskContext({}, { cwd: emberProject.baseDir })
    ).run();
    const taskResult = <EmberInRepoAddonEnginesTaskResult>result;

    expect(taskResult.toJson()).toMatchSnapshot();
  });
});
