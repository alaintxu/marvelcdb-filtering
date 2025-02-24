import { BsPersonFill } from "react-icons/bs";
import comicWebp from "../../../assets/comic.webp";
import { MCCard } from '../../../store/entities/cards'
import { TbCards } from "react-icons/tb";

type Props = {
    card: MCCard | undefined,
}
const CardTop = ({ card }: Props) => {
    if (!card) return null;
    return (
        <div className="d-flex justify-content-between gap-1 mb-1">
            {(card.cost || card.cost == 0) &&
                <span className="mc-card__cost shadowed">
                    {card.cost}
                </span>
            }
            {(card.threat || card.threat == 0) &&
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

            {(card.quantity ?? 1) > 1 &&
                <span className="bg-light text-dark shadowed d-flex align-items-center rounded px-1" title="Número de copias">
                    <TbCards />x{card.quantity}
                </span>
            }
        </div>
    )
}

export default CardTop