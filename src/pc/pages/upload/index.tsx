import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Socket } from "socket.io-client";

import "./upload-page.scss";
import Container from "../../components/container";
import Input from "../../../common/components/input-field";
import LoadingSpinner from "../../../common/components/loading-spinner";
import { createVideo } from "../../../common/api/video";
import { joinClasses, getTimeFromSeconds } from "../../../common/utils";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { ReactComponent as UploadIcon } from "../../../assets/upload-icon.svg";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import constants from "../../../common/constants";
import CheckboxSet from "../../../common/components/checkbox-set";
import Likes from "../../components/video-modal/Likes";
import ActionButton from "../../components/action-button";
import { demoVideo1 } from "../../../data.json";

const validationSchema = yup.object().shape({
	caption: yup.string().required("動態描述不可少於1個字亦不可超過50個字").max(
		// constants.captionMaxLen,
		50,
		`動態描述不可少於1個字亦不可超過50個字`
	),
	cover: yup
		.string()
		.required("封面")
		.max(constants.musicMaxLen, `At most ${constants.musicMaxLen} characters`)
	// tags: yup
	// 	.string()
	// 	.required("Required")
	// 	.max(constants.tagsMaxLen, `At most ${constants.tagsMaxLen} characters`)
	// .array()
	// .of(
	// 	yup.object().shape({
	// 		check: yup.boolean()
	// 	})
	// )
	// .test({
	// 	name: 'one-true',
	// 	message: 'Required',
	// 	test: (val) => {
	// 		console.log(val)
	// 		return val == null
	// 	}
	//   })
});

const _privacySetting = [
	{
		label: "公開",
		check: true
	},
	{
		label: "好友(限粉絲)",
		check: false
	},
	{
		label: "不公開",
		check: false
	}
];

const _catergories = [
	"美食",
	"美酒",
	"時尚",
	"活動",
	"音樂",
	"娛樂",
	"搞笑",
	"奢華",
	"戶外",
	"餐廳",
	"明星",
	"舞蹈",
	"寵物",
	"親子"
];

