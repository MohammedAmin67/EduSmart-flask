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

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const useSimpleBackground = (containerRef, darkMode) => {
  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.offsetWidth || window.innerWidth;
    let height = containerRef.current.offsetHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const createSubtleParticles = () => {
      const particleCount = 30;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const baseColor = darkMode ? 0x6366f1 : 0x8b5cf6;
        const particleColor = new THREE.Color(baseColor);
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;

        sizes[i] = Math.random() * 2 + 0.5;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          void main() {
            vColor = color;
            vec3 pos = position;
            pos.y += sin(time * 0.1 + position.x * 0.02) * 1.0;
            pos.x += cos(time * 0.08 + position.z * 0.02) * 0.8;
            vAlpha = sin(time * 0.2 + position.x + position.y) * 0.2 + 0.6;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= vAlpha * 0.4;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });

      return { points: new THREE.Points(geometry, material), material };
    };

    const particleSystem = createSubtleParticles();
    scene.add(particleSystem.points);

    camera.position.z = 15;

    let running = true;
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      const elapsedTime = clock.getElapsedTime();
      particleSystem.material.uniforms.time.value = elapsedTime;
      camera.position.x = Math.sin(elapsedTime * 0.1) * 0.3;
      camera.position.y = Math.cos(elapsedTime * 0.08) * 0.2;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
      gsap.to(camera.position, {
        x: mouse.x * 0.5,
        y: mouse.y * 0.3,
        duration: 3,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.offsetWidth;
      height = containerRef.current.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      particleSystem.points.geometry.dispose();
      particleSystem.material.dispose();
      renderer.dispose();
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, darkMode]);
};

const useEnhancedAnimations = (refs) => {
  const { heroRef, ctaRef, featuresRef, cardsRef, headerRef, statsRef, pathsRef } = refs;
  useEffect(() => {
    const masterTimeline = gsap.timeline();
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -100, opacity: 0 });
      masterTimeline.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }, 0);
    }
    if (heroRef.current) {
      const heroElements = heroRef.current.children;
      gsap.set(heroElements, { opacity: 0, y: 80, scale: 0.9 });
      masterTimeline
        .to(heroElements[0], { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 0.3)
        .to(heroElements[1], { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 0.6)
        .to(heroElements[2], { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }, 1.0)
        .to(heroElements[3], { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, 1.4)
        .to(heroElements[4], { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }, 1.8);
    }
    if (statsRef.current) {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          const statNumbers = statsRef.current.querySelectorAll('.stat-number');
          gsap.fromTo(statsRef.current.children, 
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
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
    if (pathsRef.current) {
      ScrollTrigger.create({
        trigger: pathsRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(pathsRef.current.children,
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
          );
        }
      });
    }
    if (featuresRef.current) {
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(featuresRef.current,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
          );
        }
      });
    }
    if (cardsRef.current) {
      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(cardsRef.current.children,
            { opacity: 0, y: 80, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "back.out(1.2)" }
          );
        }
      });
    }
    if (ctaRef.current) {
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.fromTo(ctaRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
          );
        }
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [refs]);
};

