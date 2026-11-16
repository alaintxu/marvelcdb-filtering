import * as stylex from '@stylexjs/stylex'
import QuickSearchFilter from './Filter/QuickSearchFilter'
import AllCardActions from './Card/AllCardActions'
import { ui } from '../styles/ui'

const TopActions = () => {
  return (
    <div id="top-actions" {...stylex.props(ui.bgDark, ui.p3, ui.mb1, ui.stickyTop, ui.flex, ui.justifyBetween, ui.itemsCenter, ui.shadowed)}>
        <div {...stylex.props(ui.flex, ui.flexGrow, ui.justifyCenter)}>
            <QuickSearchFilter />
        </div>
        <AllCardActions />
    </div>
  )
}

export default TopActions
