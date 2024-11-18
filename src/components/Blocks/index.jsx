import loadable from '@loadable/component';

export const DataTableBlockView = loadable(() =>
  import('./DataTableBlock/View'),
);

export const DataTableBlockEdit = loadable(() =>
    import('./DataTableBlock/Edit'),
  );
  