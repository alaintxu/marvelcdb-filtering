import type { HTMLAttributes } from 'react';
import * as stylex from '@stylexjs/stylex';
import ResetAppButton from './ResetAppButton';
import PacksSection from './Packs/PacksSection';
import ImportExportSection from './ImportExport/ImportExportSection';
import DeckSection from './Decks/DeckSection';
import { ui } from '../../styles/ui';

const DownloadManager = ({...rest}: HTMLAttributes<HTMLDivElement>) => {

  return (
      <section {...rest}>
        <PacksSection />
        <hr {...stylex.props(ui.separator)} />
        <DeckSection />
        <hr {...stylex.props(ui.separator)} />
        <ImportExportSection />
        <hr {...stylex.props(ui.separator)} />
        <div {...stylex.props(ui.mb3, ui.px3)}>
          <ResetAppButton />
        </div>
      </section>
  )
}

export default DownloadManager
