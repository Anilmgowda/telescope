import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

let endOffsetsLen;
const Paginations = ({ itemsPerPage, items, handleCurrent, currentPageInput }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        let offset = itemOffset + 1 + "-" + `${endOffsetsLen ? endOffsetsLen :endOffset}` + " of  " + items?.length
        handleCurrent(items.slice(itemOffset, endOffset), currentPage, offset)
        setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, currentPageInput, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        setCurrentPage(event.selected + 1)
        if((event.selected + 1) === pageCount) {
            endOffsetsLen = items?.length
        } else {
            endOffsetsLen = ""
        }
    };

   

    useEffect(() => {
        setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [items]);

    return (
        <>
            <ReactPaginate
                className="pagination"
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </>
    );
}

export default Paginations;