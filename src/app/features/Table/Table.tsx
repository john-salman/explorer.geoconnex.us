import React from 'react';
import { flexRender, HeaderGroup, RowModel } from '@tanstack/react-table';
import { Dataset } from '@/app/types';
import { Typography } from '@/app/components/common/Typography';
import { Tooltip } from '@/app/features/Tooltip';
import { getHeaderTooltipText, HeaderKey } from '@/app/features/Table/';

type Props = {
    getHeaderGroups: () => HeaderGroup<Dataset>[];
    getRowModel: () => RowModel<Dataset>;
};

const Table: React.FC<Props> = (props) => {
    const { getHeaderGroups, getRowModel } = props;

    return (
        <div
            id="table-wrapper"
            className="
                            lg:mt-2 mx-4 overflow-auto 
                            border border-gray-200 
                            text-black text-sm
                            lg:rounded-lg lg:shadow-lg
                            "
        >
            <table className="w-full h-full">
                <thead id="table-header" className="sticky top-0 h-12 bg-white">
                    {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className=" ">
                            {headerGroup.headers.map((header, index) => {
                                const id = header.column.columnDef
                                    .id as HeaderKey;

                                if (!header.column.getIsVisible()) {
                                    return null;
                                }

                                const tooltipText = getHeaderTooltipText(id);

                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        <div
                                            className={`${
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            } flex items-center px-4 py-2`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {tooltipText.length > 0 ? (
                                                <Tooltip
                                                    text={getHeaderTooltipText(
                                                        id
                                                    )}
                                                    position={
                                                        index ===
                                                        headerGroup.headers
                                                            .length -
                                                            1
                                                            ? 'left'
                                                            : 'bottom'
                                                    }
                                                    tabIndex={0}
                                                >
                                                    <Typography
                                                        variant="body"
                                                        as="span"
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </Typography>
                                                </Tooltip>
                                            ) : (
                                                <Typography
                                                    variant="body"
                                                    as="span"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                </Typography>
                                            )}

                                            {{
                                                asc: ' ▲',
                                                desc: ' ▼',
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white">
                    {getRowModel().rows.map((row) => {
                        return (
                            <tr
                                key={row.id}
                                className="min-h-5 my-2 border-y border-gray-300"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td
                                            key={cell.id}
                                            className="p-2 text-center"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
