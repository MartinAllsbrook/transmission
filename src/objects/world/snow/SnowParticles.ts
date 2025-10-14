import { GameObject } from "../../GameObject.ts";

import { ParticleContainer, Particle, Texture, Assets } from 'pixi.js';

interface SnowParticle {
    particle: Particle;
    phaseOffset: number;
}

export class SnowParticles extends GameObject{
    private particles: SnowParticle[] = [];
    
    constructor(parent: GameObject){
        super(parent);
    }

    protected override async createOwnSprites(): Promise<void> {
        // Create a particle container with default options
        const container = new ParticleContainer({
            // this is the default, but we show it here for clarity
            dynamicProperties: {
                position: true, // Allow dynamic position changes (default)
                scale: false, // Static scale for extra performance
                rotation: false, // Static rotation
                color: false, // Static color
            },
        });
        
        // Add particles
        const texture = await Assets.load("/Warning.png");
        
        for (let i = 0; i < 100; ++i) {
            const particle = new Particle({
                texture,
                x: Math.random() * 800,
                y: Math.random() * 600,
            });
            
            const snowParticle: SnowParticle = {
                particle,
                phaseOffset: Math.random() * Math.PI * 2 // Random phase offset between 0 and 2π
            };
            
            this.particles.push(snowParticle);

            container.addParticle(particle);
        }
        
        // Add container to the Pixi stage
        this.container.addChild(container);

        return super.createOwnSprites();
    }

    public override update(_deltaTime: number): void {
        const time = Date.now() / 1000;
        
        for (const snowParticle of this.particles) {
            const a = time + snowParticle.phaseOffset;
            snowParticle.particle.x += (Math.cos(a));
            snowParticle.particle.y -= 2 * (Math.sin(2 * a));
        }
    }
}