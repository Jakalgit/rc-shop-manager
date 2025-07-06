import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationBlockProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	siblingCount?: number;
}

const PaginationComponent: React.FC<PaginationBlockProps> = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
	const range = (start: number, end: number) =>
		Array.from({ length: end - start + 1 }, (_, i) => start + i);

	const paginationItems = [];

	const showDots = (index: number) => (
		<Pagination.Ellipsis key={`dots-${index}`} disabled />
	);

	const firstPage = 1;
	const lastPage = totalPages;
	const startPage = Math.max(currentPage - siblingCount, 2);
	const endPage = Math.min(currentPage + siblingCount, totalPages - 1);

	paginationItems.push(
		<Pagination.Item
			key={firstPage}
			active={currentPage === firstPage}
			onClick={() => onPageChange(firstPage)}
		>
			{firstPage}
		</Pagination.Item>
	);

	// Show "..." before
	if (startPage > 2) {
		paginationItems.push(showDots(1));
	}

	range(startPage, endPage).forEach((page) => {
		paginationItems.push(
			<Pagination.Item
				key={page}
				active={currentPage === page}
				onClick={() => onPageChange(page)}
			>
				{page}
			</Pagination.Item>
		);
	});

	if (endPage < totalPages - 1) {
		paginationItems.push(showDots(2));
	}

	if (totalPages > 1) {
		paginationItems.push(
			<Pagination.Item
				key={lastPage}
				active={currentPage === lastPage}
				onClick={() => onPageChange(lastPage)}
			>
				{lastPage}
			</Pagination.Item>
		);
	}

	return (
		<Pagination className="mt-4">
			<Pagination.First
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
			/>
			<Pagination.Prev
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			/>
			{paginationItems}
			<Pagination.Next
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			/>
			<Pagination.Last
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
			/>
		</Pagination>
	);
};

export default PaginationComponent;