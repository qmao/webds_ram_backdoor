import React from "react";

import { ReactWidget } from "@jupyterlab/apputils";

import RamBackdoorComponent from "./RamBackdoorComponent";

export class RamBackdoorWidget extends ReactWidget {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  render(): JSX.Element {
    return (
      <div id={this.id + "_component"}>
        <RamBackdoorComponent />
      </div>
    );
  }
}

export default RamBackdoorWidget;
