import { useRouter } from 'next/navigation';

export function usePagination(
  basePath: string,
  offset: number | null,
  itemsPerPage = 5,
  totalItems: number
) {
  const router = useRouter();
  const start = Math.max((offset ?? 0) - itemsPerPage + 1, 1);
  const end = offset ? Math.min(offset, totalItems) : totalItems;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`${basePath}/?offset=${offset}`, { scroll: false });
  }

  return { prevPage, nextPage, start, end };
}
