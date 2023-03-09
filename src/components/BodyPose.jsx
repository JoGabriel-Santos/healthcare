import React, { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@mediapipe/pose';
import Webcam from 'react-webcam';

const BodyPose = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [pose, setPose] = useState(null);

    useEffect(() => {
        const init = async () => {
            const poseModel = new poseDetection.Pose({
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            console.log("poseModel")

            poseModel.onResults(handleResults);
            setModel(poseModel);
        };

        init();
    }, []);

    const handleResults = (results) => {
        console.log("onResults")

        setPose(results.poseLandmarks);
    };

    const drawPose = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const landmarks = pose;

        if (webcamRef.current && landmarks) {
            const { videoWidth, videoHeight } = webcamRef.current.props;

            canvas.width = videoWidth;
            canvas.height = videoHeight;

            context.clearRect(0, 0, videoWidth, videoHeight);

            context.strokeStyle = 'red';
            context.lineWidth = 2;

            poseDetection.drawConnectors(context, landmarks, poseDetection.POSE_CONNECTIONS, { color: 'red' });
            poseDetection.drawLandmarks(context, landmarks, { color: 'red', fillColor: 'red' });
        }

        requestAnimationFrame(drawPose);
    };

    useEffect(() => {
        if (model) {
            model.reset();
            model.onResults(handleResults);
            webcamRef.current.video.play();
            drawPose();
        }

    }, [model]);

    return (
        <div>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
            />

            <canvas ref={canvasRef}/>
        </div>
    );
};

export default BodyPose;
