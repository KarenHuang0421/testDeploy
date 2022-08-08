import { useFormik, validateYupSchema } from "formik";
import * as yup from "yup";
import { useEffect, useState, useCallback } from "react";
import InputField from "../../../common/components/input-field";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { popUpActions } from "../../../common/store/slices/pop-up-slice";
import constants from "../../../common/constants";

import "./apply.scss";
import { useParams } from "react-router-dom";

const NeedFillIcon = () => <span style={{ color: "red" }}>*</span>;

const StoreTitle = () => (
	<>
		<h2>
			成為我們的合作商家，一起建立餐飲界的社群生態，並提高您的店家曝光與營業收入。
		</h2>
		<h4>
			您好 ，我們是OMG
			想要加入我們、與我們合作嗎？立即填寫申請表單、提供資訊，我們將儘速與您聯繫！(
			<NeedFillIcon />
			為必填資訊)
		</h4>
	</>
);

const PublicTitle = () => (
	<>
		<h2>
			成為我們的平台的公眾人物，一起建立餐飲界的社群生態，並讓您的創作獲得更多的曝光機會。
		</h2>
		<h4>
			您好 ，我們是OMG
			想要加入我們成為我們的站內明星嗎？立即填寫申請表單、提供真實身份資訊，我們將儘速與您聯繫！(
			<NeedFillIcon />
			為必填資訊)
		</h4>
	</>
);

interface UploadProps {
	type: string;
	onChange: (val?: any) => void;
	onBlur: (val?: any) => void;
	error: any;
}

const UploadFile = ({ type, onChange, onBlur, error }: UploadProps) => {
	const upload = (val: any) => {
		let image = val.target.value;
		onChange(image);
	};

	return (
		<label htmlFor="files" className="upload-file">
			<div
				className="fake-input d-col center"
				style={error && { border: "1px solid #FF2F54" }}
			>
				{type === "store" && "請將營利事業登記證明拖移到此處"}
				{type === "public" && (
					<p className="d-row">
						請將您身分證件的<p style={{ color: "#e337ff" }}>正面</p>與
						<p style={{ color: "#e337ff" }}>反面</p>的照片拖移到此處
					</p>
				)}
				或者點擊“選擇檔案”按鈕。
				<br />
				檔案格式:word、pdf、jpg、png格式，總大小不可超過30MB
				<span>選擇檔案</span>
			</div>
			<input
				type="file"
				accept=".pdf,image/*"
				id="files"
				onChange={upload}
				onBlur={onBlur}
			/>
			{error && (
				<span style={{ color: "#FF2F54" }}>
					{type === "store"
						? "請上傳店家營利事業登記證明資料"
						: "請上傳您的身分證正面&反面照片"}
				</span>
			)}
			<div style={{ height: "1rem" }} />
		</label>
	);
};

const validationSchema = yup.object().shape({
	storeName: yup
		.string()
		.trim()
		.required("請輸入店家名稱")
		.min(1, `用戶名稱不可少於1個字`),
	averageConsumption: yup.string().trim().required("請輸入店家名稱"),
	name: yup.string().trim().required("請輸入聯絡人資料"),
	phone: yup.string().trim().required("請輸入聯絡人電話"),
	county: yup.string().trim().required("請輸入所在縣市"),
	city: yup.string().trim().required("請輸入所在鄉鎮市區"),
	address: yup.string().trim().required("請輸入正確的店家地址"),
	uploadFile: yup.string().required("no file"),
	webLink: yup
		.string()
		.trim()
		.required("請輸入有效的官網連結或定位連結網址")
		.matches(/(https:\/\/www.facebook)/, {
			excludeEmptyString: true,
			message: "請輸入有效的官網連結或定位連結網址"
		}),
	facebookLink: yup
		.string()
		.trim()
		.matches(/(https:\/\/www.facebook)/, {
			excludeEmptyString: true,
			message: "請輸入正確的Facebook連結網址"
		}),
	instagramLink: yup
		.string()
		.trim()
		.matches(/(https:\/\/www.instagram)/, {
			excludeEmptyString: true,
			message: "請輸入正確的Instagram連結網址"
		}),
	lineLink: yup
		.string()
		.trim()
		.matches(/(line.me)/, {
			excludeEmptyString: true,
			message: "請輸入正確的Line官方連結網址"
		})
});

