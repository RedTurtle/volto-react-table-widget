// import { ReactTableWidget } from '@eeacms/volto-react-table-widget';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Pagination, Table } from 'semantic-ui-react';
// import { useState } from 'react';
import { Icon } from '@plone/volto/components';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  page_size: {
    id: 'page_size',
    defaultMessage: 'Show {pageSize}',
  },
});

const View = ({ data, id, path, properties }) => {
  // console.log(props);
  const schema = data?.schema;
  const sortable_fields = data?.sortable || [];
  const filterable_fields = data?.filterable || [];
  const intl = useIntl();
  const includesFilter = (rows, ids, filterValue) => {
    return rows.filter((row) => {
      return ids.some((id) => {
        const rowValue = row.values[id];
        return rowValue && rowValue.includes(filterValue);
      });
    });
  };
  const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        row.values[id] && options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        style={{ maxWidth: '100%' }}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  const TextColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        // placeholder={`Search ${count} records...`}
      />
    );
  };
  const header_columns = schema
    ? schema.fieldsets[0].fields.map((field) => {
        const filter = {
          includes: {
            Filter: SelectColumnFilter,
            filter: includesFilter,
          },
          contains: {
            Filter: TextColumnFilter,
          },
        }[filterable_fields[field]] || { canFilter: false };
        // TODO: attualmente non implementato
        const sort = { defaultCanSort: sortable_fields.includes(field) };
        return {
          Header: schema.properties[field]?.title,
          accessor: field,
          ...sort,
          ...filter,
        };
      })
    : [];

  //   const value = props.value || mockvalue;
  const columns = React.useMemo(
    () => [...header_columns],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const DefaultColumnFilter = () => {
    return null;
  };

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );
  const defaultCanFilter = false;
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
      defaultColumn,
      defaultCanFilter,
      //   updateCell,
      //   selectedRow,
      //   setSelectedRow,
      //   schema,
      //   reactSelect,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  return (
    <div className="cms-ui" style={{ marginTop: '1em' }}>
      <Table celled {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup, key) => (
            <Table.Row key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                <Table.HeaderCell
                  {...column.getHeaderProps()}
                  className="wide one"
                  style={{ maxWidth: '40px', verticalAlign: 'top' }}
                >
                  {column.render('Header')}
                  {/* {column.defaultCanSort && <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>} */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
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

      {data?.items && data.items.length > 10 && (
        <div className="pagination-wrapper react-table-pagination cms-ui">
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
                {intl.formatMessage(messages.page_size, { pageSize })}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default View;
