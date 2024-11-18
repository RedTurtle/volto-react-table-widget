import { ReactTableWidget } from '@eeacms/volto-react-table-widget';
import { Error, Form, Icon, Toast, Toolbar, SidebarPortal } from '@plone/volto/components';
import { useEffect, useState } from 'react';

const emptySchema = () => {
    return {
        properties: {},
        fieldsets: [
            {
                id: "default",
                title: "Default",
                fields: [],
            }
        ],
        required: [],
    }
};

const Edit = (props) => {
    const { block, data, onChangeBlock, selected } = props;

    const onChange = (id, props) => {
        console.log("update table", id, props);
        const { items } = props;
        onChangeBlock(block, {
            ...data,
            items: items,
        })
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
    }

    return (
        <>

            <ReactTableWidget
                schema={data?.schema || emptySchema()}
                // {...props}
                csvexport={true}
                csvimport={true}
                value={data?.items || []}
                onChange={(id, value) => onChange(id, { items: value })}
            />
            <pre>{JSON.stringify(data?.items, null, 2)}</pre>
            <SidebarPortal selected={selected}>
                <Form
                    schema={contentTypeSchema}
                    formData={{ schema: data?.schema || emptySchema() }}
                    onChangeFormData={onChangeSchema}
                    hideActions
                />
            </SidebarPortal>

        </>
    );

}

export default Edit;