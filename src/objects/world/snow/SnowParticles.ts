import { Vector2D } from "../../../math/Vector2D.ts";
import { GameObject } from "../../../framework/GameObject.ts";

import { ParticleContainer, Particle, Assets, IRenderLayer } from 'pixi.js';

interface SnowParticle {
    particle: Particle;
    phaseOffset: number;
}

export class SnowParticles extends GameObject{
    private particles: SnowParticle[] = [];
    private size: number;
    private layer?: IRenderLayer;

    constructor(parent: GameObject, size: number, position: Vector2D, layer?: IRenderLayer){
        super(parent, position);
        this.size = size;
        this.layer = layer;
    }

    protected override async createOwnSprites(): Promise<void> {
        this.layer?.attach(this.container);
        
        // Create a particle container with default options
        const container = new ParticleContainer({
            dynamicProperties: {
                position: true, // Allow dynamic position changes (default)
                scale: false, // Static scale for extra performance
                rotation: false, // Static rotation
                color: false, // Static color
            },
        });
        
        // Add particles
        const texture = await Assets.load("/Snowflake.png");
        
        for (let i = 0; i < 100; ++i) {
            const particle = new Particle({
                texture,
                x: Math.random() * this.size,
                y: Math.random() * this.size,
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
            snowParticle.particle.x += (Math.cos(a)) * 0.1;
            snowParticle.particle.y -= 2 * (Math.sin(2 * a)) * 0.1;
        }
    }
}