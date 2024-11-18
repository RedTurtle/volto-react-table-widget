import './react-table-widget.css';

import { Button, Modal, Segment, Grid, Checkbox, Label } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';

import { CSVLink } from 'react-csv';
import EditableTable from './EditableTable';
import React from 'react';
import { Toast } from '@plone/volto/components';
import { toast } from 'react-toastify';
import { useCSVReader } from 'react-papaparse';
import { v4 as uuid } from 'uuid';

const messages = defineMessages({
  csv_file_imported_correctly: {
    id: 'CSV file imported correctly',
    defaultMessage: 'CSV file imported correctly',
  },
  import_new_imported_item_count: {
    id: 'Imported item count',
    defaultMessage: '{count} new items imported',
  },
  import_modified_item_count: {
    id: 'Modified item count',
    defaultMessage: '{count} items modified',
  },
  import_csv_file: {
    id: 'Import CSV file',
    defaultMessage: 'Import CSV file',
  },
  export_csv_file: {
    id: 'Export CSV file',
    defaultMessage: 'Export CSV file',
  },
  undo_all_modifications: {
    id: 'Undo all modifications',
    defaultMessage: 'Undo all modifications',
  },
  undo_header: {
    id: 'Undo',
    defaultMessage: 'Undo',
  },
  undo_message: {
    id: 'Undo message',
    defaultMessage: 'Undo message',
  },
});

const ReactDataTableWidget = (props) => {
  const {
    schema,
    updateSchema,
    value,
    onChange,
    id,
    csvexport,
    csvimport,
    undomodifications,
    fieldSet,
  } = props;

  const intl = useIntl();
  const header_columns = schema.fieldsets[0].fields.map((field) => {
    return { Header: schema.properties[field]?.title, accessor: field };
  });

  const tablecolumns = React.useMemo(
    () => [...header_columns],
    [header_columns],
  );

  const [originalData] = React.useState(value);
  const [hasModifiedData, setHasModifiedData] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [updateSchemaOnImport, setUpdateSchemaOnImport] = React.useState(false);

  const updateCell = (rowIndex, columnId, updateValue) => {
    setHasModifiedData(true);
    const newvalue = value.map((v, i) =>
      i !== rowIndex ? v : { ...v, [columnId]: updateValue },
    );
    onChange(id, newvalue);
  };

  const removeRow = (event, rowIndex, pageIndex, pageSize) => {
    setHasModifiedData(true);
    if (event.type === 'click' || event.key === 'Enter') {
      setSelectedRow(pageIndex * pageSize + rowIndex);
      const newvalue = value.filter(
        (v, i) => i !== pageIndex * pageSize + rowIndex,
      );
      onChange(id, newvalue);
    }
  };

  const addRowAfter = (event, rowIndex, pageIndex, pageSize) => {
    setHasModifiedData(true);
    if (event.type === 'click' || event.key === 'Enter') {
      let newRowValue = {};
      schema.fieldsets[0].fields.forEach((field) => {
        newRowValue[field] = '';
      });
      setSelectedRow(pageIndex * pageSize + rowIndex + 1);
      const newvalue = [
        ...value.slice(0, pageIndex * pageSize + rowIndex + 1),
        { '@id': uuid(), ...newRowValue },
        ...value.slice(pageIndex * pageSize + rowIndex + 1),
      ];
      onChange(id, newvalue);
    }
  };

  const resetData = () => {
    onChange(id, originalData);
    setSelectedRow(0);
    setHasModifiedData(false);
  };

  const csvcolumns = tablecolumns.map((d) => {
    return {
      label: d.accessor,
      key: d.accessor,
    };
  });

  csvcolumns.push({
    label: '@id',
    key: '@id',
  });

  const { CSVReader } = useCSVReader();
  return (
    <div className="inline field">
      {(schema.title || schema.description) && <Grid>
        <Grid.Row stretched>
          <Grid.Column width={4}>
            <div className="wrapper">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
              <label id={`fieldset-${fieldSet}-field-label-${id}`}>
                {schema.title}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width={8}>
            <p className="help">{schema.description}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>}
      <Segment basic textAlign="center">
        {undomodifications && (
          <Modal
            trigger={
              <Button
                onClick={(e) => {
                  e.preventDefault();
                }}
                disabled={!hasModifiedData}
              >
                {intl.formatMessage(messages.undo_all_modifications)}
              </Button>
            }
            header={intl.formatMessage(messages.undo_header)}
            content={intl.formatMessage(messages.undo_message)}
            actions={[
              'Cancel',
              {
                key: 'ok',
                content: 'OK',
                positive: true,
                onClick: () => {
                  resetData();
                },
              },
            ]}
          />
        )}

        {csvexport && (
          <CSVLink
            className="ui button"
            filename={`${schema.title} export.csv`}
            separator=";"
            data={value}
          >
            {intl.formatMessage(messages.export_csv_file)}
          </CSVLink>
        )}

        {csvimport && (
          <>
            <CSVReader
              onUploadAccepted={(results) => {
                let newdatacount = 0;
                const newdata = results.data.map((item) => {
                  if (!item['@id']) {
                    newdatacount += 1;
                    return {
                      ...item,
                      '@id': uuid(),
                    };
                  }
                  return item;
                });
                const modifiedcount = newdata.length - newdatacount;
                onChange(id, newdata);
                if (updateSchemaOnImport && results.data.length > 0) {
                  const imported_fields = Object.keys(results.data[0]);
                  const schema_fields = schema.fieldsets?.[0]?.fields || [];
                  const schema_properties = schema.properties || {};
                  imported_fields.forEach((field) => {
                    if (!schema_fields.includes(field)) {
                      schema_fields.push(field);
                    }
                    if (!schema_properties[field]) {
                      schema_properties[field] = {
                        factory: "label_textline_field",
                        id: field,
                        title: field,
                        type: "string",
                      };
                    }
                  })
                  updateSchema({
                    schema: {
                      ...schema,
                      fieldsets: [
                        {
                          ...schema.fieldsets?.[0],
                          fields: schema_fields,
                        }
                      ],
                      prooperties: schema_properties,
                    }
                  })
                }
                toast.success(
                  <Toast
                    success
                    autoClose={5000}
                    content={`${intl.formatMessage(
                      messages.csv_file_imported_correctly,
                    )} ${intl.formatMessage(
                      messages.import_new_imported_item_count,
                      {
                        count: newdatacount,
                      },
                    )} ${intl.formatMessage(messages.import_modified_item_count, {
                      count: modifiedcount,
                    })}`}
                  />,
                );
              }}
              config={{ header: true }}
            >
              {({ getRootProps, ProgressBar }) => (
                <>
                  <Button type="button" {...getRootProps()}>
                    {intl.formatMessage(messages.import_csv_file)}
                  </Button>
                  <ProgressBar />
                </>
              )}
            </CSVReader>
            <Checkbox
              id={`${id}_update_schema`}
              value={updateSchemaOnImport}
              onChange={() => { setUpdateSchemaOnImport(!updateSchemaOnImport) }}
              label={<label htmlFor={`${id}_update_schema`}>Update schema</label>}
            />
          </>
        )}

        <EditableTable
          columns={tablecolumns}
          data={value}
          updateCell={updateCell}
          removeRow={removeRow}
          addRowAfter={addRowAfter}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          schema={schema}
        />
      </Segment>
    </div>
  );
};

export default ReactDataTableWidget;
