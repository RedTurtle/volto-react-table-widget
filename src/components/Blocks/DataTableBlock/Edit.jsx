import { ReactTableWidget } from '@eeacms/volto-react-table-widget';
import { SidebarPortal } from '@plone/volto/components';
import { useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
// import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { InlineForm } from '@plone/volto/components/manage/Form';

const messages = defineMessages({
  no_filter: {
    id: 'no_filter',
    defaultMessage: 'No filter',
  },
  select_value_filter: {
    id: 'select_value_filter',
    defaultMessage: 'Select value',
  },
  text_filter: {
    id: 'text_filter',
    defaultMessage: 'Text filter',
  },
});

const emptySchema = () => {
  return {
    properties: {},
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [],
      },
    ],
    required: [],
  };
};

const Edit = (props) => {
  const { block, data, onChangeBlock, selected } = props;
  const intl = useIntl();
  const onChange = (id, props) => {
    const { items, schema } = props;
    onChangeBlock(block, {
      ...data,
      items: items,
      schema: schema || data.schema,
    });
  };

  const contentTypeSchema = {
    title: 'Schema',
    type: 'object',
    fieldsets: [
      {
        fields: ['schema'],
        id: 'default',
        title: 'Default',
      },
    ],
    properties: {
      schema: {
        description: 'Form schema',
        title: 'Form schema',
        type: 'schema',
        id: 'schema',
        widget: 'schema',
      },
    },
    required: [],
    layouts: null,
  };

  const schema = useMemo(() => {
    if (data?.schema) {
      return data.schema;
    } else {
      return emptySchema();
    }
  }, [data?.schema]);

  const onChangeFilterable = (field, value) => {
    const filterable = data?.filterable || {};
    onChangeBlock(block, {
      ...data,
      filterable: { ...filterable, [field]: value },
    });
  };

  return (
    <>
      <ReactTableWidget
        id={`${block}_table_widget`}
        schema={schema}
        csvexport={true}
        csvimport={true}
        undomodifications={false}
        value={data?.items || []}
        onChange={(id, items, schema) => onChange(id, { items, schema })}
        columnActions={(column) => (
          <div>
            <select
              value={data?.filterable?.[column.id] || ''}
              onChange={(e) => onChangeFilterable(column.id, e.target.value)}
            >
              <option value="">{intl.formatMessage(messages.no_filter)}</option>
              <option value="includes">
                {intl.formatMessage(messages.select_value_filter)}
              </option>
              <option value="contains">
                {intl.formatMessage(messages.text_filter)}
              </option>
            </select>
          </div>
        )}
      />
      <SidebarPortal selected={selected}>
        <InlineForm
          schema={contentTypeSchema}
          formData={{ schema: schema }}
          onChangeBlock={onChangeBlock}
          onChangeField={(id, value, itemInfo) => {
            console.log(id, value, itemInfo);
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          applySchemaEnhancers={false}
          hideActions
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
