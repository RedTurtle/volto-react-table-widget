import ReactTableWidget from './components/Widgets/ReactTableWidget';
export { ReactTableWidget };
import { DataTableBlockView, DataTableBlockEdit } from './components/Blocks';
import { defineMessages } from 'react-intl';

import IconSVG from '@plone/volto/icons/registry-resources.svg';

import ImageSettingsSchema from '@plone/volto/components/manage/Blocks/Image/LayoutSchema';
import EditImageBlock from '@plone/volto/components/manage/Blocks/Image/Edit';

defineMessages({
  DataTableBlock: {
    id: 'DataTableBlock',
    defaultMessage: 'Data Table',
  },
});

const dataTableBlock = {
  id: 'dataTableBlock',
  title: 'Data Table',
  icon: IconSVG,
  group: 'common',
  view: DataTableBlockView,
  edit: DataTableBlockEdit,
  // edit: EdiImageBlock,
  // schema: ImageSettingsSchema,

  restricted: false,
  mostUsed: false,
  security: {
    addPermission: [],
    view: [],
  },
  sidebarTab: 1,
};

const applyConfig = (config) => {
  config.blocks.blocksConfig = {
    ...config.blocks.blocksConfig,
    dataTableBlock,
  };
  return config;
};

export default applyConfig;
