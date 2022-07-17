import classes from "./checkbox-set.module.scss";
import { joinClasses } from "../../utils";

interface checkboxItem {
	label: string;
	check: boolean;
}

interface Props {
	id?: string,
	name?: string,
	data: checkboxItem[];
	round?: boolean;
	onChange: (val: checkboxItem[]) => void;
}
export default function CheckboxSet({ data, round, onChange, id, name }: Props) {
	const doCheck = (index: number, value: boolean) => {
		let tmp = data;
		tmp[index].check = value;
		onChange(tmp);
	};
	return (
		<div className={joinClasses("d-row", classes.setWrap)}>
			{data.map(({ check, label }, i) => (
				<label
					className={joinClasses(classes.container, !round && classes.show)}
					key={i}
				>
					{label}
					<input type="checkbox" id={id} name={name} onChange={e => doCheck(i, e.target.checked)} />
					{!round ? <span
						className={classes.checkmark}
						style={{
							// borderRadius: round ? "100%" : "3px",
							// border: round ? '1px solid #CACACA' : 'unset'
						}}
					/> :
					<span
						className={classes.checkmarkRound}
						style={{
							// borderRadius: round ? "100%" : "3px",
							// border: round ? '1px solid #CACACA' : 'unset'
						}}
					/>}
				</label>
			))}
		</div>
	);
}
