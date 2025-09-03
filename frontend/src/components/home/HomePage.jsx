import React, { useContext, useRef, useEffect, useState } from 'react';
import { Zap, TrendingUp, BookOpen, ShieldCheck, ChevronDown, Sparkles, Moon, Sun, Users, Award, Clock, Target, Star, PlayCircle, ArrowRight, Briefcase, Globe, Brain } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../App';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Enhanced Three.js background with improved colors for both modes
const useEnhancedBackground = (containerRef, darkMode) => {
  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.offsetWidth || window.innerWidth;
    let height = containerRef.current.offsetHeight || 600;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Professional particle system with adaptive colors
    const createParticleLayer = (count, colorLight, colorDark, size, speed) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        // Adaptive colors based on mode
        const baseColor = darkMode ? colorDark : colorLight;
        const particleColor = new THREE.Color(baseColor);
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * size + 1;
        
        velocities[i * 3] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          darkMode: { value: darkMode ? 1.0 : 0.0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          uniform float darkMode;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            pos.y += sin(time * 0.3 + position.x * 0.08) * 2.5;
            pos.x += cos(time * 0.2 + position.z * 0.06) * 2.0;
            pos.z += sin(time * 0.25 + position.y * 0.07) * 1.5;
            
            vAlpha = sin(time * 0.5 + position.x + position.y) * 0.4 + 0.7;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (400.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          uniform float darkMode;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= vAlpha;
            
            // Professional color adaptation
            vec3 color = mix(
              vColor * 0.8,  // Light mode - more subtle
              vColor * 1.2,  // Dark mode - more vibrant
              darkMode
            );
            
            gl_FragColor = vec4(color, alpha * mix(0.6, 0.9, darkMode));
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });

      return { 
        points: new THREE.Points(geometry, material), 
        material, 
        velocities: velocities 
      };
    };

    // Professional color palette
    const particleLayers = [
      createParticleLayer(150, 0x6366f1, 0x8b5cf6, 3, 0.015), // Indigo/Purple
      createParticleLayer(120, 0x06b6d4, 0x0ea5e9, 2.5, 0.012), // Cyan/Blue  
      createParticleLayer(100, 0x10b981, 0x059669, 2, 0.01), // Emerald/Green
      createParticleLayer(80, 0xf59e0b, 0xd97706, 1.5, 0.008), // Amber/Orange
    ];

    particleLayers.forEach(layer => scene.add(layer.points));

    // Enhanced geometric shapes with professional colors
    const shapes = [];
    const shapeGeometries = [
      new THREE.OctahedronGeometry(1.0, 1),
      new THREE.TetrahedronGeometry(0.8, 1),
      new THREE.IcosahedronGeometry(0.6, 1),
      new THREE.DodecahedronGeometry(0.9, 1)
    ];

    // Professional shape colors
    const shapeColors = darkMode 
      ? [0x8b5cf6, 0x0ea5e9, 0x059669, 0xd97706, 0xdc2626] // Vibrant for dark mode
      : [0x6366f1, 0x06b6d4, 0x10b981, 0xf59e0b, 0xef4444]; // Subtle for light mode

    for (let i = 0; i < 10; i++) {
      const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(shapeColors[Math.floor(Math.random() * shapeColors.length)]) },
          darkMode: { value: darkMode ? 1.0 : 0.0 }
        },
        vertexShader: `
          uniform float time;
          varying vec3 vPosition;
          
          void main() {
            vPosition = position;
            vec3 pos = position;
            
            pos *= 1.0 + sin(time * 0.6 + length(position)) * 0.08;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          uniform float darkMode;
          varying vec3 vPosition;
          
          void main() {
            float intensity = sin(time * 0.4 + length(vPosition)) * 0.3 + 0.8;
            
            vec3 finalColor = color * mix(0.7, 1.1, darkMode) * intensity;
            
            float alpha = mix(0.4, 0.7, darkMode) * intensity;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        wireframe: false,
        side: THREE.DoubleSide
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );
      
      shapes.push(shape);
      scene.add(shape);
    }

    camera.position.z = 18;

    // Animation loop
    let running = true;
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      
      const elapsedTime = clock.getElapsedTime();
      
      // Update particles
      particleLayers.forEach(layer => {
        layer.material.uniforms.time.value = elapsedTime;
        layer.material.uniforms.darkMode.value = darkMode ? 1.0 : 0.0;
        
        const positions = layer.points.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += layer.velocities[i];
          positions[i + 1] += layer.velocities[i + 1];
          positions[i + 2] += layer.velocities[i + 2];
          
          if (Math.abs(positions[i]) > 25) layer.velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 25) layer.velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 25) layer.velocities[i + 2] *= -1;
        }
        layer.points.geometry.attributes.position.needsUpdate = true;
      });
      
      // Update shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005;
        shape.rotation.y += 0.008;
        shape.rotation.z += 0.003;
        shape.position.y += Math.sin(elapsedTime + index) * 0.001;
        shape.material.uniforms.time.value = elapsedTime;
        shape.material.uniforms.darkMode.value = darkMode ? 1.0 : 0.0;
      });

      camera.position.z = 18 + Math.sin(elapsedTime * 0.3) * 0.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      gsap.to(camera.position, {
        x: mouse.x * 1.5,
        y: mouse.y * 1,
        duration: 2.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.offsetWidth;
      height = containerRef.current.offsetHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      particleLayers.forEach(layer => {
        layer.points.geometry.dispose();
        layer.material.dispose();
      });
      shapes.forEach(shape => {
        shape.geometry.dispose();
        shape.material.dispose();
      });
      shapeGeometries.forEach(geo => geo.dispose());
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, darkMode]);
};

// Enhanced GSAP animations
const useEnhancedAnimations = (refs) => {
  const { heroRef, ctaRef, featuresRef, cardsRef, headerRef, statsRef, pathsRef } = refs;

  useEffect(() => {
    const masterTimeline = gsap.timeline();

    // Header animation
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -100, opacity: 0 });
      masterTimeline.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }, 0);
    }

    // Hero section
    if (heroRef.current) {
      const heroElements = heroRef.current.children;
      gsap.set(heroElements, { opacity: 0, y: 80, scale: 0.9 });
      
      masterTimeline
        .to(heroElements[0], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }, 0.3)
        .to(heroElements[1], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }, 0.6)
        .to(heroElements[2], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        }, 1.0)
        .to(heroElements[3], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.4)"
        }, 1.4)
        .to(heroElements[4], {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        }, 1.8);
    }

    // Stats section
    if (statsRef.current) {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          const statNumbers = statsRef.current.querySelectorAll('.stat-number');
          
          gsap.fromTo(statsRef.current.children, 
            { opacity: 0, y: 50, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "power3.out"
            }
          );

          statNumbers.forEach((element, index) => {
            const finalNumber = parseInt(element.dataset.count);
            gsap.to({ count: 0 }, {
              count: finalNumber,
              duration: 2,
              delay: index * 0.2,
              ease: "power2.out",
              onUpdate: function() {
                const suffix = element.dataset.suffix || '';
                element.textContent = Math.floor(this.targets()[0].count).toLocaleString() + suffix;
              }
            });
          });
        }
      });
    }

    // Learning paths section
    if (pathsRef.current) {
      ScrollTrigger.create({
        trigger: pathsRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(pathsRef.current.children,
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out"
            }
          );
        }
      });
    }

    // Features section
    if (featuresRef.current) {
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(featuresRef.current,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out"
            }
          );
        }
      });
    }

    // Feature cards
    if (cardsRef.current) {
      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(cardsRef.current.children,
            { 
              opacity: 0, 
              y: 80, 
              scale: 0.9 
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: "back.out(1.2)"
            }
          );
        }
      });
    }

    // CTA section
    if (ctaRef.current) {
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.fromTo(ctaRef.current,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out"
            }
          );
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [refs]);
};

// Enhanced Feature Card with professional colors
const FeatureCard = ({ icon, title, description, gradient, index, delay = 0 }) => {
  const Icon = icon;
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;

    const card = cardRef.current;
    const icon = iconRef.current;

    // Floating animation
    gsap.to(card, {
      y: Math.sin(index * 1.2) * 6,
      duration: 4 + index * 0.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: delay
    });

    // Hover interactions
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(icon, {
        scale: 1.2,
        rotation: 180,
        duration: 0.5,
        ease: "back.out(1.4)"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
      
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index, delay]);

  return (
    <div
      ref={cardRef}
      className={`relative text-center p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-xl group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
      style={{ willChange: "transform" }}
    >
      <div className="relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-400/30 dark:via-purple-400/30 dark:to-pink-400/30 rounded-full blur-lg opacity-70" />
          <div 
            ref={iconRef}
            className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 inline-block shadow-lg border border-indigo-200/50 dark:border-gray-600/50"
            style={{ willChange: "transform" }}
          >
            <Icon className="text-indigo-600 dark:text-indigo-400" size={32} />
          </div>
        </div>
        
        <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  );
};



