import React from 'react'

const Pagination = ({ table }) => {
    const { pageIndex } = table.getState().pagination
    const pageCount = table.getPageCount()

    const pages = [...Array(pageCount).keys()]
        .slice(
            Math.max(0, pageIndex - 2),
            Math.min(pageCount, pageIndex + 3)
        )

    return (
        <div className="w-full my-10 flex justify-center items-center">
            <div className="flex items-center border border-[#88a798] rounded-sm">

                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 border-r border-[#32B274] disabled:opacity-50"
                >
                    Previous
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => table.setPageIndex(page)}
                        className={`py-2 px-3 border-r border-[#32B274] 
                            ${pageIndex === page
                                ? 'bg-[#32B274] text-white'
                                : 'bg-white'
                            }`}
                    >
                        {page + 1}
                    </button>
                ))}

                {pageIndex + 3 < pageCount && (
                    <div className="py-2 px-3 border-r border-[#32B274]">
                        ...
                    </div>
                )}

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 disabled:opacity-50"
                >
                    Next
                </button>

            </div>
        </div>
    )
}

export default Pagination
