'use client';

import { useEffect, useRef } from 'react';
import '../../../public/css/cat-button.css';
import { Button } from '../../ui/button';
import { useTyping } from './typing-context';

const MAX_RADIUS = 2;
const ANIMATION_SPEED = 100;
const ANIMATION_DELETING_SPEED = 60;

export default function Cat() {
    const { isTyping, isDeleting } = useTyping();

    const leftPaw = useRef<HTMLDivElement>(null);
    const rightPaw = useRef<HTMLDivElement>(null);
    const paws = useRef<HTMLSpanElement>(null);
    const circles = useRef<HTMLSpanElement>(null);
    const rpaws = useRef<HTMLSpanElement>(null);
    const rcircles = useRef<HTMLSpanElement>(null);
    const face = useRef<HTMLDivElement>(null);
    const eye = useRef<HTMLSpanElement>(null);

    let animationIntervalTyping: NodeJS.Timeout | null = null;
    let animationIntervalDeleting: NodeJS.Timeout | null = null;

    const startTypingAnimation = () => {
        if (animationIntervalTyping) return;

        animationIntervalTyping = setInterval(() => {
            leftPaw.current?.classList.toggle('left-paw');
            leftPaw.current?.classList.toggle('left-paw-typing');
            paws.current?.classList.toggle('paws');
            circles.current?.classList.toggle('circles');

            rightPaw.current?.classList.toggle('right-paw');
            rightPaw.current?.classList.toggle('right-paw-typing');
            rpaws.current?.classList.toggle('paws');
            rcircles.current?.classList.toggle('circles');

            if (!isTyping) stopTypingAnimation();
        }, ANIMATION_SPEED);
    };

    const startDeletingAnimation = () => {
        if (animationIntervalDeleting) return;

        animationIntervalDeleting = setInterval(() => {
            leftPaw.current?.classList.toggle('left-paw');
            leftPaw.current?.classList.toggle('left-paw-typing');
            paws.current?.classList.toggle('paws');
            circles.current?.classList.toggle('circles');

            if (!isDeleting) stopDeletingAnimation();
        }, ANIMATION_DELETING_SPEED);
    };

    const stopTypingAnimation = () => {
        if (animationIntervalTyping) {
            clearInterval(animationIntervalTyping);
            animationIntervalTyping = null;
        }

        paws.current?.classList.add('paws');
        circles.current?.classList.add('circles');
        rpaws.current?.classList.add('paws');
        rcircles.current?.classList.add('circles');

        leftPaw.current?.classList.add('left-paw');
        leftPaw.current?.classList.remove('left-paw-typing');
        rightPaw.current?.classList.add('right-paw');
        rightPaw.current?.classList.remove('right-paw-typing');
    };

    const stopDeletingAnimation = () => {
        if (animationIntervalDeleting) {
            clearInterval(animationIntervalDeleting);
            animationIntervalDeleting = null;
        }

        paws.current?.classList.add('paws');
        circles.current?.classList.add('circles');
        leftPaw.current?.classList.add('left-paw');
        leftPaw.current?.classList.remove('left-paw-typing');
    };

    const handleMouseMove = (e: MouseEvent) => {
        const containerRect = face.current?.getBoundingClientRect();
        if (!containerRect) return;

        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const clampedDistance = Math.min(distance, MAX_RADIUS);
        const angle = Math.atan2(dy, dx);

        const moveX = Math.cos(angle) * clampedDistance;
        const moveY = Math.sin(angle) * clampedDistance;
        if (eye.current) {
            eye.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        if (isTyping) startTypingAnimation();
        if (isDeleting) setTimeout(() => startDeletingAnimation(), 400); // ?? match with the text deletion speed

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            stopTypingAnimation();
            stopDeletingAnimation();
        };
    }, [isTyping, isDeleting]);

    return (
        <div className="cat-container">
            <div className="cat">
                <div className="cat-head border-t-[4px] border-gray-950 dark:border-gray-50 before:border-r-[4px] before:border-gray-950 dark:before:border-gray-50 after:border-l-[4px] after:border-gray-950 dark:after:border-gray-50"></div>
                <div className="cat-ears border-l-[3px] border-t-[4px] border-gray-950 dark:border-gray-50 before:border-l-[4px] before:border-gray-950 dark:before:border-gray-50">
                    <span className="right-ear border-r-[4px] border-gray-950 dark:border-gray-50 before:border-r-[4px] before:border-gray-950 dark:before:border-gray-50 after:border-r-[4px] after:border-gray-950 dark:after:border-gray-50"></span>
                </div>
                <div
                    ref={face}
                    className="face border-2 border-gray-950 dark:border-gray-50 before:border-2 before:border-gray-950 dark:before:border-gray-50"
                >
                    <span
                        ref={eye}
                        className="eye bg-gray-950 dark:bg-gray-50 before:bg-gray-950 dark:before:bg-gray-50"
                    ></span>
                    <span className="mouth border-[3px] border-gray-950 dark:border-gray-50 before:border-[3px] before:border-gray-950 dark:before:border-gray-50"></span>
                </div>
                <div
                    ref={leftPaw}
                    className="left-paw border-[4px] border-gray-950 dark:border-gray-50 before:bg-gray-950 dark:before:bg-gray-50"
                >
                    <span ref={paws} className="paws">
                        <span ref={circles} className="circles"></span>
                    </span>
                </div>
                <div
                    ref={rightPaw}
                    className="right-paw border-[3px] border-gray-950 dark:bg-gray-950 dark:border-gray-50 before:bg-gray-950 dark:before:bg-gray-50"
                >
                    <span ref={rpaws} className="paws">
                        <span ref={rcircles} className="circles"></span>
                    </span>
                </div>
            </div>

            <Button style={{ zIndex: 10 }} className="rotate-[10deg]">
                <a
                    href="https://www.linkedin.com/in/iamfuk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animated-gradient-text relative font-medium transition-colors duration-300"
                >
                    Let&apos;s connect
                </a>
            </Button>
        </div>
    );
}
