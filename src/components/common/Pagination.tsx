import { Pagination } from 'flowbite-react'
import { useState } from 'react'

import { QueryParams } from '../../misc/type'
import { setParams } from '../../misc/utils'

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<QueryParams>>
}

export function PaginationNav({ setQuery }: Props) {
  const [page, setPage] = useState<number>(1)

  const onPageChange = (page: number) => {
    setPage(page)
    setQuery(
      (prev) =>
        (prev = setParams(prev, {
          type: 'startingAfter',
          value: String(page - 1)
        }))
    )
  }

  return (
    <div className='flex overflow-x-auto sm:justify-center'>
      <Pagination
        role='navigation'
        layout='navigation'
        currentPage={page}
        totalPages={100}
        onPageChange={onPageChange}
        showIcons
      />
    </div>
  )
}
