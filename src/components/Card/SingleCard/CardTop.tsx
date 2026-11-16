import comicWebp from "../../../assets/comic.webp";
import { MCCard } from '../../../store/entities/cards'
import IconForConcept from "../../IconForConcept";
import * as stylex from '@stylexjs/stylex';
import { ui } from "../../../styles/ui";
import { cx } from "../../../styles/cx";

type Props = {
    card: MCCard | undefined,
}
const CardTop = ({ card }: Props) => {
    if (!card) return null;
    return (
        <div {...stylex.props(ui.flex, ui.justifyBetween, ui.gap1, ui.mb1)}>
            {(card.cost || card.cost == 0) &&
                <span className={cx("mc-card__cost", stylex.props(ui.shadowed).className)} style={stylex.props(ui.shadowed).style}>
                    {card.cost}
                </span>
            }
            {(card.threat || card.threat == 0) &&
                <span className={cx("mc-card__threat", stylex.props(ui.shadowed).className)} style={stylex.props(ui.shadowed).style}>
                    {card.threat}
                    {card.threat_fixed !== undefined && card.threat_fixed == false && <IconForConcept concept="person" title={`${card.threat} por jugador`} />}
                </span>
            }
            <span className={cx("mc-card__name", stylex.props(ui.shadowed, ui.flexGrow).className)} style={{ ...stylex.props(ui.shadowed, ui.flexGrow).style, backgroundImage: comicWebp }}>
                <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Abre '${card.name}' en MarvelCDB (pestaña nueva)`}>
                    {card.name}
                </a>
            </span>

            {(card.quantity ?? 1) > 1 &&
                <span {...stylex.props(ui.bgLight, ui.textDark, ui.shadowed, ui.flex, ui.itemsCenter, ui.rounded, ui.px1)} title="Número de copias">
                    <IconForConcept concept="multiple_cards" />x{card.quantity}
                </span>
            }
        </div>
    )
}

export default CardTop