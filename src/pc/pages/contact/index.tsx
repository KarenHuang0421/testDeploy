import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./contact.scss";
import PageWithSidebar from "../../components/page-with-sidebar";
import Input from "../../../common/components/input-field";
import constants from "../../../common/constants";
import PopUp from "../../../common/components/pop-up";

const validationSchema = yup.object().shape({
	name: yup
		.string()
		.trim()
		.required("請輸入聯絡人名稱")
		.min(
			constants.contactnameMinLen,
			`聯絡人名稱不可少於${constants.contactnameMinLen}個字`
		)
		.max(
			constants.contactnameMaxLen,
			`聯絡人名稱不可多於${constants.contactnameMaxLen}個字`
		),
	email: yup
		.string()
		.trim()
		.required("請輸入你的Email地址")
		.email("請確認Email輸入格式"),
	topic: yup
		.string()
		.trim()
		.required("請輸入信件主旨")
		.min(constants.topicMinLen, `信件主旨不可少於${constants.topicMinLen}個字`)
		.max(constants.topicMaxLen, `信件主旨不可多於${constants.topicMaxLen}個字`),
	emailContent: yup
		.string()
		.trim()
		.required("請輸入內容")
		.min(
			constants.mailContentMinLen,
			`信件內容不可少於${constants.mailContentMinLen}個字`
		)
		.max(
			constants.mailContentMaxLen,
			`信件內容不可多於${constants.mailContentMaxLen}個字`
		)
});

export default function Contact() {
	const [textCount, setTextCount] = useState(0);
	const [sent, setSent] = useState(false);
	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			topic: "",
			emailContent: ""
		},
		validationSchema,
		onSubmit: (values, actions) => {
			setSent(true);
		}
	});

	return (
		<PageWithSidebar className="contactpage-container" isContact>
			<div className="content-container">
				<h1>聯絡我們</h1>
				<span>如果您有遇到任何問題，請填寫下方表格與我們聯繫</span>
				<form onSubmit={formik.handleSubmit}>
					<h5>聯絡人名稱</h5>
					<Input
						placeholder="請輸入您的姓氏"
						name="name"
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.name && formik.errors.name}
					/>
					<h5>聯絡信箱</h5>
					<Input
						placeholder="請輸入您的聯絡信箱"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.email && formik.errors.email}
					/>
					<h5>主旨</h5>
					<Input
						placeholder="請輸入信件主旨"
						name="topic"
						value={formik.values.topic}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.topic && formik.errors.topic}
					/>
					<h5>留言內容</h5>
					<Input
						placeholder="請輸入您的留言或回報"
						name="emailContent"
						rows={5}
						textCount={textCount}
						textCountMax={constants.mailContentMaxLen}
						value={formik.values.emailContent}
						onChange={(val: any) => {
							setTextCount(val.target.value.length);
							formik.handleChange(val);
						}}
						onBlur={formik.handleBlur}
						error={formik.touched.emailContent && formik.errors.emailContent}
					/>
					<button
						className="primary-button-2"
						disabled={!formik.dirty || !formik.isValid}
					>
						發送
					</button>
				</form>
			</div>
			{sent && (
				<PopUp
					handleModalClose={() => {
						setSent(false);
						formik.resetForm();
					}}
					type="feedback"
				/>
			)}
		</PageWithSidebar>
	);
}
