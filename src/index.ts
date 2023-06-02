import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { ISettingRegistry } from "@jupyterlab/settingregistry";

import { WidgetTracker } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { WebDSService, WebDSWidget } from "@webds/service";

import { defaultIcon } from "./icons";

import RamBackdoorWidget from "./widget/RamBackdoorWidget";

namespace Attributes {
  export const command = "webds_ram_backdoor:open";
  export const id = "webds_ram_backdoor_widget";
  export const label = "Ram Backdoor";
  export const caption = "Ram Backdoor";
  export const category = "DSDK - Applications";
  export const rank = 999;
}

export let webdsService: WebDSService;

/**
 * Initialization data for the @webds/ram_backdoor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: "@webds/ram_backdoor:plugin",
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log("JupyterLab extension @webds/ram_backdoor is activated!");

    webdsService = service;

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('@webds/ram_backdoor settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for @webds/ram_backdoor.', reason);
        });
    }

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = Attributes.command;
    commands.addCommand(command, {
      label: Attributes.label,
      caption: Attributes.caption,
      icon: (args: { [x: string]: any }) => {
        return args["isLauncher"] ? defaultIcon : undefined;
      },
      execute: () => {
        if (!widget || widget.isDisposed) {
          const content = new RamBackdoorWidget(Attributes.id);
          widget = new WebDSWidget<RamBackdoorWidget>({ content });
          widget.id = Attributes.id;
          widget.title.label = Attributes.label;
          widget.title.icon = defaultIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget)) tracker.add(widget);

        if (!widget.isAttached) shell.add(widget, "main");

        shell.activateById(widget.id);
      }
    });

    launcher.add({
      command,
      args: { isLauncher: true },
      category: Attributes.category,
      rank: Attributes.rank
    });

    let tracker = new WidgetTracker<WebDSWidget>({
      namespace: Attributes.id
    });
    restorer.restore(tracker, {
      command,
      name: () => Attributes.id
    });
  }
};

export default plugin;
