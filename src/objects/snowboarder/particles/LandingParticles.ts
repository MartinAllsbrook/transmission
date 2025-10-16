import { Assets, Particle, ParticleContainer } from "pixi.js";
import { GameObject } from "../../GameObject.ts";
import { ExtraMath } from "../../../math/ExtraMath.ts";

interface LandingParticle {
    particle: Particle;
    
    age: number;
    
    lifetime: number;
    direction: number;
    speed: number;
}

export class LandingParticles extends GameObject {
    private particleContainer: ParticleContainer;

    private particles: LandingParticle[] = [];

    constructor(parent: GameObject){
        super(parent);
    
        this.particleContainer = new ParticleContainer({
            dynamicProperties: {
                position: true, // Allow dynamic position changes (default)
                scale: false, // Static scale for extra performance
                rotation: false, // Static rotation
                color: false, // Static color
                alpha: true, // Allow dynamic alpha changes
            },
        });

        this.container.addChild(this.particleContainer);
    }

    public async playParticles(strength: number) {
        console.log(`Playing landing particles with strength: ${strength}`);

        const numParticles = ExtraMath.clamp(Math.floor(strength * 20), 20, 100);

        const texture = await Assets.load("/Sparkle.png");

        for (let i = 0; i < numParticles; i++) {
            const particle: LandingParticle = {
                particle: new Particle({texture, x: 0, y: 0}),
                age: 0,
                lifetime: ExtraMath.lerp(0.5, 1.5, Math.random()),
                direction: Math.random() * Math.PI * 2, // Random direction in radians
                speed: ExtraMath.lerp(100, 300, Math.random()), // Random speed between 100 and 300
            }
            particle.particle.tint = '#00FFFF';
            this.particles.push(particle);
            this.particleContainer.addParticle(particle.particle);
        }
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime);

        for (const particle of this.particles) {
            particle.age += deltaTime;
            if (particle.age >= particle.lifetime) {
                // Remove particle
                this.particleContainer.removeParticle(particle.particle);
            } else {
                // Update particle position and alpha
                const lifeProgress = particle.age / particle.lifetime;
                const speed = ExtraMath.lerp(50, 200, 1 - lifeProgress); // Speed decreases over lifetime
                particle.particle.x += Math.cos(particle.direction) * speed * deltaTime;
                particle.particle.y += Math.sin(particle.direction) * speed * deltaTime;
                particle.particle.alpha = 1 - lifeProgress; // Fade out over lifetime
            }
        }

        // Remove dead particles from the array
        this.particles = this.particles.filter(p => p.age < p.lifetime);
    }
}