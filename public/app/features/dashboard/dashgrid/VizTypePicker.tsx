import React, { PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { FadeIn } from 'app/core/components/Animations/FadeIn';
import config from 'app/core/config';
import { PanelPlugin } from 'app/types/plugins';

interface Props {
  current: PanelPlugin;
  onTypeChanged: (newType: PanelPlugin) => void;
  isOpen: boolean;
}

interface State {
  pluginList: PanelPlugin[];
}

export class VizTypePicker extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      pluginList: this.getPanelPlugins(''),
    };
  }

  getPanelPlugins(filter) {
    const panels = _.chain(config.panels)
      .filter({ hideFromList: false })
      .map(item => item)
      .value();

    // add sort by sort property
    return _.sortBy(panels, 'sort');
  }

  renderVizPlugin = (plugin, index) => {
    const cssClass = classNames({
      'viz-picker__item': true,
      'viz-picker__item--selected': plugin.id === this.props.current.id,
    });

    return (
      <div key={index} className={cssClass} onClick={() => this.props.onTypeChanged(plugin)} title={plugin.name}>
        <div className="viz-picker__item-name">{plugin.name}</div>
        <img className="viz-picker__item-img" src={plugin.info.logos.small} />
      </div>
    );
  };

  renderFilters() {
    return (
      <>
        <label className="gf-form--has-input-icon">
          <input type="text" className="gf-form-input width-13" placeholder="" />
          <i className="gf-form-input-icon fa fa-search" />
        </label>
        <div className="p-l-1">
          <button className="btn toggle-btn gf-form-btn active">Basic Types</button>
          <button className="btn toggle-btn gf-form-btn">Master Types</button>
        </div>
      </>
    );
  }

  render() {
    const { current, isOpen } = this.props;
    const { pluginList } = this.state;

    return (
      <FadeIn in={isOpen} duration={300}>
        <div className="viz-picker">
          <div className="cta-form">
            <button className="cta-form__close">
              <i className="fa fa-remove" />
            </button>

            <div className="cta-form__bar">
              <div className="cta-form__bar-header">Select visualization</div>
              {this.renderFilters()}
              <div className="gf-form--grow" />
            </div>

            <div className="viz-picker__items">{pluginList.map(this.renderVizPlugin)}</div>
          </div>
        </div>
      </FadeIn>
    );
  }
}