import React from 'react'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CFooter,
  CSidebar,
  CSidebarNav,
  CNavItem,
  CNavTitle,
  CHeaderNav
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilClipboard, cilChart } from '@coreui/icons'
import { Link } from 'react-router-dom'

const AdminCoreLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      {/* Main Content */}
      <div className="wrapper d-flex flex-column flex-grow-1">
       
        <CContainer fluid className="px-4 pb-4">
          {children}
        </CContainer>

        <CFooter className="mt-auto bg-white border-top text-center py-2">
          <div className="text-muted small">© 2025 Creme Collections Admin</div>
        </CFooter>
      </div>
    </div>
  )
}

export default AdminCoreLayout
