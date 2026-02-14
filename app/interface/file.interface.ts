export interface FileItem {
	user_id: string;
	process_id: string;
	file_bucket: string;
	file_path: string;
	file_size: number;
	file_name: string;
	video_name: string;
	status: string;
	error_message?: string;
	created_at: string;
	processed_at?: string;
}
