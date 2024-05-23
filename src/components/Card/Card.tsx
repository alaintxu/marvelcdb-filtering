import { useEffect, useState } from "react";
import CardImage, { getCardImage } from "./CardImage"
import { Modal } from "../Modal"
import { BsFiletypeJson, BsPhoneFlip, BsPersonFill, BsImage } from "react-icons/bs";
import comicWebp from "../../assets/comic.webp";
import { MCCard } from "../../hooks/useCards";
import { useTranslation } from "react-i18next";


export type MCCardKeys = keyof MCCard;

type Props = {
  card: MCCard,
  showCardData?: boolean,
  flipAllCards?: boolean,
}

const Card = ({ card, showCardData = false, flipAllCards = false }: Props) => {
  const { i18n } = useTranslation('global');
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [manualFlipped, setManualFlipped] = useState<boolean | undefined>(undefined);
  const flipped = manualFlipped === undefined ? flipAllCards : manualFlipped;

  useEffect(() => {
    setManualFlipped(undefined);
  }, [flipAllCards]);


  const isCardHorizontal = () => {
    const horizontal_types = ["main_scheme", "side_scheme", "player_side_scheme"];
    const front_horizontal = horizontal_types.includes(card.type_code);
    let back_horizontal = front_horizontal;

    if (card.linked_card) {
      back_horizontal = card.linked_card && horizontal_types.includes(card.linked_card.type_code);
    }


    return flipped ? back_horizontal : front_horizontal;
  }

  const isHorizontal = isCardHorizontal();

  const classNames = [
    "mc-card",
    flipped ? "mc-card--flipped" : "",
    isHorizontal ? "mc-card--horizontal" : "",
    showCardData ? "mc-card--show-data" : "",
    isClicked ? "mc-card--clicked" : "",
  ]
  const modal_json_id = `modal-${card.code}-json`;
  return (
    <>
      <div
        className={classNames.join(" ")}
        title={`mc-card-div-${card.code}`}
        key={`mc-card-div-${card.code}`}
        onClick={() => setIsClicked((prev) => !prev)}
      >
        <CardImage card={card} horizontal={isHorizontal} />
        <div className="mc-card__content">
          <header>
            <div className="d-flex justify-content-between gap-1 mb-1">
              {card.cost !== undefined &&
                <span className="mc-card__cost shadowed">
                  {card.cost}
                </span>
              }
              {card.threat !== undefined && card.threat > 0 &&
                <span className="mc-card__threat shadowed">
                  {card.threat}
                  {card.threat_fixed !== undefined && card.threat_fixed == false && <BsPersonFill title={`${card.threat} por jugador`} />}
                </span>
              }
              <span className="mc-card__name shadowed flex-grow-1" style={{ backgroundImage: comicWebp }}>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Abre '${card.name}' en MarvelCDB (pestaña nueva)`}>
                  {card.name}
                </a>
              </span>
            </div>
            <span className="mc-card__actions d-flex justify-content-end gap-1">
              <a className="btn btn-secondary shadowed"
                href={getCardImage(card, flipped || flipAllCards, i18n.language)}
                target="_blank"
                title={`Abre imagen de '${card.name}' (pestaña nueva)`}>
                <BsImage />
                </a>
              <button
                className={`btn btn-secondary shadowed`}
                title="Mostrar datos en crudo (JSON)"
                type="button"
                data-bs-toggle="modal"
                data-bs-target={`#${modal_json_id}`}>
                <BsFiletypeJson />
              </button>
              <button
                className={`btn btn-${flipped ? "dark" : "light"} shadowed`}
                onClick={() => setManualFlipped((prev) => prev === undefined ? !flipAllCards : !prev)}
                title="Gira la carta">
                <BsPhoneFlip />
              </button>
            </span>
          </header>
          <main className="d-flex flex-column gap-1 align-items-center">
            {!flipped ? <>

              {card.traits && <span className="d-flex gap-1">
                {card.traits.split(". ").map((trait) =>
                  <span className="badge bg-dark shadowed" key={`trait-back-${card.code}-${trait.replace(" ", "-")}`}>
                    {trait}
                  </span>
                )}
              </span>}

              {card.text &&
                <div
                  className="mc-card__data__text shadowed"
                  dangerouslySetInnerHTML={{ __html: card.text }}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title="Texto">
                </div>
              }
              {card.flavor &&
                <i
                  className="border rounded bg-light text-dark p-1 mx-3 shadowed"
                  style={{ fontSize: "0.75em" }}
                  dangerouslySetInnerHTML={{ __html: card.flavor }}
                  title="Texto de ambientación"></i>
              }

              {card.base_threat !== undefined && card.base_threat > 0 &&
                <span className="mc-card__threat shadowed" title="Amenaza base">
                  {card.base_threat}
                  {card.base_threat_fixed !== undefined && card.base_threat_fixed == false && <BsPersonFill title={`${card.base_threat} por jugador`} />}
                </span>
              }
            </> : <>

              {card.linked_card?.traits && <span className="d-flex gap-1">
                {card.linked_card?.traits.split(". ").map((trait) =>
                  <span className="badge bg-dark shadowed" key={`trait-${card.code}-${trait.replace(" ", "-")}`}>
                    {trait}
                  </span>
                )}
              </span>}
              {card.back_text &&
                <div
                  className="mc-card__data__text shadowed"
                  dangerouslySetInnerHTML={{ __html: card.back_text }}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title="Texto">
                </div>
              }
              {card.linked_card?.text &&
                <div
                  className="mc-card__data__text shadowed"
                  dangerouslySetInnerHTML={{ __html: card.linked_card.text }}
                  style={{ fontSize: "0.9em", borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title="Texto">
                </div>
              }

              {card.linked_card?.flavor &&
                <i
                  className="border rounded bg-light text-dark p-1 mx-3 shadowed"
                  style={{ fontSize: "0.75em" }}
                  dangerouslySetInnerHTML={{ __html: card.linked_card.flavor }}
                  title="Texto de ambientación"></i>
              }
            </>}
          </main>
        </div>
      </div>

      <Modal title="JSON" modal_id={modal_json_id} key={`mc-card-modal-${card.code}`} >
        <pre><code>{JSON.stringify(card, undefined, 2)}</code></pre>
      </Modal>
    </>
  )
}

export default Card