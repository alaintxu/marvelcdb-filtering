import { useState } from "react";
import CardImage from "./CardImage"
import Modal from "./Modal"
import { BsFiletypeJson, BsPhoneFlip, BsInfo } from "react-icons/bs";

export type MCCard = {
  pack_code: string,
  pack_name: string,
  type_code: string,
  type_name: string,
  faction_code: string,
  faction_name: string,
  card_set_code: string,
  card_set_name: string,
  card_set_type_name_code: string,
  linked_to_code: string,
  linked_to_name: string,
  position: number,
  set_position?: number,
  code: string,
  name: string,
  real_name: string,
  text?: string,
  real_text?: string,
  quantity?: number,
  hand_size?: number,
  health?: number,
  health_per_hero?: boolean,
  thwart?: number,
  attack?: number,
  defense?: number,
  base_threat_fixed?: boolean,
  escalation_threat_fixed?: boolean,
  threat_fixed?: boolean,
  deck_limit?: number,
  traits?: string,
  real_traits?: string,
  meta?: {
    colors?: string[],
    offset?: string
  },
  flavor?: string,
  is_unique?: boolean,
  hidden?: boolean,
  permanent?: boolean,
  double_sided?: boolean,
  octgn_id?: string,
  url?: string,
  imagesrc?: string,
  backimagesrc?: string,
  linked_card?: MCCard,
  spoiler?: number
}

type Props = {
  card: MCCard
}

const Card = ({ card }: Props) => {
  const [flipped, setFlipped] = useState(false);
  const additionalClass = [
    "main_scheme",
    "side_scheme",
    "player_side_scheme"
  ].includes(card.type_code) ? "horizontal" : "";
  const modal_json_id = `modal-${card.code}-json`;
  const modal_data_id = `modal-${card.code}-data`;
  return (
    <div className={`card ${additionalClass}`}>
      <CardImage card={card} flipped={flipped} />
      <div className="card__actions">
        <button
          className="btn btn-info me-1"
          title="Mostrar información adicional"
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${modal_data_id}`}>
          <BsInfo />
        </button>
        <button
          className={`btn btn-secondary me-1`}
          title="Mostrar datos en crudo (JSON)"
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${modal_json_id}`}>
          <BsFiletypeJson />
        </button>
        <button
          className={`btn btn-${flipped ? "dark" : "light"} me-1`}
          onClick={() => setFlipped((prev) => !prev)}>
          <BsPhoneFlip />
        </button>
      </div>
      <Modal title={`Carta: ${card.name}`} modal_id={modal_data_id}>
        <p>code: {card.code} </p>
        <p>faction_code: {card.faction_code} </p>
        <p>pack_code: {card.pack_code} </p>
        <p>name: {card.name} </p>
        <p>card_set_type_name_code: {card.card_set_type_name_code} </p>
      </Modal>
      <Modal title="JSON" modal_id={modal_json_id}>
        <pre><code>{JSON.stringify(card, undefined, 2)}</code></pre>
      </Modal>
    </div>
  )
}

export default Card