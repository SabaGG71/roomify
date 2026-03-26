import {useState, useCallback} from "react";
import {useOutletContext} from "react-router";
import {CheckCircle, ImageIcon, UploadIcon} from "lucide-react";
import {PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS} from "../lib/constants";

export const Upload = ({onComplete}: {onComplete?: (data: string) => void}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const {isSignedIn} = useOutletContext<AuthContext>();

    const processFile = useCallback((file: File) => {
        if (!isSignedIn) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target?.result as string;
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (onComplete) {
                                onComplete(base64Data);
                            }
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    }
                    return Math.min(prev + PROGRESS_STEP, 100);
                });
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    }, [isSignedIn, onComplete]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isSignedIn) {
            setFile(selectedFile);
            processFile(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isSignedIn) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            processFile(droppedFile);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div 
                    className={`dropzone mt-4 ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        className="drop-input" 
                        accept=".jpg, .jpeg, .png" 
                        disabled={!isSignedIn}
                        onChange={handleFileChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>{isSignedIn ? "Click To Upload Or Just Drag And Drop" : "Please Sign In To Upload"}</p>
                        <p className="help">Maximum file Size 50MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <div>
                                    <CheckCircle className="check" />
                                </div>
                                ):
                                (
                                <div>
                                    <ImageIcon className="image" />
                                </div>
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className="progress">
                            <div className="bar" style={{width: `${progress}%`}} />

                            <p className="status-text">
                                {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}