const FeatureCard = ({ icon, title, description, gradient, index, delay = 0 }) => {
  const Icon = icon;
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;
    const card = cardRef.current;
    const icon = iconRef.current;
    gsap.to(card, {
      y: Math.sin(index * 1.2) * 6,
      duration: 4 + index * 0.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: delay
    });
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(icon, {
        scale: 1.2,
        duration: 0.8,
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
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </div>
    </div>
  );
};

const HomePage = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoaded, setIsLoaded] = useState(false);

  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const cardsRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const pathsRef = useRef(null);

  useSimpleBackground(bgRef, darkMode);
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

  // Features section: NO AI, no industry certifications, no global community
  const features = [
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
      icon: BookOpen,
      title: "Comprehensive Tech Content",
      description: "Dive deep into coding, web, app development, computer science, and more—built for tomorrow's technologists.",
      gradient: "from-blue-100/80 via-indigo-50/80 to-purple-100/80"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with 24/7 access to courses, live sessions, and recorded lectures that fit your lifestyle.",
      gradient: "from-cyan-100/80 via-sky-50/80 to-blue-100/80"
    },
    {
      icon: ShieldCheck,
      title: "Progress and Privacy",
      description: "Your learning progress is always private and secure, giving you peace of mind as you grow.",
      gradient: "from-fuchsia-100/80 via-pink-100/80 to-red-100/80"
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description: "New courses and features are added regularly to keep your skills sharp and up-to-date.",
      gradient: "from-amber-100/80 via-yellow-50/80 to-lime-100/80"
    }
  ];

  const learningPaths = [
    { 
      title: "Web Development", 
      description: "Master front-end and back-end web technologies and frameworks.",
      icon: "🌐",
      color: "from-blue-500 to-indigo-600"
    },
    { 
      title: "App Development", 
      description: "Learn to build mobile and desktop applications using modern tools.",
      icon: "📱",
      color: "from-purple-500 to-pink-600"
    },
    { 
      title: "Programming Fundamentals", 
      description: "Strengthen your logic and problem-solving with core programming skills.",
      icon: "💡",
      color: "from-pink-500 to-rose-600"
    },
    { 
      title: "Computer Science Basics", 
      description: "Grasp the essentials: algorithms, data structures, and more.",
      icon: "🧠",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className={`bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 min-h-screen relative overflow-x-hidden transition-all duration-700 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* HEADER */}
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

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-12 md:py-0">
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 z-10 relative">
          <div ref={heroRef} className="flex flex-col items-center text-center max-w-6xl mx-auto">
            <span className="hero-badge inline-flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-full bg-gradient-to-r from-indigo-100/90 to-purple-100/90 dark:from-indigo-900/90 dark:to-purple-800/90 text-indigo-700 dark:text-indigo-300 font-bold text-sm md:text-base shadow-lg mb-6 md:mb-8 backdrop-blur-xl border border-indigo-200/40 dark:border-indigo-700/40">
              <Star className="text-amber-500" size={16} />
              New: Gamified Learning Experience
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-gray-100 mb-6 md:mb-8 leading-[0.9]">
              Anusha{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Future
              </span>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Today</span>
            </h1>
           <div className="mb-8 md:mb-12">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-indigo-600 to-purple-600 dark:from-gray-200 dark:via-indigo-400 dark:to-purple-400 max-w-5xl mx-auto leading-relaxed font-medium">
              From learners to leaders—reshaping how the world gains tech skills.
              <br className="hidden sm:block" />
              Code, create, and launch projects that matter in today's tech landscape.
            </p>
          </div>
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
              className="animate-bounce hover:animate-pulse transition-all duration-500 group"
              aria-label="Scroll to features"
            >
              <ChevronDown className="text-indigo-500 dark:text-indigo-400 w-10 md:w-12 h-10 md:h-12 group-hover:scale-125 transition-transform drop-shadow-lg" />
            </button>
          </div>
        </div>
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

      {/* LEARNING PATHS */}
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
              Explore focused technology tracks designed for modern developers and aspiring tech professionals.
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

      {/* FEATURES */}
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
        <div className="absolute right-0 top-1/2 w-64 md:w-[40rem] h-64 md:h-[40rem] bg-gradient-to-l from-indigo-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-r from-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* CALL TO ACTION */}
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
            Be among the first to shape your tech future with EduSmart.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 text-indigo-600 hover:bg-gray-100 shadow-2xl rounded-xl md:rounded-2xl font-black transition-all duration-300 hover:scale-105 hover:shadow-white/30 group"
              >
                Create Your Free Account
                <Sparkles className="ml-2 md:ml-3 inline group-hover:rotate-12 transition-transform" size={20} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 md:w-4/5 h-32 md:h-40 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-l from-pink-400/20 to-transparent rounded-full blur-3xl" />
      </section>

      {/* FOOTER */}
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