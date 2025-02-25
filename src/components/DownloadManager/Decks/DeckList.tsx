import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectAllDecks } from "../../../store/entities/decks";
import DeckListItem from "./DeckListItem";
import IconForConcept from "../../IconForConcept";
import { selectShowDeckList, showDeckListToggled } from '../../../store/ui/other';
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
import { AppDispatch } from "../../../store/configureStore";


const DeckList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('decks');
    const decks = useSelector(selectAllDecks);
    const showDeckList = useSelector(selectShowDeckList);
  return (
    <section className="deck-list mt-4">
        <div id="deckListAccordion" className='px-3 mb-3'>
          <button
            type='button'
            className="btn btn-secondary"
            onClick={() => dispatch(showDeckListToggled())}>
            {showDeckList ? <BsArrowsCollapse /> : <BsArrowsExpand />}
            &nbsp;
            {t("deck_list")}
            <span className='badge bg-light text-dark ms-2 d-inline-flex align-items-center'>
                {Object.keys(decks).length}

                <IconForConcept concept="bookmark" className="ms-1" /> 
            </span>
          </button>

          {showDeckList && (
            <div className='d-flex flex-column justify-content-center'>
                <div className="btn-group-vertical mt-3" role="group" aria-label="Bookmarked decks">
                    {Object.entries(decks).sort((a, b) => 
                    // sort by aspect, then by hero name
                    a[1]?.aspect?.localeCompare(b[1]?.aspect || "") || a[1]?.hero_name?.localeCompare(b[1]?.hero_name)
                    ).map(([deckCode, deck]) => (
                        <DeckListItem key={deckCode} deck={deck} />
                    ))}
                </div>
            </div>
        )}
        </div>
    </section>
  );
}

export default DeckList