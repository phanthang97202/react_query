import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudents } from 'apis/students.api'
import { toastifySuccess } from 'pages/AddStudent/AddStudent'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Students as StudentsType } from 'types/students.type'
import { useQueryString } from 'utils/utils'
const LIMIT = 10
export default function Students() {
  // const [students, setStudents] = useState<StudentsType>([])
  // useEffect(() => {
  //   getStudents(1, 10).then(res => {
  //     // console.log(res)
  //     setStudents(res.data)
  //   })
  // }, [])

  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  console.log(queryString)

  const queryClient = useQueryClient()

  const studentQuery = useQuery({
    queryKey: ['studentttt', { abc: page }],
    queryFn: () => getStudents(page, LIMIT),
    keepPreviousData: false // lần đầu undefined thì nó sẽ set giao diện loading, còn nếu thêm cái này thì nó sẽ giữ nguyên data cũ rồi sang data mới
  })
  // const { data, isLoading } = result

  const totalStudentsCount = Number(studentQuery.data?.headers['x-total-count']) || 0
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)
  console.log('🚀 ~ file: Students.tsx:31 ~ Students ~ totalPage:', totalPage)

  // delete student
  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => deleteStudent(id),
    onSuccess: (_) => {
      toastifySuccess()
      // update lại data mới sau khi xóa student
      queryClient.invalidateQueries({ queryKey: ['studentttt', { abc: page }], exact: true })
    }
  })
  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }
  // console.log(result)
  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <Link
        to={'/students/add'}
        type='button'
        className='mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Add Student
      </Link>
      {studentQuery.isLoading && (
        <>
          <div role='status' className='mt-6 animate-pulse'>
            <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <span className='sr-only'>Loading...</span>
          </div>
        </>
      )}

      {!studentQuery.isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentQuery.data?.data.map((student) => (
                  <tr className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className='font-medium text-red-600 dark:text-red-500'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className='mt-6 flex justify-center'>
        <nav aria-label='Page navigation example'>
          <ul className='inline-flex -space-x-px'>
            <li>
              {page === 1 ? (
                <span className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Previous
                </span>
              ) : (
                <Link
                  to={`/students?page=${page - 1}`}
                  className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Previous
                </Link>
              )}
            </li>
            {Array(totalPage)
              .fill(0)
              .map((_, index) => {
                const pageNumber = index + 1
                // console.log(pageNumber)
                const isActive = pageNumber === page
                return (
                  <li key={pageNumber}>
                    <Link
                      style={{ backgroundColor: isActive ? '#968080' : '' }}
                      className='border border-gray-300  bg-white py-2 px-3 leading-tight text-gray-500  hover:bg-gray-100  hover:text-gray-700'
                      to={`/students?page=${pageNumber}`}
                    >
                      {pageNumber}
                    </Link>
                  </li>
                )
              })}
            <li>
              {page === totalPage ? (
                <span className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Next
                </span>
              ) : (
                <Link
                  to={`/students?page=${page + 1}`}
                  className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Next
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