const HomePage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for animations
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const cardsRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const pathsRef = useRef(null);

  // Initialize Three.js background
  useEnhancedBackground(bgRef, darkMode);

  // Initialize GSAP animations
  useEnhancedAnimations({
    heroRef,
    ctaRef,
    featuresRef,
    cardsRef,
    headerRef,
    statsRef,
    pathsRef
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths powered by advanced AI that adapts to your pace, style, and goals for maximum effectiveness.",
      gradient: "from-blue-100/80 via-indigo-50/80 to-purple-100/80"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers, join study groups, and learn together in our vibrant community of ambitious learners.",
      gradient: "from-green-100/80 via-emerald-50/80 to-teal-100/80"
    },
    {
      icon: Target,
      title: "Goal-Oriented Tracking",
      description: "Set learning objectives, track milestones, and celebrate achievements with our comprehensive progress system.",
      gradient: "from-orange-100/80 via-amber-50/80 to-yellow-100/80"
    },
    {
      icon: Award,
      title: "Industry Certifications",
      description: "Earn recognized certificates and badges that boost your career prospects and validate your expertise.",
      gradient: "from-purple-100/80 via-fuchsia-50/80 to-pink-100/80"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with 24/7 access to courses, live sessions, and recorded lectures that fit your lifestyle.",
      gradient: "from-cyan-100/80 via-sky-50/80 to-blue-100/80"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join learners from 150+ countries, access content in multiple languages, and broaden your global perspective.",
      gradient: "from-rose-100/80 via-pink-50/80 to-red-100/80"
    }
  ];

  const learningPaths = [
    { 
      title: "Technology & Programming", 
      description: "Master coding, web development, AI, and emerging technologies with hands-on projects",
      icon: "💻",
      color: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Business & Entrepreneurship", 
      description: "Build business acumen, leadership skills, and startup knowledge for career growth",
      icon: "🚀",
      color: "from-purple-500 to-pink-600"
    },
    { 
      title: "Creative Arts & Design", 
      description: "Explore graphic design, video production, and digital creativity with industry tools",
      icon: "🎨",
      color: "from-pink-500 to-rose-600"
    },
    { 
      title: "Science & Engineering", 
      description: "Dive deep into STEM subjects and engineering principles with real-world applications",
      icon: "🔬",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className={`bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 min-h-screen relative overflow-x-hidden transition-all duration-700 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* ENHANCED HEADER */}
      <header 
        ref={headerRef}
        className="bg-white/95 dark:bg-gray-900/95 shadow-lg sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="hidden md:block">
                <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                  EduSmart
                </span>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Transform Your Future
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={toggleDarkMode}
                className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <Link to="/login">
                <Button className="shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm md:text-base">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ENHANCED HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-12 md:py-0">
        {/* Three.js Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
        />
        
        {/* Enhanced Parallax Elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 dark:from-indigo-400/20 dark:to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-[32rem] h-80 md:h-[32rem] bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 dark:from-cyan-500/25 dark:to-blue-500/25 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 left-1/3 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-r from-emerald-500/15 to-teal-400/15 dark:from-emerald-500/25 dark:to-teal-400/25 rounded-full blur-2xl" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-6 z-10 relative">
          <div ref={heroRef} className="flex flex-col items-center text-center max-w-6xl mx-auto">
            
            <span className="hero-badge inline-flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-full bg-gradient-to-r from-indigo-100/90 to-purple-100/90 dark:from-indigo-900/90 dark:to-purple-800/90 text-indigo-700 dark:text-indigo-300 font-bold text-sm md:text-base shadow-lg mb-6 md:mb-8 backdrop-blur-xl border border-indigo-200/40 dark:border-indigo-700/40">
              <Star className="text-amber-500" size={16} />
              New: Gamified Learning Experience
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-gray-100 mb-6 md:mb-8 leading-[0.9]">
              Master Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Future
              </span>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Today</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Join <span className="font-black text-purple-600 dark:text-purple-400">50,000+ learners</span> on the world's most{' '}
              <span className="font-black text-indigo-600 dark:text-indigo-400">innovative educational platform</span>.
              <br className="hidden sm:block" />
              Unlock your potential with AI-powered personalized learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-12 md:mb-16">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-lg md:text-xl lg:text-2xl px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 text-white shadow-2xl rounded-xl md:rounded-2xl font-black hover:shadow-indigo-400/40 transition-all duration-500 hover:scale-105 group"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 md:ml-3 inline group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              
            </div>

            <button
              onClick={scrollToFeatures}
              className="animate-bounce hover:animate-pulse transition-all duration-300 group"
              aria-label="Scroll to features"
            >
              <ChevronDown className="text-indigo-500 dark:text-indigo-400 w-10 md:w-12 h-10 md:h-12 group-hover:scale-125 transition-transform drop-shadow-lg" />
            </button>
          </div>
        </div>

        {/* Enhanced Floating Preview Cards */}
        <div className="absolute bottom-10 md:bottom-20 left-1/2 transform -translate-x-1/2 z-[2] flex gap-4 md:gap-8 opacity-70 pointer-events-none">
          <div className="w-32 md:w-48 h-20 md:h-32 lg:w-64 lg:h-40 bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl shadow-xl border border-indigo-200/60 dark:border-indigo-700/60 backdrop-blur-2xl transform rotate-[-12deg] transition-transform duration-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl md:text-4xl mb-1 md:mb-2">🚀</div>
              <div className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300">Career Boost</div>
            </div>
          </div>
          <div className="w-32 md:w-48 h-20 md:h-32 lg:w-64 lg:h-40 bg-gradient-to-br from-indigo-200/70 via-purple-300/60 to-pink-200/50 dark:from-indigo-800/70 dark:via-purple-700/50 dark:to-pink-700/40 rounded-2xl md:rounded-3xl shadow-xl backdrop-blur-2xl transform rotate-[8deg] transition-transform duration-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎯</div>
              <div className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300">Goal Achievement</div>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING PATHS SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white/90 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
              Choose Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                Learning Path
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore diverse fields of study designed by industry experts and tailored for modern learners
            </p>
          </div>
          
          <div ref={pathsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {learningPaths.map((path, index) => (
              <div 
                key={index}
                className="group p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
              >
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {path.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {path.title}
                </h3>
                <p className={`text-transparent bg-clip-text bg-gradient-to-r ${path.color} font-semibold mb-3 text-sm md:text-base`}>
                  {path.courses}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {path.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES SECTION */}
      <section 
        id="features-section" 
        className="py-20 md:py-32 bg-gradient-to-b from-indigo-50/30 via-white/80 to-purple-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div ref={featuresRef} className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 md:mb-8">
              Why{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                EduSmart
              </span>{' '}
              Leads
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the future of education with cutting-edge technology, personalized learning, and a global community of ambitious learners
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                {...feature} 
                index={index}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="absolute right-0 top-1/2 w-64 md:w-[40rem] h-64 md:h-[40rem] bg-gradient-to-l from-indigo-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-r from-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ENHANCED CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        <div
          ref={ctaRef}
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-6 md:mb-8 leading-tight">
            Ready to{' '}
            <span className="text-yellow-300 dark:text-yellow-400">
              Transform
            </span>{' '}
            Your Life?
          </h2>
          
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful learners who've already transformed their careers with EduSmart
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl rounded-xl md:rounded-2xl font-black transition-all duration-300 hover:scale-105 hover:shadow-white/30 group"
              >
                Create Your Free Account
                <Sparkles className="ml-2 md:ml-3 inline group-hover:rotate-12 transition-transform" size={20} />
              </Button>
            </Link>
            
          </div>
        </div>
        
        {/* Enhanced background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 md:w-4/5 h-32 md:h-40 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-l from-pink-400/20 to-transparent rounded-full blur-3xl" />
      </section>

      {/* SIMPLIFIED FOOTER */}
      <footer className="bg-gray-900/98 dark:bg-gray-950/98 text-white py-10 md:py-12 relative backdrop-blur-2xl border-t border-gray-700/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="font-black text-xl md:text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              EduSmart
            </span>
          </div>
          
          <p className="text-gray-400 text-base md:text-lg mb-3 md:mb-4">
            Transforming classrooms into adventure zones
          </p>
          
          <p className="text-gray-500 text-sm md:text-base">
            &copy; {new Date().getFullYear()} EduSmart. Transforming education, one learner at a time.
          </p>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60" />
      </footer>
    </div>
  );
};

export default HomePage;