import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './PageHeader.css'

function PageHeader({ kicker, title, description, action, backTo = '/courses' }) {
  const navigate = useNavigate()

  return (
    <header className="page-header">
      <button className="page-header__back" type="button" onClick={() => navigate(backTo)}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back
      </button>

      <div className="page-header__body">
        <div className="page-header__copy">
          {kicker && <span className="page-header__kicker">{kicker}</span>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="page-header__action">{action}</div>}
      </div>
    </header>
  )
}

export default PageHeader
