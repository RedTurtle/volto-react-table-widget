import ReactTableWidget from './components/Widgets/ReactTableWidget';
export { ReactTableWidget };
import {DataTableBlockView, DataTableBlockEdit} from './components/Blocks';

import IconSVG from '@plone/volto/icons/registry-resources.svg';

export const dataTableBlock = {
  id: 'dataTableBlock',
  title: 'Data Table',
  icon: IconSVG,
  group: 'common',
  view: DataTableBlockView,
  edit: DataTableBlockEdit,
  restricted: false,
  mostUsed: false,
  security: {
    addPermission: [],
    view: [],
  },
  // templates: {
  //   default: { label: 'Default template', template: DefaultRSSTemplate },
  // },
  sidebarTab: 1,
}

const applyConfig = (config) => {
  config.blocks.blocksConfig = {
    ...config.blocks.blocksConfig,
    dataTableBlock,
  };
  return config;
};

export default applyConfig;
