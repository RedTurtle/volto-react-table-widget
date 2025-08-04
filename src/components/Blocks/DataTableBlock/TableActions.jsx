import { defineMessages, useIntl } from 'react-intl';
import { CSVLink } from 'react-csv';

const messages = defineMessages({
  export_csv_file: {
    id: 'Export CSV file',
    defaultMessage: 'Export CSV file',
  },
});

const TableActions = ({ schema, columns, items }) => {
  const intl = useIntl();
  return (
    items?.length > 0 && (
      <div className="actions">
        <CSVLink
          className="ui button"
          filename={schema.title ? `${schema.title}.csv` : 'export.csv'}
          separator=";"
          headers={columns}
          data={items}
        >
          {intl.formatMessage(messages.export_csv_file)}
        </CSVLink>
      </div>
    )
  );
};

export default TableActions;
