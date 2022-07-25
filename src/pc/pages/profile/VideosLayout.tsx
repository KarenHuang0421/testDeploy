import ProfileCard from "../../components/profile-card";
import VideoCard from "../../../pc/components/video-card";
import { VideoData } from "../../../common/types";
import { useEffect } from "react";

interface Props {
	videos: VideoData[] | null;
	videoType?: string;
}

export default function VideosLayout({ videos, videoType }: Props) {

	return !videos || videos?.length === 0 ? (
		<h4>No videos.</h4>
	) : (
		<>
			{videos.map((video, i) => {
				if (videoType === "active")
					return <VideoCard key={i} {...video} />;
				else return <ProfileCard key={i} videoId={"video"} {...video} />;
			})}
		</>
	);
	// return videos.length === 0 ? (
	// 	<h4>No videos.</h4>
	// ) : (
	// 	<>
	// 		{videos.map((video, i) => (
	// 			<ProfileCard key={i} videoId={video} />
	// 		))}
	// 	</>
	// );
}
