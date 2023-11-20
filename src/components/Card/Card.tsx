import { useEffect, useState } from "react";
import CardImage from "./CardImage"
import { Modal } from "../Modal"
import { BsFiletypeJson, BsPhoneFlip, BsPersonFill } from "react-icons/bs";
import comicWebp from "../../assets/comic.webp";
import { MCCard } from "../../hooks/useCards";


export type MCCardKeys = keyof MCCard;

type Props = {
  card: MCCard,
  showCardData?: boolean,
  flipAllCards?: boolean,
}

const Card = ({ card, showCardData = false, flipAllCards = false }: Props) => {
  const [manualFlipped, setManualFlipped] = useState<boolean | undefined>(undefined);
  const flipped = manualFlipped === undefined ? flipAllCards : manualFlipped;

  useEffect(() => {
    setManualFlipped(undefined);
  }, [flipAllCards]);

  const isHorizontal = ["main_scheme", "side_scheme", "player_side_scheme"].includes(card.type_code);

  const classNames = [
    "card",
    flipped ? "card--flipped" : "",
    isHorizontal ? "card--horizontal" : "",
    showCardData ? "card--show-data" : ""
  ]
  const modal_json_id = `modal-${card.code}-json`;
  return (
    <>
      <div className={classNames.join(" ")} title={`card-div-${card.code}`} key={`card-div-${card.code}`} >
        <CardImage card={card} horizontal={isHorizontal} />
        <div className="card__content">
          <header>
            <div className="d-flex justify-content-between gap-1 mb-1">
              {card.cost !== undefined &&
                <span className="card__cost shadowed">
                  {card.cost}
                </span>
              }
              {card.threat !== undefined && card.threat > 0 &&
                <span className="card__threat shadowed">
                  {card.threat}
                  {card.threat_fixed !== undefined && card.threat_fixed == false && <BsPersonFill title={`${card.threat} por jugador`} />}
                </span>
              }
              <span className="card__name shadowed flex-grow-1" style={{ backgroundImage: comicWebp }}>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Abre '${card.name}' en MarvelCDB (pestaña nueva)`}>
                  {card.name}
                </a>
              </span>
            </div>
            <span className="card__actions d-flex justify-content-end gap-1">
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
                onClick={() => setManualFlipped((prev) => prev === undefined ? !flipAllCards : !prev )}
                title="Gira la carta">
                <BsPhoneFlip />
              </button>
            </span>
          </header>
          <main className="d-flex flex-column gap-1 align-items-center">
            {!flipped ? <>

              {card.traits && <span className="d-flex gap-1">
                {card.traits.split(". ").map((trait) =>
                  <span className="badge bg-dark shadowed" key={`trait-back-${card.code}-${trait.replace(" ","-")}`}>
                    {trait}
                  </span>
                )}
              </span>}

              {card.text &&
                <div
                  className="card__data__text shadowed"
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
                <span className="card__threat shadowed" title="Amenaza base">
                  {card.base_threat}
                  {card.base_threat_fixed !== undefined && card.base_threat_fixed == false && <BsPersonFill title={`${card.base_threat} por jugador`} />}
                </span>
              }
            </> : <>

              {card.linked_card?.traits && <span className="d-flex gap-1">
                {card.linked_card?.traits.split(". ").map((trait) =>
                  <span className="badge bg-dark shadowed" key={`trait-${card.code}-${trait.replace(" ","-")}`}>
                    {trait}
                  </span>
                )}
              </span>}
              {card.back_text &&
                <div
                  className="card__data__text shadowed"
                  dangerouslySetInnerHTML={{ __html: card.back_text }}
                  style={{ fontSize: "0.9em",  borderColor: String(card.meta?.colors?.[0]) || 'black' }}
                  title="Texto">
                </div>
              }
              {card.linked_card?.text &&
                <div
                  className="card__data__text shadowed"
                  dangerouslySetInnerHTML={{ __html: card.linked_card.text }}
                  style={{ fontSize: "0.9em",  borderColor: String(card.meta?.colors?.[0]) || 'black' }}
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

      <Modal title="JSON" modal_id={modal_json_id} key={`card-modal-${card.code}`} >
        <pre><code>{JSON.stringify(card, undefined, 2)}</code></pre>
      </Modal>
    </>
  )
}

export default Card