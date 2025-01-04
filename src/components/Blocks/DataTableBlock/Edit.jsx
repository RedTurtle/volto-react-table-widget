import { ReactTableWidget } from '@eeacms/volto-react-table-widget';
import {
  Error,
  Form,
  Icon,
  Toast,
  Toolbar,
  SidebarPortal,
} from '@plone/volto/components';
import { useEffect, useState, useMemo, useRef } from 'react';
import { FormGroup, FormField, Radio } from 'semantic-ui-react';
import { Checkbox } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';

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

const Edit = ({ block, data, onChangeBlock, selected }) => {
  const intl = useIntl();
  // const form = useRef();
  const onChange = (id, props) => {
    const { items, schema } = props;
    // console.log("change data")
    onChangeBlock(block, {
      ...data,
      items: items,
      schema: schema || data.schema,
    });
    // if (schema) {
    //     debugger;
    //     console.log(form);
    // }
    // form.current.forceUpdate();
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

  const onChangeSchema = ({ schema }) => {
    onChangeBlock(block, {
      ...data,
      schema: schema,
    });
  };

  const schema = useMemo(() => {
    if (data?.schema) {
      return data.schema;
    } else {
      return emptySchema();
    }
  }, [data?.schema]);

  // const fields = data?.schema?.fieldsets?.[0]?.fields || [];

  // const onChangeSortable = (value, checked) => {
  //     console.log(value, checked);
  //     const sortable = data?.sortable || [];
  //     onChangeBlock(block, {
  //         ...data,
  //         sortable: checked ? [...sortable, value]: sortable.filter((f) => f !== value),
  //     });
  //     console.log(checked ? [...sortable, value]: sortable.filter((f) => f !== value));
  // };

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
        undomodifications={true}
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
            {/* <pre>{JSON.stringify(column, null, 2)}</pre> */}
          </div>
        )}
      />

      <SidebarPortal selected={selected}>
        <h3>Schema dati</h3>
        <Form
          schema={contentTypeSchema}
          formData={{ schema: schema }}
          onChangeFormData={onChangeSchema}
          hideActions
        />
        {/* <pre>{JSON.stringify(data?.schema, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(data?.sortable, null, 2)}</pre> */}
      </SidebarPortal>
    </>
  );
};

export default Edit;