const StoreForm = () => {
	const dispatch = useAppDispatch();
	const { username } = useAppSelector(state => state.auth);
	const { show } = useAppSelector(state => state.popUp);
	const [send, setSend] = useState(false);

	useEffect(() => {
		if (send) window.location.replace("/user/" + username);
	}, [show]);

	const formik = useFormik({
		initialValues: {
			storeName: "",
			averageConsumption: "",
			name: "",
			phone: "",
			county: "",
			city: "",
			address: "",
			webLink: "",
			uploadFile: "",
			facebookLink: "",
			instagramLink: "",
			lineLink: ""
		},
		validationSchema,
		onSubmit: async () => {
			dispatch(
				popUpActions.showModal([
					"confirm",
					"我們已收到您的申請，審合時間約3-5天，OMG將會透過Email告知結果"
				])
			);
			setSend(true);
		}
	});

	return (
		<div className="apply-form-list-wrap">
			<div className="apply-form-list">
				<StoreTitle />
				<form className="apply-form" onSubmit={formik.handleSubmit}>
					<h3>
						餐廳/商家名稱
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的店家名稱"
						name="storeName"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.storeName && formik.errors.storeName}
					/>
					<h3>
						店家平均每人消費金額為何？
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請選擇您的店家平均消費金額"
						name="averageConsumption"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={
							formik.touched.averageConsumption &&
							formik.errors.averageConsumption
						}
					/>
					<h3>
						聯絡人名稱
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的姓氏"
						name="name"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.name && formik.errors.name}
					/>
					<h3>
						聯絡人電話
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="+886123456789"
						name="phone"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.phone && formik.errors.phone}
					/>
					<div className="d-row" style={{ gap: "22px", marginTop: "1.8rem" }}>
						<div className="d-col flex-1">
							<h3>
								店家所在縣市
								<NeedFillIcon />
							</h3>
							<InputField
								className="apply-form-input"
								placeholder="請選擇縣市"
								name="county"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.county && formik.errors.county}
							/>
						</div>
						<div className="d-col flex-1">
							<h3>
								店家所在鄉鎮市區
								<NeedFillIcon />
							</h3>
							<InputField
								className="apply-form-input"
								placeholder="請選擇市區"
								name="city"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.city && formik.errors.city}
							/>
						</div>
					</div>
					<h3>
						店家地址
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的店家地址"
						name="address"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.address && formik.errors.address}
					/>
					<h3>
						店家營利事業登記證明
						<NeedFillIcon />
					</h3>
					<UploadFile
						type="store"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.errors.uploadFile}
					/>
					<h3>
						您的官網/訂位連結
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的官網連結或訂位服務網址 ex:EZTABLE、inline"
						name="webLink"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.webLink && formik.errors.webLink}
					/>
					<h3>Facebook連結</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的facebook連結網址(選填)"
						name="facebookLink"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.facebookLink && formik.errors.facebookLink}
					/>
					<h3>Instagram連結</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的Instagram連結網址(選填)"
						name="instagramLink"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.instagramLink && formik.errors.instagramLink}
					/>
					<h3>Line官方賬號連結(非個人帳號)</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的Line＠官方賬號網址(選填)"
						name="lineLink"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.lineLink && formik.errors.lineLink}
					/>
					<button type="submit" className="primary-button-2 w-100">
						送出申請
					</button>
					<span className="flex-1 center" style={{ marginTop: "15px" }}>
						審核工作時間約3-5天
					</span>
				</form>
			</div>
		</div>
	);
};

