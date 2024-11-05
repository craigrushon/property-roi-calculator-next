'use-client';
import { useRouter } from 'next/navigation';

export function usePagination(
  basePath: string,
  offset: number,
  itemsPerPage: number,
  totalItems: number
) {
  const router = useRouter();
  const newOffset =
    totalItems > itemsPerPage + offset ? offset + itemsPerPage : null;
  const start = offset ? offset + 1 : 1;
  const end = newOffset ? start + itemsPerPage - 1 : totalItems;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`${basePath}/?offset=${newOffset}`, { scroll: false });
  }

  return { prevPage, nextPage, start, end };
}
