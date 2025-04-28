import React, { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://localhost:3000');

interface PaddleState {
    y: number;
    height: number;
    width: number;
}

interface BallState {
    x: number;
    y: number;
    radius: number;
}

interface GameState {
    paddles: {
        player1: PaddleState;
        player2: PaddleState;
    };
    ball: BallState;
	score: {
		player1: number;
		player2: number;
	};
}

const SERVER_WIDTH = 900;
const SERVER_HEIGHT = 600;


export const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameId = useRef<number | null>(null); // To store animation frame ID

    // --- Drawing Logic ---
    const drawGame = useCallback((state: GameState) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            console.error('Canvas or context not available for drawing');
            return;
        }

        const { width, height } = canvas; // Use current canvas dimensions

        // Calculate scaling factors
        const scaleX = width / SERVER_WIDTH;
        const scaleY = height / SERVER_HEIGHT;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Create a gradient board based on current height
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a1a2e'); // Dark blue at the top
        gradient.addColorStop(1, '#16213e'); // Slightly lighter blue at the bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // --- Add shadows before drawing paddles ---
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Use a visible shadow color
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Draw paddles (scaled)
        ctx.fillStyle = 'white';
        const paddleWidth = 10 * scaleX; // Scale paddle width too
        const paddle1Height = state.paddles.player1.height * scaleY;
        const paddle2Height = state.paddles.player2.height * scaleY;

        ctx.fillRect(
            0, // Player 1 is at x=0
            state.paddles.player1.y * scaleY,
            paddleWidth,
            paddle1Height
        );
        ctx.fillRect(
            width - paddleWidth, // Player 2 is at the right edge
            state.paddles.player2.y * scaleY,
            paddleWidth,
            paddle2Height
        );

        // --- Reset shadows before drawing other elements (like the ball) ---
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw ball (scaled)
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2; // Keep line width constant or scale? (Constant for now)
        ctx.beginPath();
        // Scale radius using the smaller scale factor to maintain aspect ratio
        const ballRadius = state.ball.radius * Math.min(scaleX, scaleY);
        ctx.arc(
            state.ball.x * scaleX,
            state.ball.y * scaleY,
            ballRadius,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

    }, []);

    // --- State Update Listener ---
    useEffect(() => {
        // Listen for state updates from the server
        const handleStateUpdate = (state: GameState) => {
            // Use requestAnimationFrame for smoother rendering
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            animationFrameId.current = requestAnimationFrame(() => drawGame(state));
        };

        socket.on('state_update', handleStateUpdate);

        // Cleanup the WebSocket listener and animation frame
        return () => {
            socket.off('state_update', handleStateUpdate);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [drawGame]);

    // --- Resize Canvas ---
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!canvas || !container) return;

        // Use container dimensions as the maximum available space
        const { clientWidth: containerWidth, clientHeight: containerHeight } = container;

        const paddingFactor = 0.85;
        const availableWidth = containerWidth * paddingFactor;
        const availableHeight = containerHeight * paddingFactor;


        // Calculate canvas size maintaining aspect ratio within the AVAILABLE space
        const aspectRatio = SERVER_WIDTH / SERVER_HEIGHT;
        let newWidth = availableWidth;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > availableHeight) {
            newHeight = availableHeight;
            newWidth = newHeight * aspectRatio;
        }

        // Update canvas drawing buffer size
        canvas.width = newWidth;
        canvas.height = newHeight;
    }, []);

    // --- Effect for Initial Resize and Listener ---
    useEffect(() => {
        handleResize(); // Initial size calculation
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);


    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'arrowup') socket.emit('player_move', { playerId: 'player2', direction: 'up' });
            if (key === 'arrowdown') socket.emit('player_move', { playerId: 'player2', direction: 'down' });
            if (key === 'w') socket.emit('player_move', { playerId: 'player1', direction: 'up' });
            if (key === 's') socket.emit('player_move', { playerId: 'player1', direction: 'down' });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="game-container flex justify-center items-center min-h-screen w-full h-svh p-4 overflow-hidden"> {/* Added w-full h-screen, padding, bg, overflow */}
            <canvas
                ref={canvasRef}
                className="game-canvas" 
            />
        </div>
    );
};

export default GameCanvas;