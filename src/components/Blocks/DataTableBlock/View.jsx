import { ReactTableWidget } from '@eeacms/volto-react-table-widget';
import { usePagination, useTable } from 'react-table';
import { Pagination, Table } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';

const mockschema = {
    title: 'Downloadable File',
    properties: {
      title: {
        title: 'Title',
        description: 'Enter the title of this file.',
        type: 'string',
      },
      file: {
        title: 'File name',
        description: 'Enter the file name.',
        type: 'string',
      },
      area: {
        title: 'Area of interest',
        description: 'Enter the area of this file.',
        type: 'string',
      },
      year: {
        title: 'Year',
        description: 'Enter the year of this file.',
        type: 'number',
        minimum: 1900,
      },
      version: {
        title: 'Version',
        description: 'Enter the version of this file.',
        type: 'string',
      },
      resolution: {
        title: 'Resolution',
        description: 'Enter the resolution of this file. Ex.: 100m',
        type: 'string',
      },
      type: {
        title: 'Type',
        description: 'Enter the file type of this file. Ex.: Raster or Vector',
        choices: [
          ['Raster', 'Raster'],
          ['Vector', 'Vector'],
        ],
      },
      format: {
        title: 'Format',
        description: 'Enter the format of this file.',
        type: 'string',
      },
      size: {
        title: 'Size',
        description: 'Enter the size of this file. Ex.: 3.5 GB',
        type: 'string',
      },
      path: {
        title: 'Path',
        description: 'Enter the absolute path of this file in the storage',
        type: 'string',
      },
      source: {
        title: 'Source',
        description: 'Enter the source of this file (this is an internal).',
        choices: [
          ['EEA', 'EEA'],
          ['HOTSPOTS', 'HOTSPOTS'],
        ],
      },
    },
    fieldsets: [
      {
        id: 'default',
        title: 'File',
        fields: [
          'title',
          'file',
          'area',
          'year',
          'version',
          'resolution',
          'type',
          'format',
          'size',
          'path',
          'source',
        ],
      },
    ],
    required: [],
  };

const mockvalue = {
    "items": [
        {"title": "prova 1"},
        {"title": "prova 2"},
    ]
};

const View = ({data, id, path, properties}) => {
    // console.log(props);
    const schema = data?.schema;
    const header_columns = schema ? schema.fieldsets[0].fields.map((field) => {
        return { Header: schema.properties[field]?.title, accessor: field };
      }) : [];
    
      //   const value = props.value || mockvalue;
      const columns = React.useMemo(
        () => [...header_columns],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
      );
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageCount,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize },
      } = useTable(
        {
          columns,
          data: data?.items || [],
        //   defaultColumn,
        //   updateCell,
        //   selectedRow,
        //   setSelectedRow,
        //   schema,
        //   reactSelect,
        },
        usePagination,
      );
        
    return (    
        <>
        <Table celled {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, key) => (
            <Table.Row key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.HeaderCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Table.Row
                {...row.getRowProps()}
              >
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
      <div className="pagination-wrapper react-table-pagination">
        <Pagination
          activePage={pageIndex + 1}
          totalPages={pageCount}
          onPageChange={(e, { activePage }) => {
            gotoPage(activePage - 1);
          }}
          firstItem={null}
          lastItem={null}
          prevItem={{
            content: <Icon name={paginationLeftSVG} size="18px" />,
            icon: true,
            'aria-disabled': pageIndex + 1 === 1,
            className: pageIndex + 1 === 1 ? 'disabled' : null,
          }}
          nextItem={{
            content: <Icon name={paginationRightSVG} size="18px" />,
            icon: true,
            'aria-disabled': pageIndex + 1 === pageCount,
            className: pageIndex + 1 === pageCount ? 'disabled' : null,
          }}
        ></Pagination>
        <select
          style={{ maxWidth: '7rem' }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      </>
    );  
}

export default View;