'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced Autonomous Astronaut Brain
 * Smarter section detection with better behavior patterns
 */
export default function AutonomousAstronautBrain() {
    const [aiState, setAiState] = useState({
        currentAction: 'walk',
        targetSection: 'hero',
        status: 'Initializing...',
        confidence: 50,
        issues: [],
    });

    const stateRef = useRef({
        lastAction: null,
        lastSection: null,
        sectionChangeTime: Date.now(),
        actionDuration: 0,
    });

    // Detect which section is most visible
    const detectCurrentSection = () => {
        const sections = {
            hero: document.getElementById('hero'),
            projects: document.getElementById('projects'),
            activity: document.getElementById('activity'),
            skills: document.getElementById('skills'),
            about: document.getElementById('about'),
            contact: document.getElementById('contact'),
        };

        let closestSection = 'hero';
        let closestDistance = Infinity;
        let highestVisibility = 0;

        Object.entries(sections).forEach(([name, element]) => {
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = Math.abs(rect.top - viewportCenter);

            // Check how much of section is visible
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(window.innerHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / window.innerHeight;

            if (visibility > highestVisibility) {
                highestVisibility = visibility;
                closestSection = name;
                closestDistance = distanceFromCenter;
            }
        });

        return closestSection;
    };

    // Determine action based on section with variety
    const getActionForSection = (section) => {
        const sectionBehaviors = {
            hero: {
                primary: { action: 'walk', target: { x: 0, y: 0.3 }, status: '🚶 Exploring hero section' },
                secondary: { action: 'walk', target: { x: -0.3, y: 0.2 }, status: '🚶 Walking through intro' },
                confidence: 90,
            },
            projects: {
                primary: { action: 'repair', target: { x: 0.5, y: -0.2 }, status: '🔧 Fixing project cards' },
                secondary: { action: 'walk', target: { x: -0.4, y: -0.3 }, status: '🔍 Inspecting projects' },
                confidence: 85,
            },
            activity: {
                primary: { action: 'fly', target: { x: 0, y: 0.9 }, status: '🚀 Flying over activity feed' },
                secondary: { action: 'fly', target: { x: 0.4, y: 0.7 }, status: '🚀 Scanning data visualization' },
                confidence: 95,
            },
            skills: {
                primary: { action: 'walk', target: { x: -0.4, y: 0.1 }, status: '🚶 Analyzing skill tags' },
                secondary: { action: 'repair', target: { x: 0.3, y: 0.2 }, status: '🔧 Optimizing skills' },
                confidence: 80,
            },
            about: {
                primary: { action: 'repair', target: { x: -0.6, y: -0.3 }, status: '🔧 Reviewing biography' },
                secondary: { action: 'walk', target: { x: 0.2, y: -0.2 }, status: '🚶 Reading about section' },
                confidence: 75,
            },
            contact: {
                primary: { action: 'fly', target: { x: 0, y: 1 }, status: '🚀 Flying to contact form' },
                secondary: { action: 'walk', target: { x: 0.5, y: 0.8 }, status: '📬 Ready to connect' },
                confidence: 90,
            },
        };

        const behavior = sectionBehaviors[section] || sectionBehaviors.hero;

        // Alternate between primary and secondary for variety
        const time = Date.now();
        const cycle = Math.floor(time / 8000) % 2; // Alternate every 8 seconds
        const selected = cycle === 0 ? behavior.primary : behavior.secondary;

        return {
            ...selected,
            confidence: behavior.confidence,
        };
    };

    // Main AI loop - Smart and adaptive
    const runAILoop = () => {
        const section = detectCurrentSection();
        const { action, target, status, confidence } = getActionForSection(section);

        // Only send command if section changed or enough time passed
        const timeSinceLastChange = Date.now() - stateRef.current.sectionChangeTime;
        const shouldUpdate =
            stateRef.current.lastSection !== section ||
            stateRef.current.lastAction !== action ||
            timeSinceLastChange > 5000; // Update every 5 seconds even in same section

        if (shouldUpdate) {
            // Send command to astronaut
            window.dispatchEvent(
                new CustomEvent('astronaut-autonomous-action', {
                    detail: {
                        action,
                        target,
                        status,
                        section,
                    },
                })
            );

            stateRef.current.lastSection = section;
            stateRef.current.lastAction = action;
            stateRef.current.sectionChangeTime = Date.now();

            console.log(`🧠 AI Decision: Section="${section}" → Action="${action}" (${confidence}% confidence)`);
        }

        // Occasional boosts for visual interest
        if (Math.random() > 0.93) {
            window.dispatchEvent(new CustomEvent('astro-boost'));
            console.log('⚡ Random boost!');
        }

        setAiState({
            currentAction: action,
            targetSection: section,
            status,
            confidence,
        });
    };

    // Initialize AI loop
    useEffect(() => {
        runAILoop();
        const interval = setInterval(runAILoop, 1200); // Run every 1.2 seconds
        return () => clearInterval(interval);
    }, []);

    return null;
}