import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { useSelector, useDispatch } from 'react-redux'
import { FaRegUser } from 'react-icons/fa6'
import { FaCat } from 'react-icons/fa6'
import { BsBag } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Modal } from 'flowbite-react'
import { useState } from 'react'

import { AppState } from '../../app/store'
import { logOut } from '../user/userSlice'
import { selectAllCategories } from '../category/categorySlice'
import { ModalProps } from '../cart/AddToCart'
import ThemeToggle from './ThemeToggle'

const CategoryModal = ({ openModal, setOpenModal }: ModalProps) => {
  const categories = useSelector(selectAllCategories)

  return (
    <Modal
      show={openModal}
      position='top-left'
      onClose={() => setOpenModal(false)}
      className='max-w-56 bg-opacity-0 pt-8'
    >
      <Modal.Header className='bg-opacity-0'>Category</Modal.Header>
      <Modal.Body>
        <div className='grid gap-2'>
          {categories &&
            categories.map((cate) => (
              <Link
                key={cate.id}
                to={`/shop/${cate.id}`}
                onClick={() => setOpenModal(false)}
              >
                {cate.name}
              </Link>
            ))}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default function Nav() {
  const { isLoggedIn, user } = useSelector((state: AppState) => state.user)
  const [openModal, setOpenModal] = useState(false)
  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(logOut())
  }

  return (
    <Navbar
      fluid
      rounded
      className='z-50 pt-6  dark:bg-black'
      role='navigation'
    >
      <Navbar.Collapse>
        <Navbar.Link className='text-xl dark:text-white'>
          <button onClick={() => setOpenModal(true)}>Shop</button>
        </Navbar.Link>
        <Navbar.Link href='/product' className='text-xl dark:text-white'>
          All
        </Navbar.Link>
        <Navbar.Link
          href='/cart'
          className='text-xl dark:text-white flex items-center'
        >
          <BsBag size={22} title='cart' />
        </Navbar.Link>
      </Navbar.Collapse>
      <Navbar.Brand
        href='/'
        className='flex gap-4'
        role='navigation'
        aria-describedby='home page'
      >
        <FaCat className='fill-purple-500' size={28} />
        <h2 className='text-black dark:text-white'>Catagonia</h2>
      </Navbar.Brand>

      <div className='flex md:order-2 gap-8'>
        {!isLoggedIn && (
          <a
            id='account'
            href='/account'
            className='flex flex-col justify-center dark:text-white'
          >
            <FaRegUser size={22} title='account' />
          </a>
        )}
        {isLoggedIn && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt='User settings' img={user?.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className='block text-sm'>{user?.firstName}</span>
              <span className='block truncate text-sm font-medium'>
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item href='/account' aria-describedby='account'>
              Account
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogOut}>
              <button>Sign out</button>
            </Dropdown.Item>
          </Dropdown>
        )}
        <ThemeToggle />
      </div>
      <CategoryModal openModal={openModal} setOpenModal={setOpenModal} />
      <Navbar.Toggle />
    </Navbar>
  )
}
