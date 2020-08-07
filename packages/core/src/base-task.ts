import * as debug from 'debug';

import { TaskContext, TaskName } from './types/tasks';

import { TaskConfig, ConfigValue } from './types/config';
import { getShorthandName } from './utils/plugin-name';
import { parseConfigTuple } from './config';

export default abstract class BaseTask {
  abstract taskName: TaskName;
  abstract taskDisplayName: string;
  abstract category: string;
  group?: string;
  context: TaskContext;
  debug: debug.Debugger;

  _pluginName: string;
  _config!: TaskConfig;
  _enabled!: boolean;

  constructor(pluginName: string, context: TaskContext) {
    this._pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');
  }

  get config() {
    this._parseConfig();

    return this._config;
  }

  get enabled() {
    this._parseConfig();

    return this._enabled;
  }

  get fullyQualifiedTaskName() {
    return `${this._pluginName}/${this.taskName}`;
  }

  toJson<T>(data: T) {
    return {
      info: {
        taskName: this.taskName,
        taskDisplayName: this.taskDisplayName,
        category: this.category,
        group: this.group,
      },
      result: data,
    };
  }

  private _parseConfig() {
    if (this._config) {
      return;
    }

    let config: ConfigValue<TaskConfig> | undefined = this.context.config.tasks[
      this.fullyQualifiedTaskName
    ];

    let [enabled, taskConfig] = parseConfigTuple<TaskConfig>(config);

    this._enabled = enabled;
    this._config = taskConfig;

    this.debug('%s enabled: %s', this.fullyQualifiedTaskName, this._enabled);
    this.debug('%s task config: %O', this.fullyQualifiedTaskName, this._config);
  }
}
