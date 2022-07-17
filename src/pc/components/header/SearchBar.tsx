import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FiSearch } from "react-icons/fi";
import * as yup from "yup";

import classes from "./header.module.scss";
import constants from "../../../common/constants";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { searchActions } from "../../store/slices/search-slice";

const validationSchema = yup.object().shape({
	query: yup.string().required("").max(constants.searchQueryMaxLen, "")
});

export default function SearchBar() {
	const dispatch = useAppDispatch();
	const storeQuery = useAppSelector(state => state.pc.search.query);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			query: storeQuery
		},
		enableReinitialize: true,
		validationSchema,
		onSubmit: ({ query }) => {
			dispatch(searchActions.putQuery(query));
			navigate("/search?query=" + query);
		}
	});

	return (
		<form className={classes["search-bar"]} onSubmit={formik.handleSubmit}>
			<button type="submit">
				<FiSearch fontSize={28} />
			</button>
			{/* <span /> */}
			<input
				type="text"
				placeholder="搜尋影片或帳號"
				name="query"
				value={formik.values.query}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				onKeyUp={formik.handleBlur}
			/>
		</form>
	);
}
