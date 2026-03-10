export enum VideoStatus {
	PENDING = "PENDING",
	PROCESSED = "PROCESSED",
	FAILURE = "FAILURE",
}

export interface DonwloadFileResponse {
	donwloadUrl: string;
	expiresAt: string;
	fineName: string;
}

export interface VideoResponse {
	processId: string;
	videoName: string;
	status: VideoStatus;
	fileSize: number;
	processedAt: Date;
}

export interface ListVideosResponse {
	videos: VideoResponse[];
}
