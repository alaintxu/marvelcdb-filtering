import QuickSearchFilter from './Filter/QuickSearchFilter'
import AllCardActions from './Card/AllCardActions'

const TopActions = () => {
  return (  
    <div className="bg-dark p-3 mb-1 sticky-top d-flex justify-content-between align-items-center shadow">
        <div className="d-flex flex-grow-1 justify-content-center">
            <QuickSearchFilter />
        </div>
        <AllCardActions />
    </div>
  )
}

export default TopActions