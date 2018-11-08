import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { QueriesTab } from './QueriesTab';
import { VizTypePicker } from './VizTypePicker';
import { EditSection } from './EditSection';
import CustomScrollbar from 'app/core/components/CustomScrollbar/CustomScrollbar';

import { store } from 'app/store/configureStore';
import { updateLocation } from 'app/core/actions';

import { PanelModel } from '../panel_model';
import { DashboardModel } from '../dashboard_model';
import { PanelPlugin } from 'app/types/plugins';

interface PanelEditorProps {
  panel: PanelModel;
  dashboard: DashboardModel;
  plugin: PanelPlugin;
  onTypeChanged: (newType: PanelPlugin) => void;
}

interface PanelEditorTab {
  id: string;
  text: string;
  icon: string;
}

interface State {
  showVizPicker: boolean;
}

export class PanelEditor extends PureComponent<PanelEditorProps, State> {
  tabs: PanelEditorTab[];

  constructor(props) {
    super(props);

    this.tabs = [
      { id: 'queries', text: 'Queries', icon: 'fa fa-database' },
      { id: 'visualization', text: 'Visualization', icon: 'fa fa-line-chart' },
      { id: 'alert', text: 'Alert', icon: 'gicon gicon-alert' },
    ];

    this.state = {
      showVizPicker: false,
    };
  }

  renderQueriesTab() {
    return <QueriesTab panel={this.props.panel} dashboard={this.props.dashboard} />;
  }

  renderPanelOptions() {
    const { plugin, panel } = this.props;
    const { PanelOptionsComponent } = plugin.exports;

    if (PanelOptionsComponent) {
      return <PanelOptionsComponent options={panel.getOptions()} onChange={this.onPanelOptionsChanged} />;
    } else {
      return <p>Visualization has no options</p>;
    }
  }

  onPanelOptionsChanged = (options: any) => {
    this.props.panel.updateOptions(options);
    this.forceUpdate();
  };

  onToggleVizSelect = () => {
    this.setState({ showVizPicker: !this.state.showVizPicker });
  };

  renderVizTab() {
    return (
      <EditSection
        nr="2"
        title="Visualization"
        selectedText="Bar Chart"
        selectedImage="public/app/plugins/panel/graph/img/icn-graph-panel.svg"
        onToggleSelect={this.onToggleVizSelect}
      >
      <div className="viz-editor">
        <VizTypePicker current={this.props.plugin} onTypeChanged={this.props.onTypeChanged}
          isOpen={this.state.showVizPicker} />
        {this.renderPanelOptions()}
      </div>
    </EditSection>
    );
  }

  renderAlertTab() {
    return (
      <EditSection
        nr="3"
        title="Alert Rule"
      >
      <div className="viz-editor">
      </div>
    </EditSection>
    );
  }

  onChangeTab = (tab: PanelEditorTab) => {
    store.dispatch(
      updateLocation({
        query: { tab: tab.id },
        partial: true,
      })
    );
    this.forceUpdate();
  };

  onClose = () => {
    store.dispatch(
      updateLocation({
        query: { tab: null, fullscreen: null, edit: null },
        partial: true,
      })
    );
  };

  render() {
    // return this.renderAsTabs();
    return this.renderAsBoxes();
    // const { location } = store.getState();
    // const activeTab = location.query.tab || 'queries';
    //
    // return (
    //   <div className="panel-editor-container__editor">
    //     <div className="panel-editor-resizer">
    //       <div className="panel-editor-resizer__handle">
    //         <div className="panel-editor-resizer__handle-dots" />
    //       </div>
    //     </div>
    //     <div className="panel-editor__aside">
    //       <h2 className="panel-editor__aside-header">
    //         <i className="fa fa-cog" />
    //         Edit Panel
    //       </h2>
    //
    //       {this.tabs.map(tab => {
    //         return <TabItem tab={tab} activeTab={activeTab} onClick={this.onChangeTab} key={tab.id} />;
    //       })}
    //
    //       <div className="panel-editor__aside-actions">
    //         <button className="btn btn-secondary" onClick={this.onClose}>
    //           Back to dashboard
    //         </button>
    //         <button className="btn btn-inverse" onClick={this.onClose}>
    //           Discard changes
    //         </button>
    //       </div>
    //     </div>
    //     <div className="panel-editor__content">
    //       <CustomScrollbar>
    //         {activeTab === 'queries' && this.renderQueriesTab()}
    //         {activeTab === 'visualization' && this.renderVizTab()}
    //       </CustomScrollbar>
    //     </div>
    //   </div>
    // );
  }

  renderAsBoxes() {
    const { location } = store.getState();
    const { panel } = this.props;
    const activeTab = location.query.tab || 'queries';

    return (
      <div className="panel-editor-container__editor">
        <div className="panel-editor-resizer">
          <div className="panel-editor-resizer__handle">
            <div className="panel-editor-resizer__handle-dots" />
          </div>
        </div>

        <CustomScrollbar>
          {this.renderQueriesTab()}
          {this.renderVizTab()}
          {this.renderAlertTab()}
        </CustomScrollbar>
      </div>
    );
  }
}

interface TabItemParams {
  tab: PanelEditorTab;
  activeTab: string;
  onClick: (tab: PanelEditorTab) => void;
}

function TabItem({ tab, activeTab, onClick }: TabItemParams) {
  const tabClasses = classNames({
    'panel-editor__aside-item': true,
    active: activeTab === tab.id,
  });

  return (
    <a className={tabClasses} onClick={() => onClick(tab)}>
      <i className={tab.icon} /> {tab.text}
    </a>
  );
}

function OldTabItem({ tab, activeTab, onClick }: TabItemParams) {
  const tabClasses = classNames({
    'gf-tabs-link': true,
    active: activeTab === tab.id,
  });

  return (
    <li className="gf-tabs-item" onClick={() => onClick(tab)}>
      <a className={tabClasses}>{tab.text}</a>
    </li>
  );
}