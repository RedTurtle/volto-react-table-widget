import { defineMessages, useIntl } from 'react-intl';
import {
  Button,
  Checkbox,
  Grid,
  Label,
  Modal,
  ModalContent,
  ModalHeader,
  Segment,
} from 'semantic-ui-react';

import { Icon, Toast } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import plusSVG from '@plone/volto/icons/circle-plus.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';
import { CSVLink } from 'react-csv';
// TODO: replace papaparse
import { useCSVReader } from 'react-papaparse';
import { useTable } from 'react-table';
import { toast } from 'react-toastify';
import { compose } from 'redux';
import { Pagination, Table } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { useState, useMemo } from 'react';

const messages = defineMessages({
  csv_file_imported_correctly: {
    id: 'CSV file imported correctly',
    defaultMessage: 'CSV file imported correctly',
  },
  total_item_count: {
    id: 'Item count',
    defaultMessage: '{count} new items to import',
  },
  preview_item_count: {
    id: 'Preview item count',
    defaultMessage: '{count} items preview',
  },
  import_modified_item_count: {
    id: 'Modified item count',
    defaultMessage: '{count} items modified',
  },
  import_csv_file: {
    id: 'Select CSV file',
    defaultMessage: 'Select CSV file',
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

const ModalImport = ({
  id,
  onChange,
  // schema,
  // onChangeSchema,
  showModalImport,
  setShowModalImport,
  // updateSchema,
}) => {
  const { CSVReader } = useCSVReader();
  // const [updateSchemaOnImport, setUpdateSchemaOnImport] = useState(true);
  const intl = useIntl();
  const [result, setResult] = useState({
    schema: null,
    data: null,
    error: null,
  });

  return (
    <Modal
      open={showModalImport}
      size="fullscreen"
      // trigger={
      //     <Button
      //         onClick={(e) => {
      //             e.preventDefault();
      //         }}
      //         disabled={!hasModifiedData}
      //     >
      //         {intl.formatMessage(messages.undo_all_modifications)}
      //     </Button>
      // }
      // header={intl.formatMessage(messages.undo_header)}
      // content={intl.formatMessage(messages.undo_message)}
      // actions={[
      //     'Cancel',
      //     {
      //         key: 'ok',
      //         content: 'OK',
      //         positive: true,
      //         onClick: () => {
      //             resetData();
      //         },
      //     },
      // ]}
    >
      <ModalHeader></ModalHeader>
      <ModalContent>
        {
          !result.data && (
            <>
              <CSVReader
                accept=".csv"
                onUploadAccepted={(results) => {
                  // console.log(results);
                  let newdatacount = 0;
                  const newdata = results.data.map((item) => {
                    if ('' in item) {
                      item['_'] = item[''];
                      delete item[''];
                    }
                    if (!item['@id']) {
                      newdatacount += 1;
                      return {
                        ...item,
                        '@id': uuid(),
                      };
                    }
                    return item;
                  });
                  // const modifiedcount = newdata.length - newdatacount;
                  if (results.data.length > 0) {
                    const imported_fields = Object.keys(results.data[0]);
                    const schema_fields = []; // schema.fieldsets?.[0]?.fields || [];
                    const schema_properties = {}; // schema.properties || {};
                    imported_fields.forEach((field) => {
                      if (!schema_fields.includes(field)) {
                        schema_fields.push(field);
                      }
                      if (!schema_properties[field]) {
                        schema_properties[field] = {
                          factory: 'label_textline_field',
                          id: field,
                          title: field,
                          type: 'string',
                        };
                      }
                    });
                    // schema.fieldsets = [
                    //   {
                    //     ...schema.fieldsets?.[0],
                    //     fields: schema_fields,
                    //   },
                    // ];
                    // schema.properties = schema_properties;
                    // onChange(id, newdata, schema);
                    setResult({
                      data: newdata,
                      schema: {
                        fieldsets: [
                          {
                            // ...schema.fieldsets?.[0],
                            fields: schema_fields,
                          },
                        ],
                        properties: schema_properties,
                      },
                    });
                  } else {
                    // onChange(id, newdata);
                    setResult({
                      data: newdata,
                      schema: null,
                    });
                  }
                  // toast.success(
                  //   <Toast
                  //     success
                  //     autoClose={5000}
                  //     content={`${intl.formatMessage(
                  //       messages.csv_file_imported_correctly,
                  //     )} ${intl.formatMessage(
                  //       messages.import_new_imported_item_count,
                  //       {
                  //         count: newdatacount,
                  //       },
                  //     )} ${intl.formatMessage(messages.import_modified_item_count, {
                  //       count: modifiedcount,
                  //     })}`}
                  //   />,
                  // );
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
              <Button
                onClick={() => {
                  setResult({ schema: null, data: null, error: null });
                  setShowModalImport(false);
                }}
              >
                Cancel
              </Button>
            </>
          )
          // <Checkbox
          //   id={`${id}_update_schema`}
          //   value={updateSchemaOnImport}
          //   onChange={() => { setUpdateSchemaOnImport(!updateSchemaOnImport) }}
          //   label={<label htmlFor={`${id}_update_schema`}>Update schema</label>}
          // />
        }

        {result.data && (
          <>
            <p>
              {intl.formatMessage(messages.total_item_count, {
                count: result.data.length,
              })}
            </p>
            <p>
              {result.data.length > 9 &&
                intl.formatMessage(messages.preview_item_count, {
                  count: 9,
                })}
            </p>
            <Preview schema={result.schema} data={result.data.slice(0, 9)} />
            <Button
              onClick={() => {
                onChange && onChange(id, result.data, result.schema);
                // onChangeSchema && onChangeSchema({schema: result.schema} );
                setResult({ schema: null, data: null, error: null });
                setShowModalImport(false);
              }}
            >
              Import
            </Button>

            <Button
              onClick={() => {
                setResult({ schema: null, data: null, error: null });
                setShowModalImport(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const Preview = ({ schema, data }) => {
  const columns = schema.fieldsets[0].fields.map((field) => {
    return { Header: schema.properties[field]?.title, accessor: field };
  });

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
    });

  return (
    <Table celled {...getTableProps()}>
      <Table.Header>
        {headerGroups.map((headerGroup, key) => (
          <Table.Row key={key} {...headerGroup.getHeaderGroupProps()}>
            <Table.HeaderCell>#</Table.HeaderCell>
            {headerGroup.headers.map((column) => (
              <Table.HeaderCell
                {...column.getHeaderProps()}
                style={{ whiteSpace: 'nowrap' }}
              >
                {column.render('Header')}
                {/* <button on onClick={}>delete column</button> */}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Table.Row {...row.getRowProps()}>
              <Table.Cell>{i + 1}</Table.Cell>
              {row.cells.map((cell) => {
                return (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default ModalImport;
