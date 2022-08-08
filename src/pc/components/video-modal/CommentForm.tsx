import { useFormik } from "formik";
import * as yup from "yup";

import Input from "../../../common/components/input-field";
import { useAppSelector, useAppDispatch } from "../../../common/store";
import constants from "../../../common/constants";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import { postComment } from "../../../common/api/video";
import { CommentData } from "../../../common/types";
import { authModalActions } from "../../../common/store/slices/auth-modal-slice";

const validationSchema = yup.object().shape({
	comment: yup
		.string()
		.trim()
		.required("")
		.max(
			constants.commentMaxLen,
			`At most ${constants.commentMaxLen} characters`
		)
});

interface Props {
	fetchComments: () => Promise<void>;
	videoId: string;
	isAuthed?: boolean;
	setComments: React.Dispatch<React.SetStateAction<CommentData[] | null>>;
	fetchCommentsNum: () => Promise<void>;
}

export default function AddComment({
	videoId,
	fetchComments,
	fetchCommentsNum,
	isAuthed,
	setComments
}: Props) {
	const { username, token } = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();
	const formik = useFormik({
		initialValues: { comment: "" },
		validationSchema,
		onSubmit: async ({ comment }) => {
			try {
				await postComment(username!, comment, videoId, token!);
				dispatch(
					notificationActions.showNotification({
						type: "success",
						message: "Comment posted"
					})
				);
				setComments(null);
				fetchComments();
				formik.setFieldValue("comment", "");
				fetchCommentsNum();
			} catch (err: any) {
				dispatch(
					notificationActions.showNotification({
						type: "error",
						message: err.message
					})
				);
			}
		}
	});

	const login = () => {
		dispatch(authModalActions.showModal())
	}

	return (
		<form className="post-comment" onSubmit={formik.handleSubmit}>
			{isAuthed ? (
				<>
					<Input
						id="comment"
						autoComplete="off"
						placeholder="分享你的感想..."
						className="comment-input"
						wrapperClassName="input-wrapper"
						name="comment"
						value={formik.values.comment}
						error={formik.touched.comment && formik.errors.comment}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					<button
						type="submit"
						style={{ minWidth: "120px" }}
						className="primary-button-2"
						disabled={!formik.dirty || !formik.isValid}
					>
						發佈
					</button>
				</>
			) : (
				<span>
					請先
					<span className="login" onClick={login}>
						會員登入
					</span>
					後在發表評論
				</span>
			)}
		</form>
	);
}