export default function UploadPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const socketRef = useRef<Socket | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const vidDuration = useRef("00:00");
	const [isLoading, setIsLoading] = useState(false);
	const [videoFile, setVideoFile] = useState<File | null>();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [compressionProgress, setCompressionProgress] = useState({
		percent: 0,
		eta: ""
	});
	const [showProgressBox, setShowProgressBox] = useState(false);
	const { username, token } = useAppSelector(state => state.auth);
	const videoURL = useMemo(
		() => (videoFile ? URL.createObjectURL(videoFile) : undefined),
		[videoFile]
	);
	const [privacySetting, setPrivacySetting] = useState(_privacySetting);
	const [catergories, setCatergories] = useState(
		_catergories.map(item => ({ label: item, check: false }))
	);
	const [textCount, setTextCount] = useState(0);

	const progressFn = useCallback(
		(type: "upload" | "compress", progress: any) => {
			if (type === "upload") setUploadProgress(progress);
			else setCompressionProgress(progress);
		},
		[]
	);

	useEffect(() => {
		if (!videoRef.current) return;
		const vid = videoRef.current;
		const timeline = document.getElementById("timeline");
		const ended = false;
		let time = 0;

		function loadeddata() {
			// vidDuration.current = getTimeFromSeconds(vid.duration);
			console.log(vid.readyState);
			loadTime();
		}
		function loadTime() {
			if (ended === false) {
				vid.currentTime = time;
				time += 1;
				// setTime(pre => pre + 1)
			}
		}

		function updateTime() {
			// console.log(vid.currentTime)
			if (timeline) createImage();
			// console.log('updateTime')
		}

		function createImage() {
			let canvas = document.createElement("canvas");
			let nodes = timeline?.childElementCount;
			canvas.setAttribute("id", `image_${nodes}`);
			if (nodes === 0) canvas.setAttribute("class", `selected`);

			canvas.onclick = function () {
				if (nodes && timeline) {
					//remove style of image
					let childs = timeline?.children;
					for (let index = 0; index < childs.length; index++) {
						let indexNode = childs[index];
						indexNode.classList.remove("selected");
					}
					//change selected image
					let selectedNode = document.getElementById(`image_${nodes}`);
					selectedNode?.setAttribute("class", `selected`);
				}
			};

			let ctx = canvas.getContext("2d");
			// canvas.width = vid.videoWidth;
			// canvas.height = vid.videoHeight;
			canvas.width = 200;
			canvas.height = 100;
			ctx?.drawImage(vid, 0, 0, 200, 100);
			// ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
			timeline?.appendChild(canvas);
		}

		vid.addEventListener("loadeddata", loadeddata);
		vid.addEventListener("timeupdate", updateTime);

		return () => {
			vid.removeEventListener("loadeddata", loadeddata);
			vid.removeEventListener("timeupdate", updateTime);
		};
	}, [videoFile]);

	const cancelFn = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.emit("cancelCompression");
			socketRef.current.disconnect();
			socketRef.current = null;
		}
		setShowProgressBox(false);
		setIsLoading(false);
		setUploadProgress(0);
		setCompressionProgress({ percent: 0, eta: "" });
	}, []);

	const completeFn = useCallback(
		(videoId: string) => {
			navigate("/video/" + videoId);
		},
		[navigate]
	);

	const errFn = useCallback(
		(err: Error) => {
			dispatch(
				notificationActions.showNotification({
					type: "error",
					message: "Compression error: " + err.message
				})
			);
			cancelFn();
		},
		[dispatch, cancelFn]
	);

	const formik = useFormik({
		initialValues: {
			caption: "",
			cover: ""
			// tags: []
		},
		validationSchema,
		onSubmit: async values => {
			// dispatch(popUpActions.showModal(['publish']))
			console.log(values);
			// setIsLoading(true);
			// try {
			// 	if (!videoFile || videoFile.type !== "video/mp4")
			// 		throw new Error("Invalid video");
			// 	if (videoFile.size > constants.videoSizeLimit)
			// 		throw new Error("File too large");

			// 	const formData = new FormData();
			// 	formData.append("caption", values.caption);
			// 	formData.append("tags", values.tags);
			// 	formData.append("music", values.music);
			// 	formData.append("username", username!);
			// 	formData.append("token", token!);
			// 	// keep the file last or the server does not get the correct data
			// 	formData.append("video", videoFile);

			// 	setShowProgressBox(true);
			// 	socketRef.current = await createVideo(
			// 		formData,
			// 		{
			// 			...values,
			// 			username: username!
			// 		},
			// 		progressFn,
			// 		completeFn,
			// 		errFn
			// 	);
			// } catch (err: any) {
			// 	setIsLoading(false);
			// 	dispatch(
			// 		notificationActions.showNotification({
			// 			type: "error",
			// 			message: err.message
			// 		})
			// 	);
			// }
		}
	});

	const ActionBtns = () => {
		return (
			<div className="action-buttons">
				<Likes likes={0} curVidId={"1"} handleAuthModalOpen={() => null} />
				<ActionButton
					icon={<i className="fas fa-comment-dots" />}
					className="action-btn-container"
				/>
				<ActionButton
					icon={<i className="fas fa-star" />}
					className="action-btn-container"
				/>
				<ActionButton
					icon={<i className="fas fa-share" />}
					className="action-btn-container"
				/>
			</div>
		);
	};

	return (
		<Container className="upload-page-container">
			{showProgressBox && (
				<>
					<div className="backdrop box-backdrop" />
					<div className="progress-box">
						<h3>Progress</h3>
						<h5>
							Uploaded: <p>{uploadProgress}%</p>
						</h5>
						<h5>
							Compressed: <p>{compressionProgress.percent}%</p>
							{compressionProgress.eta && (
								<span>{compressionProgress.eta} left</span>
							)}
						</h5>
						<button
							className="secondary-button"
							onClick={cancelFn}
							disabled={!socketRef.current}
						>
							Cancel
						</button>
					</div>
				</>
			)}
			<div className="card">
				<header>
					<h1>上傳影音動態</h1>
					<h4>將影片或照片發布到您的帳號</h4>
				</header>
				<div className="card-body">
					<label htmlFor="video">
						<div
							className={joinClasses(
								"video-portion",
								videoFile ? "hasVideo" : ""
							)}
						>
							{videoFile?.type.split("/")[0] === "video" ? (
								<div className="card-video">
									<video
										id="video"
										ref={videoRef}
										playsInline
										preload="metadata"
										src={videoURL}
										// controls
										autoPlay
										muted
									>
										Your browser does not support videos.
									</video>
									<ActionBtns />
								</div>
							) : (
								<div className="video-portion-content d-col al-center">
									<UploadIcon />
									<h4>
										選擇要上傳的照片或影片
										<br />
										或拖曳檔案至此
									</h4>
									<p>
										<span>請選擇JPG、PNG、MP4、WebM 格式</span>
										<span> 720x1280 解析度或更高</span>
										<span>
											檔案小於 {constants.videoSizeLimit / 1048576} MB
										</span>
									</p>
									<div className="primary-button-2 w-100">選取檔案</div>
								</div>
							)}
							<input
								type="file"
								accept="video/*"
								// accept="video/mp4"
								id="video"
								// onChange={e => setVideoFile(e.target.files?.[0])}
								onChange={e => {
									setVideoFile(e.target.files?.[0]);
								}}
							/>
						</div>
					</label>
					<form className="description-portion jc-space-btw" onSubmit={formik.handleSubmit}>
						<div className="description-portion">
							<div className="form-group">
								<h5>
									<label htmlFor="caption">動態描述</label>
									{/* <span>
									Currently does not support @ mentions (and won't till I figure
									out how mentions work 🙂).
								</span> */}
								</h5>
								<Input
									id="caption"
									className="input"
									name="caption"
									textCount={textCount}
									textCountMax={50}
									onChange={(val: any) => {
										setTextCount(val.target.value.length);
										formik.handleChange(val);
									}}
									onBlur={formik.handleBlur}
									error={
										formik.submitCount > 0 &&
										formik.touched.caption &&
										formik.errors.caption
									}
									textCountOnTop
									autoComplete="off"
								/>
							</div>
							<div className="form-group">
								<h5>
									<label htmlFor="tags">封面</label>
									{/* <span>
									Space separated list of words (# can be omitted). Used while
									searching for videos and (eventually) for recommendations.
									<br />
									Example: "#Tag1 Tag2"
								</span> */}
								</h5>
								<div className="timeline-scroll-section">
									<div className="timeline" id="timeline" />
								</div>
								{/* <Input
								id="cover"
								className="input"
								name="cover"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.submitCount > 0 &&
									formik.touched.cover &&
									formik.errors.cover
								}
								autoComplete="off"
							/> */}
							</div>
							<div className="form-group">
								<h5>
									<label htmlFor="music">分類(最多選擇3個分類)</label>
									{/* <span>
									TikTok (the real one) identifies music used in the video
									automatically, but no such feature exists here so you gotta
									type it manually 😊. Can also be left blank. <br /> Example:
									Rick Astley - Never gonna give you up
								</span> */}
								</h5>
								<CheckboxSet
									data={catergories}
									id="tags"
									name="tags"
									// onChange={(val) => formik.handleChange(val.map(e => e.check))}
									// onChange={formik.handleChange}
									onChange={val => console.log(val)}
								/>
							</div>
							{/* <div className="form-group">
								<h5>
									<label htmlFor="music">誰可以觀看此內容</label>
								</h5>
								<CheckboxSet
									data={privacySetting}
									round
									onChange={val => console.log(val)}
								/>
							</div> */}
						</div>
						<div className="d-row" style={{ gap: "16px" }}>
							<button className="secondary-button">取消</button>
							<button
								type="submit"
								className="primary-button-2"
								disabled={!formik.dirty || isLoading}
								// disabled={
								// 	!formik.dirty || !formik.isValid || !videoFile || isLoading
								// }
							>
								{isLoading ? (
									<LoadingSpinner className="upload-spinner" />
								) : (
									"發布"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</Container>
	);
}