const PublicForm = () => {
	const dispatch = useAppDispatch();
	const { username } = useAppSelector(state => state.auth);
	const { show } = useAppSelector(state => state.popUp);
	const [send, setSend] = useState(false);

	useEffect(() => {
		if (send) window.location.replace("/user/" + username);
	}, [show]);

	const formik = useFormik({
		initialValues: {
			storeName: "",
			averageConsumption: "",
			name: "",
			phone: "",
			county: "",
			city: "",
			address: "",
			webLink: "",
			uploadFile: "",
			facebookLink: "",
			instagramLink: "",
			lineLink: ""
		},
		validationSchema,
		onSubmit: async () => {
			dispatch(
				popUpActions.showModal([
					"confirm",
					"我們已收到您的申請，審合時間約3-5天，OMG將會透過Email告知結果"
				])
			);
			setSend(true);
		}
	});

	return (
		<div className="apply-form-list-wrap">
			<div className="apply-form-list">
				<PublicTitle />
				<form className="apply-form" onSubmit={formik.handleSubmit}>
					<h3>
						姓名
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的店家名稱"
						name="storeName"
						error={formik.touched.storeName && formik.errors.storeName}
					/>
					<h3>
						聯絡人電話
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="+886123456789"
						name="phone"
						error={formik.touched.phone && formik.errors.phone}
					/>
					<h3>
						出生日期
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="YYYY-MM-DD"
						name="birthday"
						error={formik.touched.phone && formik.errors.phone}
					/>
					<h3>
						身分證字號
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的身分證字號(英文不分大小寫)"
						name="id"
						error={formik.touched.phone && formik.errors.phone}
					/>
					<div className="d-row" style={{ gap: "22px", marginTop: "1.8rem" }}>
						<div className="d-col flex-1">
							<h3>
								店家所在縣市
								<NeedFillIcon />
							</h3>
							<InputField
								className="apply-form-input"
								placeholder="請選擇縣市"
								name="county"
								error={formik.touched.county && formik.errors.county}
							/>
						</div>
						<div className="d-col flex-1">
							<h3>
								店家所在鄉鎮市區
								<NeedFillIcon />
							</h3>
							<InputField
								className="apply-form-input"
								placeholder="請選擇市區"
								name="city"
								error={formik.touched.city && formik.errors.city}
							/>
						</div>
					</div>
					<h3>
						店家地址
						<NeedFillIcon />
					</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的店家地址"
						name="address"
						error={formik.touched.address && formik.errors.address}
					/>
					<h3>
						身分證正/反面照片
						<NeedFillIcon />
					</h3>
					<UploadFile
						type="public"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.errors.uploadFile}
					/>
					<h3>Facebook連結</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的facebook連結網址(選填)"
						name="facebookLink"
						error={formik.errors.facebookLink}
					/>
					<h3>Instagram連結</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的Instagram連結網址(選填)"
						name="instagramLink"
						error={formik.touched.instagramLink && formik.errors.instagramLink}
					/>
					<h3>Line官方賬號連結(非個人帳號)</h3>
					<InputField
						className="apply-form-input"
						placeholder="請輸入您的Line＠官方賬號網址(選填)"
						name="lineLink"
						error={formik.touched.lineLink && formik.errors.lineLink}
					/>
					<button className="primary-button-2 w-100">送出申請</button>
					<span className="flex-1 center" style={{ marginTop: "15px" }}>
						審核工作時間約3-5天
					</span>
				</form>
			</div>
		</div>
	);
};

export default function Apply() {
	const { type } = useParams();
	return (
		<div className={"apply-page-background jc-center " + type}>
			<div className="apply-page-container d-row">
				<div className="flex-1 d-col center">
					{type === "store" ? (
						<div className="slogan-block">
							<h1>
								成為我們<span className="apply-gradient-text">合作店家</span>
								，讓更多人看到 並享受您的美味餐點與餐廳氣氛！
							</h1>
							<span>
								OMG為餐飲界開啟產業社群與爭取更多曝光機會，致力於讓優質與高品質的餐廳獲得更多的曝光與收益率，讓更多人看到並體驗您的餐廳實況服務，傳遞更多幸福與快樂的時刻。
								<br />
								<br />
								加入我們，一起與我們傳遞更多生活中美好的回憶。
							</span>
						</div>
					) : (
						<div className="slogan-block">
							<h1>
								成為社群<span className="apply-gradient-text">公眾人物</span>
								讓更多人看到您的創作與對美食的堅持！
							</h1>
							<span>
								OMG為餐飲界開啟產業社群與爭取更多曝光機會，致力於讓優質與高品質的餐廳獲得更多的曝光與收益率，讓更多人看到並體驗您的餐廳實況服務，傳遞更多幸福與快樂的時刻。
								<br />
								<br />
								加入我們，一起與我們傳遞更多生活中美好的回憶。
							</span>
						</div>
					)}
				</div>
				{type === "store" ? <StoreForm /> : <PublicForm />}
			</div>
		</div>
	);
}
