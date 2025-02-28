
import ResetAppButton from './ResetAppButton';
import PacksSection from './Packs/PacksSection';
import ImportExportSection from './ImportExport/ImportExportSection';
import DeckSection from './Decks/DeckSection';

const DownloadManager = ({...rest}: React.HTMLAttributes<HTMLDivElement>) => {

  return (
      <section {...rest}>
        <PacksSection />
        <hr />
        <DeckSection />
        <hr />
        <ImportExportSection />
        <hr />
        <div className="mb-3 px-3">
          <ResetAppButton />
        </div>
      </section>
  )
}

export default DownloadManager